import { Fragment } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import AdUnit from '@/components/AdUnit'
import { getScenedGames } from '@/lib/db'
import { gameLists, getGameList } from '@/lib/lists'
import { scenes } from '@/lib/scenes'
import { SITE_URL } from '@/lib/site'

export const revalidate = 120

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = getGameList(slug)
  if (!list) return {}
  const url = `${SITE_URL}/list/${list.slug}`
  return {
    title: list.title,
    description: list.description,
    alternates: { canonical: url },
    openGraph: { title: list.title, description: list.description, type: 'website', url },
    twitter: { card: 'summary_large_image', title: list.title, description: list.description },
  }
}

export default async function ListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = getGameList(slug)
  if (!list) notFound()

  const { matched, supplemented } = await getScenedGames(list.keywords)
  const otherLists = gameLists.filter((l) => l.slug !== list.slug)
  const pageUrl = `${SITE_URL}/list/${list.slug}`
  const listed = [...matched, ...supplemented]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `${list.name}の飲み会ゲーム`, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: list.title,
      itemListElement: listed.slice(0, 10).map((g, i) => ({
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
          <span className="text-gray-900">{list.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>{list.emoji}</span>
            {list.name}の飲み会ゲーム
          </h1>
          <p className="text-gray-600 leading-relaxed">{list.lead}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">{list.name}のゲームの選び方</h2>
          <p className="text-gray-700 leading-relaxed">{list.howToChoose}</p>
        </div>

        {/* 運営が書いた本文。UGCのゲーム一覧に対して、ここがサイトの独自コンテンツになる */}
        {list.sections && list.sections.length > 0 && (
          <article className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-6 space-y-6">
            {list.sections.map((sec, i) => (
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

        {/* 他の目的別リストへの内部リンク */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">ほかの目的から探す</p>
          <div className="flex gap-2 flex-wrap">
            {otherLists.map((l) => (
              <Link key={l.slug} href={`/list/${l.slug}`}
                className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
                {l.emoji} {l.name}
              </Link>
            ))}
          </div>
        </div>

        {listed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>準備中です。まずは人気ゲームをチェック！</p>
            <Link href="/ranking" className="mt-4 inline-block px-6 py-2 bg-amber-400 text-white rounded-lg text-sm hover:bg-amber-500">
              ランキングを見る
            </Link>
          </div>
        ) : (
          <>
            {matched.length > 0 && (
              <div className="space-y-3">
                {matched.map((game, i) => (
                  <Fragment key={game.id}>
                    <GameCard game={game} />
                    {i === 4 && <AdUnit slot="feed" />}
                  </Fragment>
                ))}
              </div>
            )}
            {supplemented.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-1">定番の飲み会ゲームもチェック</h2>
                <p className="text-xs text-gray-400 mb-3">どんな飲み会でも使える人気ゲームです。</p>
                <div className="space-y-3">
                  {supplemented.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* シーンからも探せる導線 */}
        <div className="mt-8">
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
      <RankingSidebar />
    </div>
  )
}
