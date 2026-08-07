import { Fragment, Suspense } from 'react'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import RecommendedGoods from '@/components/RecommendedGoods'
import AdUnit from '@/components/AdUnit'
import AppPromo from '@/components/AppPromo'
import TriviaSection from '@/components/TriviaSection'
import Pagination from '@/components/Pagination'
import { getGamesWithCount, getCategories } from '@/lib/db'
import { getDailyTrivia } from '@/lib/trivia'
import Link from 'next/link'
import { getCategoryImage } from '@/lib/categoryImages'
import { asset } from '@/lib/asset'

export const revalidate = 0

const PER_PAGE = 20

// 投稿一覧の隙間に差し込むもの。
// 数字は「この件数を表示した直後」の意味。投稿より先に広告やPRが来ないよう、
// いずれも先頭ではなく途中に置いている。
const SLOT_TRIVIA = 3
const SLOT_APP_PROMO = 8
const SLOT_AD = 13

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>
}) {
  const { q, tag, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const [{ games, total }, categories] = await Promise.all([
    getGamesWithCount({ q, tag, page, perPage: PER_PAGE }),
    getCategories(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const showHero = !q && !tag && page === 1
  const trivia = getDailyTrivia(3)

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        {showHero && (
          <section className="mb-6">
            {/* ヒーロー画像＋キャッチコピー */}
            <div className="text-center mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/hero.png")} alt="ノミベディア" className="w-32 h-32 md:w-36 md:h-36 object-contain mx-auto" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 -mt-1">
                飲みの場を<span className="text-amber-400">もっと</span>楽しく！
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mt-1.5">定番からオリジナルまで、飲み会ゲームの百科事典</p>
            </div>

            {/* 投稿促進ボックス */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/beer.jpeg")} alt="" className="w-6 h-6 object-contain shrink-0" />
                <h2 className="font-bold text-gray-900">おうち飲みや飲み会が、もっと盛り上がる！</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                ノミベディアでは、誰でも簡単に遊べる飲みゲームを紹介・共有できます。あなたのおすすめゲームを投稿して、みんなで楽しもう！
              </p>
              <Link
                href="/post"
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-amber-400 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors"
              >
                ✏️ ゲームを投稿する
              </Link>
            </div>
          </section>
        )}

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {q ? `「${q}」の検索結果` : tag ? `#${tag} のゲーム` : '飲みゲーム一覧'}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/star-blue.png")} alt="すべて" className="w-4 h-4 rounded object-cover" />
              すべてのゲーム
            </Link>
            {categories.map((cat: { id: string; slug: string; icon: string; name: string }) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getCategoryImage(cat.slug)} alt={cat.name} className="w-4 h-4 rounded object-cover" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ボードゲーム投票への動線。サイドバーにしか無かったので一覧の上にも置く */}
        <Link
          href="/board-games"
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-4 hover:border-amber-300 hover:shadow-sm transition-all"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/boardgame.png")} alt="" className="w-5 h-5 object-contain shrink-0" />
          <span className="text-sm font-bold text-gray-900">飲み屋おすすめボードゲーム投票</span>
          <span className="text-xs text-gray-400 hidden sm:inline">みんなの投票でランキングが決まる</span>
          <span className="ml-auto text-gray-300 shrink-0">›</span>
        </Link>

        {total > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {q || tag ? `${total}件見つかりました` : `全${total}件`}
            {totalPages > 1 && `（${page} / ${totalPages}ページ）`}
          </p>
        )}

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/beer.jpeg")} alt="ビール" className="w-10 h-10 rounded object-cover mx-auto mb-3" />
            <p>まだゲームが投稿されていません</p>
            <Link href="/post" className="mt-4 inline-block px-6 py-2 bg-amber-400 text-white rounded-lg text-sm hover:bg-amber-500">
              最初に投稿する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game: Record<string, unknown>, i: number) => (
              <Fragment key={game.id as string}>
                <GameCard game={game as Parameters<typeof GameCard>[0]['game']} />
                {i === SLOT_TRIVIA - 1 && <TriviaSection items={trivia} />}
                {i === SLOT_APP_PROMO - 1 && <AppPromo />}
                {/* フィード内広告。slot未設定なら非表示 */}
                {i === SLOT_AD - 1 && <AdUnit slot="feed" />}
              </Fragment>
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/"
          params={{ q, tag }}
        />

        {/* モバイル用おすすめグッズ（PCはサイドバーに表示されるため非表示） */}
        <div className="lg:hidden">
          <RecommendedGoods />
        </div>
      </div>

      {/* サイドバーは別で読み込む。ここを待たずに投稿一覧を先に表示させる */}
      <Suspense fallback={<div className="hidden lg:block w-80 shrink-0" />}>
        <RankingSidebar />
      </Suspense>
    </div>
  )
}
