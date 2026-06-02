import { getGame, getComments } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import RankingSidebar from '@/components/RankingSidebar'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import ReportButton from '@/components/ReportButton'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = await getGame(id)
  if (!game) return {}
  return {
    title: `${game.title} | ノミペディア`,
    description: game.description,
    openGraph: {
      title: `${game.title} | ノミペディア`,
      description: game.description as string,
      type: 'article',
    },
  }
}

function DrinkLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= level ? 'opacity-100' : 'opacity-20'}>🍺</span>
      ))}
    </div>
  )
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [game, gameComments] = await Promise.all([
    getGame(id),
    getComments(id),
  ])
  if (!game) notFound()

  const category = game.category as { name: string; icon: string; slug: string } | null
  const tags = game.tags as Array<{ id: string; name: string }> | null
  const playerCount = game.player_count as string[] | null
  const gameFlow = game.game_flow as string[] | null
  const drinkLevel = (game.drink_level as number) ?? 1

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0">
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Link href="/" className="hover:text-blue-600">トップ</Link>
          <span>›</span>
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-blue-600">{category.name}</Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900">{game.title as string}</span>
        </nav>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center text-5xl overflow-hidden">
              {game.thumbnail_url ? (
                <Image
                  src={game.thumbnail_url as string}
                  alt={game.title as string}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                category?.icon ?? '🎮'
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {category && (
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-0.5 rounded-full font-medium">
                    {category.name}
                  </span>
                )}
                {playerCount && playerCount.length > 0 && (
                  <span className="text-sm bg-green-50 text-green-700 px-3 py-0.5 rounded-full border border-green-200">
                    👥 {playerCount.join('・')}
                  </span>
                )}
                <DrinkLevel level={drinkLevel} />
                <button className="ml-auto flex items-center gap-1 text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50">
                  ☆ お気に入り
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{game.title as string}</h1>
              <p className="text-gray-600">{game.description as string}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {tags?.map(tag => (
                  <span key={tag.id} className="text-sm bg-gray-100 text-gray-600 px-3 py-0.5 rounded-full">#{tag.name}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</div>
            <span>匿名（ID: {game.author_id as string}）</span>
            <span className="ml-2">
              {new Date(game.created_at as string).toLocaleDateString('ja-JP', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {gameFlow && gameFlow.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-gray-900 mb-3">ゲーム進行</h2>
            <div className="flex flex-wrap gap-2">
              {gameFlow.map(f => (
                <span key={f} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">{f}</span>
              ))}
            </div>
          </div>
        )}

        {game.required_items && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-gray-900 mb-2">必要なもの</h2>
            <p className="text-gray-700">{game.required_items as string}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">ルール</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">{game.rules as string}</div>
        </div>

        {game.lose_condition && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-red-800 mb-2">💀 負け条件</h2>
            <p className="text-red-700">{game.lose_condition as string}</p>
          </div>
        )}

        {game.tips && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-amber-800 mb-2">💡 ポイント・コツ</h2>
            <p className="text-amber-700">{game.tips as string}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <LikeButton gameId={id} initialCount={game.like_count as number} />
            <span className="flex items-center gap-1 text-gray-500 text-sm">💬 コメント {game.comment_count as number}</span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">👁 閲覧数 {(game.view_count as number).toLocaleString()}</span>
            <div className="ml-auto"><ReportButton gameId={id} /></div>
          </div>
        </div>

        <CommentSection gameId={id} initialComments={gameComments} />
      </div>
      <RankingSidebar />
    </div>
  )
}
