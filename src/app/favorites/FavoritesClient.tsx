'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GameCard from '@/components/GameCard'
import { getFavorites } from '@/components/FavoriteButton'
import { fetchFavoriteGames } from '@/app/actions/favorites'
import { type Game } from '@/lib/types'

export default function FavoritesClient() {
  const [games, setGames] = useState<Game[] | null>(null)

  useEffect(() => {
    const ids = getFavorites()
    if (ids.length === 0) {
      setGames([])
      return
    }
    fetchFavoriteGames(ids).then(setGames)
  }, [])

  if (games === null) {
    return <div className="text-center py-16 text-gray-400">読み込み中…</div>
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-3 text-amber-300">★</div>
        <p>まだお気に入りがありません</p>
        <p className="text-xs mt-1">ゲームページの「☆ お気に入り」ボタンで保存できます</p>
        <Link href="/" className="mt-4 inline-block px-6 py-2 bg-amber-400 text-white rounded-lg text-sm hover:bg-amber-500">
          ゲームを探す
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {games.map(game => (
        <GameCard key={game.id} game={game as Parameters<typeof GameCard>[0]['game']} />
      ))}
    </div>
  )
}
