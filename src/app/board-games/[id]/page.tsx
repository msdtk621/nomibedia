import { getBoardGame, getBoardGameComments, addBoardGameComment } from '@/app/actions/boardgame'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RankingSidebar from '@/components/RankingSidebar'
import CommentSection from '@/components/CommentSection'
import BoardGameVoteButton from '@/components/BoardGameVoteButton'
import { AFFILIATE_REL } from '@/lib/affiliate'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bg = await getBoardGame(id)
  if (!bg) return {}
  return {
    title: `${bg.name} | 飲み屋おすすめボードゲーム | ノミベディア`,
    description: bg.description ?? `${bg.name}の紹介ページ`,
  }
}

export default async function BoardGameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [bg, comments] = await Promise.all([getBoardGame(id), getBoardGameComments(id)])
  if (!bg) notFound()

  const hasAffiliate = bg.affiliate_amazon || bg.affiliate_rakuten

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Link href="/" className="hover:text-blue-600">トップ</Link>
          <span>›</span>
          <Link href="/board-games" className="hover:text-blue-600">ボードゲーム</Link>
          <span>›</span>
          <span className="text-gray-900">{bg.name}</span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden flex items-center justify-center">
              {bg.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bg.image_url} alt={bg.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🎲</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{bg.name}</h1>
              {bg.description && <p className="text-gray-600 whitespace-pre-line">{bg.description}</p>}
              <div className="mt-3">
                <BoardGameVoteButton boardGameId={bg.id} initialCount={bg.vote_count} votedIds={[]} />
              </div>
            </div>
          </div>
        </div>

        {/* アフィリエイト購入リンク（未設定なら非表示） */}
        {hasAffiliate && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">購入はこちら</h2>
              <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">PR</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {bg.affiliate_amazon && (
                <a href={bg.affiliate_amazon} target="_blank" rel={AFFILIATE_REL}
                  className="flex-1 text-center px-4 py-3 bg-[#FF9900] text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                  Amazonで見る
                </a>
              )}
              {bg.affiliate_rakuten && (
                <a href={bg.affiliate_rakuten} target="_blank" rel={AFFILIATE_REL}
                  className="flex-1 text-center px-4 py-3 bg-[#BF0000] text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                  楽天で見る
                </a>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">※当サイトはアフィリエイトプログラムを利用しています。</p>
          </div>
        )}

        <CommentSection initialComments={comments} onSubmit={addBoardGameComment.bind(null, bg.id)} />
      </div>
      <RankingSidebar />
    </div>
  )
}
