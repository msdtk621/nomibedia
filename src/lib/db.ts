import { createServerSupabaseClient } from './supabase-server'
import { type Game } from './types'

export async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return data ?? []
}

export async function getNotices() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return (data ?? []) as Array<{ id: string; content: string; created_at: string }>
}

export async function getGames({ categorySlug, tag, q }: { categorySlug?: string; tag?: string; q?: string } = {}) {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('games')
    .select(`*, category:categories(*), game_tags(tag:tags(*))`)
    .order('created_at', { ascending: false })

  if (categorySlug && categorySlug !== 'all') {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (tag) {
    const { data: tagRow } = await supabase.from('tags').select('id').eq('name', tag).single()
    const { data: gameTags } = tagRow
      ? await supabase.from('game_tags').select('game_id').eq('tag_id', tagRow.id)
      : { data: null }
    const gameIds = (gameTags ?? []).map(gt => gt.game_id)
    // 一致するタグが無ければ空の結果を返す（全件表示にフォールバックしない）
    query = query.in('id', gameIds.length > 0 ? gameIds : ['__none__'])
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }

  const { data } = await query
  return (data ?? []).map(normalizeGame)
}

export async function getGamesByIds(ids: string[]) {
  if (ids.length === 0) return []
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('games')
    .select(`*, category:categories(*), game_tags(tag:tags(*))`)
    .in('id', ids)
  // localStorage順を保つ
  const map = new Map((data ?? []).map(g => [g.id, normalizeGame(g)]))
  return ids.map(id => map.get(id)).filter(Boolean) as Game[]
}

export async function getGame(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('games')
    .select(`*, category:categories(*), game_tags(tag:tags(*))`)
    .eq('id', id)
    .single()
  if (!data) return null

  await supabase.from('games').update({ view_count: (data.view_count ?? 0) + 1 }).eq('id', id)

  return normalizeGame(data)
}

export async function getComments(gameId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('game_id', gameId)
    .order('number', { ascending: true })
  return data ?? []
}

export async function getRankedGames() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('games')
    .select(`*, category:categories(*), game_tags(tag:tags(*))`)
    .order('like_count', { ascending: false })
    .limit(20)
  return (data ?? []).map(normalizeGame)
}

function normalizeGame(data: Record<string, unknown>): Game {
  return {
    ...data,
    tags: ((data.game_tags as Array<{ tag: { id: string; name: string } }>) ?? []).map((gt) => gt.tag),
  } as unknown as Game
}
