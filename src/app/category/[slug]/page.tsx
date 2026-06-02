import { getGames, getCategories } from '@/lib/db'
import { notFound } from 'next/navigation'
import GameCard from '@/components/GameCard'
import RankingSidebar from '@/components/RankingSidebar'
import Link from 'next/link'

export const revalidate = 0

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [games, categories] = await Promise.all([
    getGames({ categorySlug: slug }),
    getCategories(),
  ])
  const category = categories.find((c: { slug: string }) => c.slug === slug)
  if (!category) notFound()

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">{(category as { icon: string }).icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{(category as { name: string }).name}</h1>
            <p className="text-gray-500 text-sm">{games.length}件のゲーム</p>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">{(category as { icon: string }).icon}</div>
            <p>まだこのカテゴリにゲームがありません</p>
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
