import { Fragment } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import AdUnit from '@/components/AdUnit'
import { getScenedGames } from '@/lib/db'
import { scenes, getScene } from '@/lib/scenes'
import { SITE_URL } from '@/lib/site'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const scene = getScene(slug)
  if (!scene) return {}
  const url = `${SITE_URL}/scene/${scene.slug}`
  return {
    title: scene.title,
    description: scene.description,
    alternates: { canonical: url },
    openGraph: { title: scene.title, description: scene.description, type: 'website', url },
    twitter: { card: 'summary_large_image', title: scene.title, description: scene.description },
  }
}

export default async function ScenePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const scene = getScene(slug)
  if (!scene) notFound()

  const games = await getScenedGames(scene.keywords)
  const others = scenes.filter((s) => s.slug !== scene.slug)
  const pageUrl = `${SITE_URL}/scene/${scene.slug}`

  // ── 構造化データ（JSON-LD）：パンくず＋ゲーム一覧 ──
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `${scene.name}の飲み会ゲーム`, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: scene.title,
      itemListElement: games.slice(0, 10).map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/games/${g.id}`,
        name: g.title,
      })),
    },
  ]

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex-1 min-w-0">
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Link href="/" className="hover:text-blue-600">トップ</Link>
          <span>›</span>
          <span className="text-gray-900">{scene.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>{scene.emoji}</span>
            {scene.name}で盛り上がる飲み会ゲーム
          </h1>
          <p className="text-gray-600 leading-relaxed">{scene.lead}</p>
        </div>

        {/* 他シーンへの内部リンク（回遊＆クロール促進） */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">ほかのシーンから探す</p>
          <div className="flex gap-2 flex-wrap">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/scene/${s.slug}`}
                className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                {s.emoji} {s.name}
              </Link>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-3">{scene.name}におすすめのゲーム</h2>
        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>準備中です。まずは人気ゲームをチェック！</p>
            <Link
              href="/ranking"
              className="mt-4 inline-block px-6 py-2 bg-amber-400 text-white rounded-lg text-sm hover:bg-amber-500"
            >
              ランキングを見る
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game, i) => (
              <Fragment key={game.id}>
                <GameCard game={game} />
                {/* フィード内広告（5件目の後に1つだけ）。slot未設定なら非表示 */}
                {i === 4 && <AdUnit slot="feed" />}
              </Fragment>
            ))}
          </div>
        )}

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">あなたの鉄板ネタも教えて！</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {scene.name}で盛り上がったゲームがあれば、ぜひ投稿してみんなとシェアしましょう。
          </p>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors"
          >
            ✏️ ゲームを投稿する
          </Link>
        </div>
      </div>
      <RankingSidebar />
    </div>
  )
}
