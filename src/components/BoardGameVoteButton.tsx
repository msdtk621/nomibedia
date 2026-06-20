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
      // サーバーが数え直した実票数で表示を更新（ズレ防止）
      setVoted(result.voted)
      setCount(result.count)
      // 投票状態を localStorage に保存し、リロード後もグッドマークが残るようにする
      const stored: string[] = JSON.parse(localStorage.getItem('nomipedia_board_game_votes') || '[]')
      const next = result.voted
        ? Array.from(new Set([...stored, boardGameId]))
        : stored.filter(id => id !== boardGameId)
      localStorage.setItem('nomipedia_board_game_votes', JSON.stringify(next))
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
