import { createServerSupabaseClient } from './supabase-server'

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

export async function getGame(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('games')
    .select(`*, category:categories(*), game_tags(tag:tags(*))`)
    .eq('id', id)
    .single()
  if (!data) return null

  // increment view count
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

function normalizeGame(data: Record<string, unknown>) {
  return {
    ...data,
    tags: ((data.game_tags as Array<{ tag: unknown }>) ?? []).map((gt) => gt.tag),
  }
}
