import { createServerSupabaseClient } from '@/lib/supabase-server'
import { type Game } from '@/lib/types'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import { asset } from '@/lib/asset'

export const revalidate = 0

type Period = '24h' | 'week' | 'month' | 'all'

function getPeriodStart(period: Period): string | null {
  const now = new Date()
  if (period === '24h') return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  if (period === 'week') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  if (period === 'month') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  return null
}

const periodLabels: Record<Period, string> = { '24h': '24時間', week: '週間', month: '月間', all: '全期間' }

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: rawPeriod } = await searchParams
  const period: Period = (['24h', 'week', 'month', 'all'].includes(rawPeriod ?? '') ? rawPeriod : 'all') as Period

  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('games')
    .select('*, category:categories(*), game_tags(tag:tags(*))')
    .order('like_count', { ascending: false })
    .limit(20)

  const since = getPeriodStart(period)
  if (since) query = query.gte('created_at', since)

  const { data } = await query
  const games = (data ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    tags: ((g.game_tags as Array<{ tag: { id: string; name: string } }>) ?? []).map(gt => gt.tag),
  } as unknown as Game))

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/crown.jpeg")} alt="ランキング" className="w-8 h-8 rounded object-cover" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">人気ランキング</h1>
            <p className="text-gray-500 text-sm">みんなが「いいね！」した飲みゲーランキング</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <a key={p} href={`/ranking?period=${p}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                period === p ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-400'
              }`}>
              {periodLabels[p]}
            </a>
          ))}
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/crown.jpeg")} alt="ランキング" className="w-10 h-10 rounded object-cover mx-auto mb-3" />
            <p>この期間にゲームがありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game, i) => {
              const rankColor = i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-300'
              return (
                <div key={game.id as string} className="relative">
                  <div className={`absolute -left-2 -top-2 z-10 w-7 h-7 rounded-full ${rankColor} text-white text-sm font-bold flex items-center justify-center shadow-md`}>
                    {i + 1}
                  </div>
                  <GameCard game={game as Parameters<typeof GameCard>[0]['game']} />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <RankingSidebar />
    </div>
  )
}
