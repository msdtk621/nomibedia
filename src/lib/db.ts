import { createServerSupabaseClient, createAdminSupabaseClient } from './supabase-server'
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

  // 閲覧数の加算はRLSを跨ぐため管理者権限で行う
  createAdminSupabaseClient().from('games').update({ view_count: (data.view_count ?? 0) + 1 }).eq('id', id).then(() => {})

  return normalizeGame(data)
}

// OG画像・メタ用の軽量取得。getGameと違い閲覧数を加算しない
//（クローラーのOG画像取得で閲覧数が水増しされるのを防ぐ）。
export async function getGameMeta(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('games')
    .select('title, description, drink_level, player_count, category:categories(name, slug)')
    .eq('id', id)
    .single()
  return data
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

// シーン軸ページ用。keywords が title/description に含まれるゲームを人気順で抽出し、
// 件数が少なければ人気ゲームで補完する（新規サイトでもページが空にならないようにする）。
export async function getScenedGames(keywords: string[], limit = 12): Promise<Game[]> {
  const supabase = await createServerSupabaseClient()
  const select = `*, category:categories(*), game_tags(tag:tags(*))`

  let games: Game[] = []
  if (keywords.length > 0) {
    const orFilter = keywords
      .map((k) => `title.ilike.%${k}%,description.ilike.%${k}%`)
      .join(',')
    const { data: matched } = await supabase
      .from('games')
      .select(select)
      .or(orFilter)
      .order('like_count', { ascending: false })
      .limit(limit)
    games = (matched ?? []).map(normalizeGame)
  }

  // 関連ゲームが少ないときは人気ゲームで埋める（重複は除外）
  if (games.length < limit) {
    const { data: popular } = await supabase
      .from('games')
      .select(select)
      .order('like_count', { ascending: false })
      .limit(limit)
    const have = new Set(games.map((g) => g.id))
    for (const g of (popular ?? []).map(normalizeGame)) {
      if (games.length >= limit) break
      if (!have.has(g.id)) {
        games.push(g)
        have.add(g.id)
      }
    }
  }
  return games
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
