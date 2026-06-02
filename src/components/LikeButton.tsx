'use client'

import { useState, useEffect, useTransition } from 'react'
import { toggleLike } from '@/app/actions/like'

function getUserId() {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('nomipedia_uid')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('nomipedia_uid', id)
  }
  return id
}

export default function LikeButton({ gameId, initialCount }: { gameId: string; initialCount: number }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const userId = getUserId()
    const likedGames = JSON.parse(localStorage.getItem('nomipedia_likes') || '[]')
    setLiked(likedGames.includes(gameId))
  }, [gameId])

  const handleClick = () => {
    const userId = getUserId()
    const likedGames = JSON.parse(localStorage.getItem('nomipedia_likes') || '[]')
    const newLiked = !liked
    setLiked(newLiked)
    setCount(c => newLiked ? c + 1 : c - 1)
    if (newLiked) {
      localStorage.setItem('nomipedia_likes', JSON.stringify([...likedGames, gameId]))
    } else {
      localStorage.setItem('nomipedia_likes', JSON.stringify(likedGames.filter((id: string) => id !== gameId)))
    }
    startTransition(async () => {
      const result = await toggleLike(gameId, userId)
      setCount(result.count)
      setLiked(result.liked)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-2 transition-colors font-medium px-4 py-2 rounded-lg border ${
        liked
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          : 'text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      <span className="text-lg">{liked ? '👍' : '👍'}</span>
      いいね！ {count}
    </button>
  )
}
