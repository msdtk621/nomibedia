import { getGames } from '@/lib/db'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'

export const revalidate = 0

export default async function NewPage() {
  const games = await getGames()

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl">🕐</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新着ゲーム</h1>
            <p className="text-gray-500 text-sm">最近投稿された飲みゲー</p>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🕐</div>
            <p>まだゲームが投稿されていません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game: Record<string, unknown>) => (
              <GameCard key={game.id as string} game={game as Parameters<typeof GameCard>[0]['game']} />
            ))}
          </div>
        )}
      </div>
      <RankingSidebar />
    </div>
  )
}
