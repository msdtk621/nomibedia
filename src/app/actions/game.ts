'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

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

  const authorId = Math.random().toString(36).slice(2, 10)

  let thumbnailUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${authorId}.${ext}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('game-images')
      .upload(filename, imageFile, { contentType: imageFile.type })
    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('game-images')
        .getPublicUrl(uploadData.path)
      thumbnailUrl = publicUrl
    }
  }

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
  }).select().single()

  if (error || !game) throw new Error('投稿に失敗しました')

  if (tagsRaw) {
    const tagNames = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 10)
    for (const name of tagNames) {
      const { data: tag } = await supabase
        .from('tags')
        .upsert({ name }, { onConflict: 'name' })
        .select()
        .single()
      if (tag) {
        await supabase.from('game_tags').insert({ game_id: game.id, tag_id: tag.id })
      }
    }
  }

  redirect(`/games/${game.id}`)
}
