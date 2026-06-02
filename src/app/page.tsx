import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import { getGames, getCategories } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 0

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

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">飲みゲー一覧</h1>
          <p className="text-gray-600 text-sm">みんなの飲みゲーを探して、今夜の宴会を盛り上げよう！</p>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <Link href="/" className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors">
            🎮 すべてのゲーム
          </Link>
          {categories.map((cat: { id: string; slug: string; icon: string; name: string }) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {q && (
          <p className="text-sm text-gray-500 mb-4">「{q}」の検索結果：{games.length}件</p>
        )}

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🍺</div>
            <p>まだゲームが投稿されていません</p>
            <Link href="/post" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
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
      </div>
      <RankingSidebar />
    </div>
  )
}
