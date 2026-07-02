import { createPublicSupabaseClient } from '@/lib/supabase-server'
import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { scenes } from '@/lib/scenes'
import { gameLists } from '@/lib/lists'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL
  const supabase = createPublicSupabaseClient()

  const { data: games } = await supabase.from('games').select('id, created_at').order('created_at', { ascending: false })
  const { data: categories } = await supabase.from('categories').select('slug')
  const { data: boardGames } = await supabase.from('board_games').select('id, created_at').order('created_at', { ascending: false })

  const gameUrls = (games ?? []).map(g => ({
    url: `${base}/games/${g.id}`,
    lastModified: new Date(g.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryUrls = (categories ?? []).map(c => ({
    url: `${base}/category/${c.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  const boardGameUrls = (boardGames ?? []).map(bg => ({
    url: `${base}/board-games/${bg.id}`,
    lastModified: new Date(bg.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const sceneUrls = scenes.map(s => ({
    url: `${base}/scene/${s.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const listUrls = gameLists.map(l => ({
    url: `${base}/list/${l.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: base, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/ranking`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/new`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/board-games`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/comments`, changeFrequency: 'daily', priority: 0.5 },
    { url: `${base}/about`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    ...sceneUrls,
    ...listUrls,
    ...categoryUrls,
    ...boardGameUrls,
    ...gameUrls,
  ]
}
