import { notFound } from 'next/navigation'
import Link from 'next/link'
import RankingSidebar from '@/components/RankingSidebar'
import AdUnit from '@/components/AdUnit'
import { triviaList, getTrivia, triviaCategoryMeta } from '@/lib/trivia'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export function generateStaticParams() {
  return triviaList.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trivia = getTrivia(slug)
  if (!trivia) return {}
  const title = `${trivia.question} | お酒のあれこれ - ノミベディア`
  const url = `${SITE_URL}/trivia/${trivia.slug}`
  return {
    title,
    description: trivia.answer,
    alternates: { canonical: url },
    openGraph: { title, description: trivia.answer, type: 'article', url },
    twitter: { card: 'summary_large_image', title, description: trivia.answer },
  }
}

export default async function TriviaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trivia = getTrivia(slug)
  if (!trivia) notFound()

  const meta = triviaCategoryMeta[trivia.category]
  const pageUrl = `${SITE_URL}/trivia/${trivia.slug}`
  const others = triviaList.filter((t) => t.slug !== trivia.slug).slice(0, 4)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'お酒のあれこれ', item: `${SITE_URL}/trivia` },
        { '@type': 'ListItem', position: 3, name: trivia.question, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: trivia.question,
          acceptedAnswer: { '@type': 'Answer', text: trivia.answer },
        },
      ],
    },
  ]

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-amber-600 hover:underline">トップ</Link>
          <span className="mx-1.5">›</span>
          <Link href="/trivia" className="hover:text-amber-600 hover:underline">お酒のあれこれ</Link>
        </nav>

        <article className="bg-white border border-gray-200 rounded-xl p-5 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center text-sm shrink-0">
              {meta.emoji}
            </span>
            <span className="font-bold text-amber-500">{meta.label}の豆知識</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
            {trivia.question}
          </h1>

          <div className="border-t-2 border-dotted border-amber-300 my-6" />

          {/* 結論を最初に置く。詳細は下で補う */}
          <p className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 text-gray-800 leading-relaxed">
            {trivia.answer}
          </p>

          <div className="mt-8 space-y-7">
            {trivia.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-bold text-gray-900 mb-2">{s.heading}</h2>
                <p className="text-gray-700 leading-relaxed text-[15px]">{s.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 pt-5 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
            ※ 一般的に知られている内容をまとめたものです。お酒の強さや体質には個人差があります。20歳未満の飲酒は法律で禁止されています。体調に不安があるときは無理をせず、医療機関にご相談ください。
          </p>
        </article>

        <AdUnit slot="feed" />

        {others.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-gray-900 mb-3">ほかの豆知識</h2>
            <div className="space-y-2">
              {others.map((t) => {
                const m = triviaCategoryMeta[t.category]
                return (
                  <Link
                    key={t.slug}
                    href={`/trivia/${t.slug}`}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-amber-300 hover:shadow-sm transition-all"
                  >
                    <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-sm shrink-0">
                      {m.emoji}
                    </span>
                    <span className="text-sm font-medium text-gray-900 flex-1 min-w-0">{t.question}</span>
                    <span className="text-gray-300 shrink-0">›</span>
                  </Link>
                )
              })}
            </div>
            <Link href="/trivia" className="block text-center text-sm text-blue-600 mt-4 hover:underline">
              お酒のあれこれをすべて見る →
            </Link>
          </section>
        )}
      </div>
      <RankingSidebar />
    </div>
  )
}
