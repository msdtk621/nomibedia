import { getGames } from '@/lib/db'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import { asset } from '@/lib/asset'

export const revalidate = 0

export default async function NewPage() {
  const games = await getGames()

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/clock.png")} alt="新着" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新着ゲーム</h1>
            <p className="text-gray-500 text-sm">最近投稿された飲みゲー</p>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/clock.png")} alt="新着" className="w-10 h-10 object-contain mx-auto mb-3" />
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
