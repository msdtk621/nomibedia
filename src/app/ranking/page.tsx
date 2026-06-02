import { createServerSupabaseClient } from '@/lib/supabase-server'
import { type Game } from '@/lib/types'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'

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
const rankIcons = ['👑', '🥈', '🥉']

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
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl">👑</span>
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
            <div className="text-4xl mb-3">👑</div>
            <p>この期間にゲームがありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game, i) => (
              <div key={game.id as string} className="flex items-stretch gap-3">
                <div className="w-8 flex items-center justify-center text-xl font-bold shrink-0 text-gray-400">
                  {i < 3 ? rankIcons[i] : i + 1}
                </div>
                <div className="flex-1">
                  <GameCard game={game as Parameters<typeof GameCard>[0]['game']} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <RankingSidebar />
    </div>
  )
}
