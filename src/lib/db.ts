import { createServerSupabaseClient } from './supabase-server'
import { type Game } from './types'

export async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return data ?? []
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
