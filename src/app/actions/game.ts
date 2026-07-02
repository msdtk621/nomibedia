'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// 薄い投稿を防ぐための最低限のバリデーション（AdSense審査・SEO品質対策）。
// ①ルール本文（rule_sectionsがあれば各textを連結、無ければrules）が20文字以上、
// ②人数(player_count)か必要なもの(required_items)のどちらかが入力されている、の両方を満たす必要がある。
function validateGameContent(
  rules: string,
  ruleSections: Array<{ text: string }> | null,
  playerCount: string[],
  requiredItems: string,
) {
  const rulesText = ruleSections && ruleSections.length > 0
    ? ruleSections.map((s) => s.text).join('')
    : rules
  const hasEnoughRules = rulesText.trim().length >= 20
  const hasDetails = playerCount.length > 0 || requiredItems.trim().length > 0
  if (!hasEnoughRules || !hasDetails) {
    throw new Error('ルールは20文字以上入力し、人数か必要なもののどちらかを入力してください')
  }
}

export async function postGame(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const title = formData.get('title') as string
  const categoryIds: string[] = JSON.parse((formData.get('category_ids') as string) || '[]')
  const categoryId = categoryIds[0] ?? null
  const description = formData.get('description') as string
  const requiredItems = formData.get('required_items') as string
  const rules = formData.get('rules') as string
  const tips = formData.get('tips') as string
  const loseCondition = formData.get('lose_condition') as string
  const tagsRaw = formData.get('tags') as string
  const drinkLevel = parseInt(formData.get('drink_level') as string) || 1
  const playerCount = JSON.parse((formData.get('player_count') as string) || '[]')
  const gameFlow = JSON.parse((formData.get('game_flow') as string) || '[]')
  const imageFile = formData.get('image') as File | null
  const referenceUrl = (formData.get('reference_url') as string) || null
  const ruleSectionsRaw = formData.get('rule_sections') as string | null
  const ruleSections = ruleSectionsRaw ? JSON.parse(ruleSectionsRaw) : null

  const authorId = (formData.get('author_id') as string) || Math.random().toString(36).slice(2, 10)

  const admin = createAdminSupabaseClient()
  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { data, error } = await admin.storage
      .from('game-images')
      .upload(filename, file, { contentType: file.type })
    if (error || !data) return null
    return admin.storage.from('game-images').getPublicUrl(data.path).data.publicUrl
  }

  let thumbnailUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    thumbnailUrl = await uploadImage(imageFile)
  }

  // ルールステップの画像をアップロードしてURLをマージ
  if (Array.isArray(ruleSections)) {
    for (const section of ruleSections) {
      if (section.mediaType === 'image') {
        const sectionFile = formData.get(`rule_image_${section.id}`) as File | null
        if (sectionFile && sectionFile.size > 0) {
          section.imageUrl = await uploadImage(sectionFile)
        }
      }
    }
  }

  validateGameContent(rules, ruleSections, playerCount, requiredItems)

  const { data: game, error } = await supabase.from('games').insert({
    title,
    category_id: categoryId,
    category_ids: categoryIds,
    description,
    required_items: requiredItems || null,
    rules,
    tips: tips || null,
    lose_condition: loseCondition || null,
    author_id: authorId,
    drink_level: drinkLevel,
    player_count: playerCount,
    game_flow: gameFlow,
    thumbnail_url: thumbnailUrl,
    reference_url: referenceUrl,
    rule_sections: ruleSections,
  }).select().single()

  if (error || !game) throw new Error('投稿に失敗しました')

  if (tagsRaw) {
    const tagNames = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 10)
    for (const name of tagNames) {
      const tagId = await getOrCreateTagId(name)
      if (tagId) {
        await supabase.from('game_tags').insert({ game_id: game.id, tag_id: tagId })
      }
    }
  }

  // キャッシュした一覧ページに新規ゲームを即反映
  revalidatePath('/')
  revalidatePath('/new')
  redirect(`/games/${game.id}`)
}

export async function deleteGame(gameId: string, authorId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: game } = await supabase.from('games').select('author_id').eq('id', gameId).single()
  if (!game || game.author_id !== authorId) throw new Error('削除権限がありません')
  // 本人確認済みなので管理者権限で削除（anonキーはRLSで削除がブロックされるため）
  const admin = createAdminSupabaseClient()
  await admin.from('reports').delete().eq('game_id', gameId)
  await admin.from('comments').delete().eq('game_id', gameId)
  await admin.from('game_tags').delete().eq('game_id', gameId)
  await admin.from('likes').delete().eq('game_id', gameId)
  await admin.from('games').delete().eq('id', gameId)
  // 削除をキャッシュした一覧・詳細に反映
  revalidatePath('/')
  revalidatePath('/new')
  revalidatePath(`/games/${gameId}`)
  redirect('/')
}

