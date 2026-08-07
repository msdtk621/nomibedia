import { Fragment } from 'react'
import { getGames, getCategories } from '@/lib/db'
import { notFound } from 'next/navigation'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import AdUnit from '@/components/AdUnit'
import Link from 'next/link'
import { getCategoryMeta } from '@/lib/categoryMeta'
import { scenes } from '@/lib/scenes'
import { SITE_URL } from '@/lib/site'

export const revalidate = 120

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c: { slug: string }) => c.slug === slug) as { name: string; slug: string } | undefined
  if (!category) return {}
  const meta = getCategoryMeta(slug, category.name)
  const url = `${SITE_URL}/category/${slug}`
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { title: meta.title, description: meta.description, type: 'website', url },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [games, categories] = await Promise.all([
    getGames({ categorySlug: slug }),
    getCategories(),
  ])
  const category = categories.find((c: { slug: string }) => c.slug === slug)
  if (!category) notFound()

  const name = (category as { name: string }).name
  const icon = (category as { icon: string }).icon
  const meta = getCategoryMeta(slug, name)
  const pageUrl = `${SITE_URL}/category/${slug}`
  const otherCategories = categories.filter((c: { slug: string }) => c.slug !== slug)

  // ── 構造化データ（JSON-LD）：パンくず＋ゲーム一覧 ──
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `${name}の飲み会ゲーム`, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: meta.title,
      itemListElement: (games as Array<{ id: string; title: string }>).slice(0, 10).map((g, i) => ({
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
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}の飲み会ゲーム</h1>
            <p className="text-gray-500 text-sm">{games.length}件のゲーム</p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{meta.lead}</p>

        {/* 運営が書いた本文。UGCのゲーム一覧に対して、ここがサイトの独自コンテンツになる */}
        {meta.sections && meta.sections.length > 0 && (
          <article className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-6 space-y-6">
            {meta.sections.map((sec, i) => (
              <section key={i}>
                <h2 className="font-bold text-gray-900 mb-2">{sec.h}</h2>
                <div className="space-y-3">
                  {sec.body.map((p, j) => (
                    <p key={j} className="text-gray-700 leading-relaxed">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        )}

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">{icon}</div>
            <p>まだこのカテゴリにゲームがありません</p>
            <Link href="/post" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              最初に投稿する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game: Record<string, unknown>, i: number) => (
              <Fragment key={game.id as string}>
                <GameCard game={game as Parameters<typeof GameCard>[0]['game']} />
                {/* フィード内広告（5件目の後に1つだけ）。slot未設定なら非表示 */}
                {i === 4 && <AdUnit slot="feed" />}
              </Fragment>
            ))}
          </div>
        )}

        {/* 内部リンク：他カテゴリ＆シーン（回遊・クロール促進） */}
        <div className="mt-8 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">ほかのカテゴリ</p>
            <div className="flex gap-2 flex-wrap">
              {otherCategories.map((c: { id: string; slug: string; icon: string; name: string }) => (
                <Link key={c.id} href={`/category/${c.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">シーンから探す</p>
            <div className="flex gap-2 flex-wrap">
              {scenes.map((s) => (
                <Link key={s.slug} href={`/scene/${s.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
                  {s.emoji} {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RankingSidebar />
    </div>
  )
}
