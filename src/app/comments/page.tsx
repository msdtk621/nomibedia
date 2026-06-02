import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import RankingSidebar from '@/components/RankingSidebar'

export const revalidate = 0

export default async function CommentsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: comments } = await supabase
    .from('comments')
    .select('*, game:games(id, title, category:categories(name, icon, slug))')
    .order('created_at', { ascending: false })
    .limit(50)

  const seen = new Set<string>()
  const recentGames = (comments ?? []).reduce((acc: typeof comments, c) => {
    const gameId = (c.game as { id: string })?.id
    if (gameId && !seen.has(gameId)) {
      seen.add(gameId)
      acc!.push(c)
    }
    return acc
  }, [])

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">コメント新着</h1>
            <p className="text-gray-500 text-sm">最近コメントがついたゲーム</p>
          </div>
        </div>

        {recentGames?.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">💬</div>
            <p>まだコメントがありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGames?.map((c) => {
              const game = c.game as { id: string; title: string; category: { name: string; icon: string } | null } | null
              if (!game) return null
              return (
                <Link key={game.id} href={`/games/${game.id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-2xl">
                      {game.category?.icon ?? '🎮'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-purple-600 mb-1">{game.category?.name}</div>
                      <div className="font-bold text-gray-900 truncate">{game.title}</div>
                      <div className="text-sm text-gray-500 mt-1 truncate">
                        <span className="text-green-700 font-medium">{c.author_name}</span>：{c.content}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      {new Date(c.created_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      <RankingSidebar />
    </div>
  )
}
