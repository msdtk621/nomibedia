import { getBoardGame, getBoardGameComments, addBoardGameComment } from '@/app/actions/boardgame'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RankingSidebar from '@/components/RankingSidebar'
import CommentSection from '@/components/CommentSection'
import BoardGameVoteButton from '@/components/BoardGameVoteButton'
import ShopButtons from '@/components/ShopButtons'
import { amazonSearch, rakutenSearch, hasAmazon, hasRakuten } from '@/lib/affiliate'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bg = await getBoardGame(id)
  if (!bg) return {}

  // 説明文が薄いページはインデックスさせない（AdSense審査・SEO品質対策）
  // ボドゲ詳細は「名前＋短い説明＋購入リンク」中心で薄いアフィリエイトページになりがちなため、
  // 内容が薄いものはインデックスから外してサイト全体の品質シグナルを上げる。
  const isThin = (bg.description ?? '').trim().length < 50

  return {
    title: `${bg.name} | 飲み屋おすすめボードゲーム | ノミベディア`,
    description: bg.description ?? `${bg.name}の紹介ページ`,
    ...(isThin ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function BoardGameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [bg, comments] = await Promise.all([getBoardGame(id), getBoardGameComments(id)])
  if (!bg) notFound()

  // 個別アフィリンクがあれば優先、無ければ商品名で検索リンクにフォールバック
  const amazonUrl = bg.affiliate_amazon || (hasAmazon ? amazonSearch(bg.name) : null)
  const rakutenUrl = bg.affiliate_rakuten || (hasRakuten ? rakutenSearch(bg.name) : null)
  const hasAffiliate = amazonUrl || rakutenUrl

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

            {/* 楽天の商品内容（画像・商品名・価格） */}
            {bg.rakuten_item_name && (
              <a
                href={rakutenUrl ?? '#'}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="flex gap-3 mb-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {bg.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bg.image_url} alt={bg.rakuten_item_name} className="w-24 h-24 object-contain rounded-lg shrink-0 bg-white" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug line-clamp-3">{bg.rakuten_item_name}</p>
                  {bg.rakuten_price != null && (
                    <p className="mt-1.5">
                      <span className="text-xl font-bold text-[#BF0000]">¥{Number(bg.rakuten_price).toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">〜（楽天市場）</span>
                    </p>
                  )}
                </div>
              </a>
            )}

            <ShopButtons
              keyword={bg.name}
              amazonUrl={bg.affiliate_amazon}
              rakutenUrl={bg.affiliate_rakuten}
              size="lg"
            />
            <p className="text-[11px] text-gray-400 mt-2">※当サイトはアフィリエイトプログラムを利用しています。</p>
          </div>
        )}

        <CommentSection initialComments={comments} onSubmit={addBoardGameComment.bind(null, bg.id)} />
      </div>
      <RankingSidebar />
    </div>
  )
}
