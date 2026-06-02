import Link from 'next/link'
import Image from 'next/image'
import { Game } from '@/lib/types'

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-3xl overflow-hidden">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt={game.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            game.category?.icon ?? '🎮'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {game.category && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {game.category.name}
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 mb-1 truncate">{game.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{game.description}</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {game.tags?.slice(0, 3).map(tag => (
              <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag.name}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span>👍 {game.like_count}</span>
        <span>💬 {game.comment_count}</span>
        <span>👁 {game.view_count.toLocaleString()}</span>
        <span className="ml-auto">{new Date(game.created_at).toLocaleDateString('ja-JP')}</span>
      </div>
    </Link>
  )
}
