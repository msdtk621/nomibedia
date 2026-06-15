import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import RecommendedGoods from '@/components/RecommendedGoods'
import AppPromo from '@/components/AppPromo'
import { getGames, getCategories } from '@/lib/db'
import Link from 'next/link'
import { getCategoryImage } from '@/lib/categoryImages'
import { asset } from '@/lib/asset'

export const revalidate = 0

const heroCards = [
  { href: '/ranking', img: '/crown.jpeg', title: '人気ランキング', desc: 'みんなのイチオシ！' },
  { href: '/new', img: '/clock.png', title: '新着ゲーム', desc: '最新のゲームをチェック' },
  { href: '/comments', img: '/comment.png', title: '新着コメント', desc: 'みんなの声をチェック' },
]

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>
}) {
  const { q, tag } = await searchParams
  const [games, categories] = await Promise.all([
    getGames({ q, tag }),
    getCategories(),
  ])

  const showHero = !q && !tag

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        {showHero && (
          <section className="mb-8">
            {/* ヒーロー画像＋キャッチコピー */}
            <div className="text-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/hero.jpeg")} alt="ノミベディア" className="w-56 h-56 md:w-64 md:h-64 object-contain mx-auto" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 -mt-2">
                飲みの場を<span className="text-amber-400">もっと</span>楽しく！
              </h1>
              <p className="text-gray-500 text-sm mt-2">定番からオリジナルまで、飲み会ゲームの百科事典</p>
            </div>

            {/* 3つのカード */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
              {heroCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center hover:border-amber-300 hover:shadow-sm transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(card.img)} alt={card.title} className="w-8 h-8 object-contain mx-auto mb-2" />
                  <div className="font-bold text-gray-900 text-sm md:text-base">{card.title}</div>
                  <div className="text-gray-400 text-[10px] md:text-xs mt-0.5 hidden sm:block">{card.desc}</div>
                  <div className="text-gray-300 text-xs mt-1">›</div>
                </Link>
              ))}
            </div>

            {/* 投稿促進ボックス */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/beer.jpeg")} alt="" className="w-6 h-6 object-contain" />
                <h2 className="font-bold text-gray-900">おうち飲みや飲み会が、もっと盛り上がる！</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                ノミベディアでは、誰でも簡単に遊べる飲みゲームを紹介・共有できます。あなたのおすすめゲームを投稿して、みんなで楽しもう！
              </p>
              <Link
                href="/post"
                className="flex items-center justify-center gap-2 w-full md:w-auto md:inline-flex px-6 py-3 bg-amber-400 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors"
              >
                ✏️ ゲームを投稿する
              </Link>
            </div>
          </section>
        )}

        {showHero && <AppPromo />}

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

        {q && (
          <p className="text-sm text-gray-500 mb-4">{games.length}件見つかりました</p>
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
            {games.map((game: Record<string, unknown>) => (
              <GameCard key={game.id as string} game={game as Parameters<typeof GameCard>[0]['game']} />
            ))}
          </div>
        )}

        {/* モバイル用おすすめグッズ（PCはサイドバーに表示されるため非表示） */}
        <div className="lg:hidden">
          <RecommendedGoods />
        </div>
      </div>
      <RankingSidebar />
    </div>
  )
}
