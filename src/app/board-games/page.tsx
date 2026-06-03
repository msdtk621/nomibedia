import { getBoardGames } from '@/app/actions/boardgame'
import RankingSidebar from '@/components/RankingSidebar'
import BoardGameClient from './BoardGameClient'

export const revalidate = 0

export const metadata = { title: '飲み屋おすすめボードゲームランキング | ノミベディア' }

export default async function BoardGamesPage() {
  const games = await getBoardGames()

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/boardgame.png" alt="ボードゲーム" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">飲み屋おすすめボードゲーム</h1>
            <p className="text-gray-500 text-sm">みんなの投票で決まるランキング！いいと思ったゲームに投票しよう</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
          👍 気になるゲームに投票できます。1つのゲームに何度でも投票・取り消しが可能です。
        </div>

        <BoardGameClient games={games} />
      </div>
      <RankingSidebar />
    </div>
  )
}
