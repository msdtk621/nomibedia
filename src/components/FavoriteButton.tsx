'use client'

import { useEffect, useState } from 'react'

const KEY = 'nomipedia_favorites'

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export default function FavoriteButton({ gameId }: { gameId: string }) {
  const [fav, setFav] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setFav(getFavorites().includes(gameId))
  }, [gameId])

  const toggle = () => {
    const current = getFavorites()
    const next = current.includes(gameId)
      ? current.filter(id => id !== gameId)
      : [...current, gameId]
    localStorage.setItem(KEY, JSON.stringify(next))
    setFav(next.includes(gameId))
  }

  if (!mounted) {
    return (
      <span className="ml-auto flex items-center gap-1 text-sm text-gray-400 border border-gray-300 px-3 py-1 rounded-lg">
        ☆ お気に入り
      </span>
    )
  }

  return (
    <button
      onClick={toggle}
      className={`ml-auto flex items-center gap-1 text-sm px-3 py-1 rounded-lg border transition-colors ${
        fav
          ? 'bg-amber-50 text-amber-600 border-amber-300'
          : 'text-gray-500 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {fav ? '★' : '☆'} お気に入り
    </button>
  )
}
