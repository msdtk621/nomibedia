import Link from 'next/link'
import RankingSidebar from '@/components/RankingSidebar'
import { triviaList, triviaCategoryMeta, type TriviaCategory } from '@/lib/trivia'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

const title = 'お酒のあれこれ | お酒・おつまみ・飲みの場のマナー - ノミベディア'
const description =
  'お酒やおつまみの豆知識、飲みの場のマナーを短くまとめました。空腹での飲酒、ちゃんぽん、乾杯の作法、上座下座など、知っておくと飲み会がもっと楽しくなる話を集めています。'

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/trivia` },
  openGraph: { title, description, type: 'website', url: `${SITE_URL}/trivia` },
  twitter: { card: 'summary_large_image' as const, title, description },
}

const order: TriviaCategory[] = ['drink', 'food', 'manner']

export default function TriviaIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'お酒のあれこれ',
    itemListElement: triviaList.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/trivia/${t.slug}`,
      name: t.question,
    })),
  }

  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mb-6 flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center text-lg shrink-0">
            🍷
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">お酒のあれこれ</h1>
            <p className="text-gray-500 text-sm">知っておくと飲み会がちょっと楽しくなる話</p>
          </div>
        </div>

        <div className="space-y-8">
          {order.map((cat) => {
            const items = triviaList.filter((t) => t.category === cat)
            if (items.length === 0) return null
            const meta = triviaCategoryMeta[cat]
            return (
              <section key={cat}>
                <h2 className="font-bold text-gray-900 mb-3">
                  {meta.emoji} {meta.label}
                </h2>
                <div className="space-y-2">
                  {items.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/trivia/${t.slug}`}
                      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition-all"
                    >
                      <div className="font-bold text-gray-900">{t.question}</div>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1 line-clamp-2">
                        {t.answer}
                      </p>
                      <span className="inline-block text-xs text-blue-600 mt-2">続きを読む →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
      <RankingSidebar />
    </div>
  )
}
