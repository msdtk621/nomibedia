'use client'

import { useEffect, useState } from 'react'
import BoardGameVoteButton from '@/components/BoardGameVoteButton'

type BoardGame = {
  id: string
  name: string
  description: string
  vote_count: number
}

const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600']

export default function BoardGameClient({ games }: { games: BoardGame[] }) {
  const [votedIds, setVotedIds] = useState<string[]>([])

  useEffect(() => {
    // localStorageから投票済みIDを取得（簡易的な表示用）
    const uid = localStorage.getItem('nomipedia_uid')
    if (uid) {
      // サーバー側で照合するため、ここではUIだけ
    }
    setVotedIds(JSON.parse(localStorage.getItem('nomipedia_board_game_votes') || '[]'))
  }, [])

  return (
    <div className="space-y-3">
      {games.map((game, i) => (
        <div key={game.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className={`text-2xl font-bold w-8 text-center shrink-0 ${rankColors[i] ?? 'text-gray-300'}`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900">{game.name}</div>
            <div className="text-sm text-gray-500 mt-0.5 truncate">{game.description}</div>
          </div>
          <BoardGameVoteButton
            boardGameId={game.id}
            initialCount={game.vote_count}
            votedIds={votedIds}
          />
        </div>
      ))}
    </div>
  )
}
