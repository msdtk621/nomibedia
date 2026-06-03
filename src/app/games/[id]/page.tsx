import { getGame, getComments } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryImage } from '@/lib/categoryImages'
import RankingSidebar from '@/components/RankingSidebar'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import ReportButton from '@/components/ReportButton'
import OwnerActions from '@/components/OwnerActions'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = await getGame(id)
  if (!game) return {}
  return {
    title: `${game.title as string} | ノミペディア`,
    description: game.description as string,
    openGraph: {
      title: `${game.title as string} | ノミペディア`,
      description: game.description as string,
      type: 'article',
    },
  }
}

function DrinkLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={n} src="/beer.jpeg" alt="ビール" className={`w-5 h-5 rounded object-cover ${n <= level ? 'opacity-100' : 'opacity-20'}`} />
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
  const requiredItems = game.required_items as string | null
  const loseCondition = game.lose_condition as string | null
  const tips = game.tips as string | null
  const referenceUrl = game.reference_url as string | null
  type EmojiItem = { id: string; emoji: string; x: number; y: number; size: number }
  const ruleSections = game.rule_sections as Array<{id: string; text: string; mediaType: string; emojiCanvas?: EmojiItem[]; imageUrl?: string}> | null

  return (
    <div className="flex gap-6 p-3 md:p-6">
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
            <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
              <Image
                src={(game.thumbnail_url as string | null) ?? getCategoryImage(category?.slug)}
                alt={game.title as string}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
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

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex-wrap">
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</div>
            <span>匿名（ID: {game.author_id as string}）</span>
            <span className="ml-2">
              {new Date(game.created_at as string).toLocaleDateString('ja-JP', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
            <div className="ml-auto">
              <OwnerActions gameId={id} authorId={game.author_id as string} />
            </div>
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

        {requiredItems && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-gray-900 mb-2">必要なもの</h2>
            <p className="text-gray-700">{requiredItems}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">ルール</h2>
          {ruleSections && ruleSections.length > 0 ? (
            <div className="space-y-4">
              {ruleSections.map((section, i) => (
                <div key={section.id ?? i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</p>
                    {section.mediaType === 'emoji' && section.emojiCanvas && section.emojiCanvas.length > 0 && (
                      <div className="relative mt-2 bg-gray-50 rounded-lg overflow-hidden" style={{ height: 220 }}>
                        {section.emojiCanvas.map((item) => (
                          <span
                            key={item.id}
                            className="absolute leading-none select-none"
                            style={{ left: item.x, top: item.y, fontSize: item.size }}
                          >
                            {item.emoji}
                          </span>
                        ))}
                      </div>
                    )}
                    {section.mediaType === 'image' && section.imageUrl && (
                      <img src={section.imageUrl} alt="" className="mt-2 rounded-lg max-h-48 object-cover" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">{game.rules as string}</div>
          )}
        </div>

        {loseCondition && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-red-800 mb-2">💀 負け条件</h2>
            <p className="text-red-700">{loseCondition}</p>
          </div>
        )}

        {tips && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-amber-800 mb-2">💡 ポイント・コツ</h2>
            <p className="text-amber-700">{tips}</p>
          </div>
        )}

        {referenceUrl && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-gray-900 mb-2">参考動画</h2>
            <a href={referenceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm break-all">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {referenceUrl}
            </a>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <LikeButton gameId={id} initialCount={game.like_count as number} />
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/comment.png" alt="コメント" className="w-4 h-4 object-contain" /> コメント {game.comment_count as number}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eye.png" alt="閲覧" className="w-4 h-4 object-contain" /> 閲覧数 {(game.view_count as number).toLocaleString()}
            </span>
            <div className="ml-auto"><ReportButton gameId={id} /></div>
          </div>
        </div>

        <CommentSection gameId={id} initialComments={gameComments} />
      </div>
      <RankingSidebar />
    </div>
  )
}
