import { getBoardGames } from '@/app/actions/boardgame'
import RankingSidebar from '@/components/RankingSidebar'
import BoardGameClient from './BoardGameClient'

export const revalidate = 120

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

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          飲み屋・宅飲み・待ち時間に遊べるボードゲームを、みんなの投票でランキング化しています。少人数でもルールが簡単で、短時間で決着がつく、飲みの席と相性の良い定番タイトルを中心に紹介しています。気になるゲームに投票して、みんなのおすすめを一緒に育てていきましょう。
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
          👍 気になるゲームに投票できます。1つのゲームに何度でも投票・取り消しが可能です。
        </div>

        <BoardGameClient games={games} />
      </div>
      <RankingSidebar />
    </div>
  )
}
