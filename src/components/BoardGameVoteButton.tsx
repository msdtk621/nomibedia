'use client'

import { useState, useEffect, useTransition } from 'react'
import { voteBoardGame } from '@/app/actions/boardgame'

export default function BoardGameVoteButton({
  boardGameId,
  initialCount,
  votedIds,
}: {
  boardGameId: string
  initialCount: number
  votedIds: string[]
}) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setVoted(votedIds.includes(boardGameId))
  }, [boardGameId, votedIds])

  const handleVote = () => {
    const voterId = localStorage.getItem('nomipedia_uid') || (() => {
      const id = Math.random().toString(36).slice(2)
      localStorage.setItem('nomipedia_uid', id)
      return id
    })()

    startTransition(async () => {
      const result = await voteBoardGame(boardGameId, voterId)
      if (result.voted) {
        setCount(c => c + 1)
        setVoted(true)
      } else {
        setCount(c => c - 1)
        setVoted(false)
      }
    })
  }

  return (
    <button
      onClick={handleVote}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
        voted
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      👍 {count}
    </button>
  )
}