export async function updateGame(gameId: string, authorId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: game } = await supabase.from('games').select('author_id').eq('id', gameId).single()
  if (!game || game.author_id !== authorId) throw new Error('編集権限がありません')

  const title = formData.get('title') as string
  const categoryIds: string[] = JSON.parse((formData.get('category_ids') as string) || '[]')
  const description = formData.get('description') as string
  const requiredItems = formData.get('required_items') as string
  const rules = formData.get('rules') as string
  const tips = formData.get('tips') as string
  const loseCondition = formData.get('lose_condition') as string
  const tagsRaw = formData.get('tags') as string
  const drinkLevel = parseInt(formData.get('drink_level') as string) || 1
  const playerCount = JSON.parse((formData.get('player_count') as string) || '[]')
  const gameFlow = JSON.parse((formData.get('game_flow') as string) || '[]')
  const referenceUrl = (formData.get('reference_url') as string) || null
  const ruleSectionsRaw = formData.get('rule_sections') as string | null
  const ruleSections = ruleSectionsRaw ? JSON.parse(ruleSectionsRaw) : null

  // 本人確認済みなので以降の書き込みは管理者権限で行う（anonキーはUPDATE/DELETEがRLSでブロックされるため）
  const admin = createAdminSupabaseClient()

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { data, error } = await admin.storage.from('game-images').upload(filename, file, { contentType: file.type })
    if (error || !data) return null
    return admin.storage.from('game-images').getPublicUrl(data.path).data.publicUrl
  }

  // トップ画像の更新（新規アップロード / 削除 / 変更なし）
  const newImageFile = formData.get('image') as File | null
  const removeThumbnail = (formData.get('remove_thumbnail') as string) === '1'
  let thumbnailUpdate: { thumbnail_url: string | null } | null = null
  if (newImageFile && newImageFile.size > 0) {
    const url = await uploadImage(newImageFile)
    if (url) thumbnailUpdate = { thumbnail_url: url }
  } else if (removeThumbnail) {
    thumbnailUpdate = { thumbnail_url: null }
  }

  // 新しく追加されたステップ画像をアップロード（既存はimageUrlを維持）
  if (Array.isArray(ruleSections)) {
    for (const section of ruleSections) {
      if (section.mediaType === 'image') {
        const sectionFile = formData.get(`rule_image_${section.id}`) as File | null
        if (sectionFile && sectionFile.size > 0) {
          const ext = sectionFile.name.split('.').pop() ?? 'jpg'
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
          const { data, error } = await admin.storage
            .from('game-images')
            .upload(filename, sectionFile, { contentType: sectionFile.type })
          if (!error && data) {
            section.imageUrl = admin.storage.from('game-images').getPublicUrl(data.path).data.publicUrl
          }
        }
      } else {
        section.imageUrl = null
      }
    }
  }

  validateGameContent(rules, ruleSections, playerCount, requiredItems)

  await admin.from('games').update({
    title,
    category_id: categoryIds[0] ?? null,
    category_ids: categoryIds,
    description,
    required_items: requiredItems || null,
    rules,
    tips: tips || null,
    lose_condition: loseCondition || null,
    drink_level: drinkLevel,
    player_count: playerCount,
    game_flow: gameFlow,
    reference_url: referenceUrl,
    rule_sections: ruleSections,
    ...(thumbnailUpdate ?? {}),
  }).eq('id', gameId)

  if (tagsRaw !== null) {
    await admin.from('game_tags').delete().eq('game_id', gameId)
    const tagNames = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 10)
    for (const name of tagNames) {
      const tagId = await getOrCreateTagId(name)
      if (tagId) {
        await admin.from('game_tags').insert({ game_id: gameId, tag_id: tagId })
      }
    }
  }

  // 編集内容をキャッシュした詳細・一覧に即反映
  revalidatePath(`/games/${gameId}`)
  revalidatePath('/')
  revalidatePath('/new')
  redirect(`/games/${gameId}`)
}

// タグを「探す→無ければ作る」で取得（管理者権限でRLSブロックを回避）
async function getOrCreateTagId(name: string): Promise<string | null> {
  const admin = createAdminSupabaseClient()
  const { data: existing } = await admin.from('tags').select('id').eq('name', name).maybeSingle()
  if (existing) return existing.id
  const { data: created } = await admin.from('tags').insert({ name }).select('id').single()
  return created?.id ?? null
}
