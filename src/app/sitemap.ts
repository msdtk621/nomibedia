import { createServerSupabaseClient } from '@/lib/supabase-server'
import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL
  const supabase = await createServerSupabaseClient()

  const { data: games } = await supabase.from('games').select('id, created_at').order('created_at', { ascending: false })
  const { data: categories } = await supabase.from('categories').select('slug')

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

  return [
    { url: base, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/ranking`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/new`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    ...categoryUrls,
    ...gameUrls,
  ]
}
