'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import BoardGameVoteButton from '@/components/BoardGameVoteButton'
import { submitBoardGameRequest } from '@/app/actions/boardgame'

type BoardGame = {
  id: string
  name: string
  description: string | null
  vote_count: number
  image_url: string | null
}

const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600']

export default function BoardGameClient({ games }: { games: BoardGame[] }) {
  const [votedIds, setVotedIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  // リクエストフォーム
  const [reqName, setReqName] = useState('')
  const [reqComment, setReqComment] = useState('')
  const [reqDone, setReqDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setVotedIds(JSON.parse(localStorage.getItem('nomipedia_board_game_votes') || '[]'))
  }, [])

  const filtered = query.trim()
    ? games.filter(g => g.name.toLowerCase().includes(query.trim().toLowerCase()))
    : games

  const handleRequest = () => {
    if (!reqName.trim()) return
    startTransition(async () => {
      await submitBoardGameRequest(reqName, reqComment)
      setReqName('')
      setReqComment('')
      setReqDone(true)
    })
  }

  return (
    <div>
      {/* 検索 */}
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ボードゲームを検索…"
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* ランキング一覧（タップで詳細へ） */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">該当するボードゲームがありません</p>
        ) : (
          filtered.map((game) => {
            const rank = games.indexOf(game)
            return (
              <div key={game.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className={`text-xl font-bold w-7 text-center shrink-0 ${rankColors[rank] ?? 'text-gray-300'}`}>
                  {rank + 1}
                </div>
                <Link href={`/board-games/${game.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                    {game.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🎲</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{game.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5 truncate">{game.description}</div>
                  </div>
                </Link>
                <BoardGameVoteButton boardGameId={game.id} initialCount={game.vote_count} votedIds={votedIds} />
              </div>
            )
          })
        )}
      </div>

      {/* リクエスト送信 */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h2 className="font-bold text-gray-900 mb-1">🙋 載せてほしいボードゲームをリクエスト</h2>
        <p className="text-xs text-gray-500 mb-3">「これも入れて！」というボードゲームを教えてください。運営が確認して追加します。</p>
        {reqDone ? (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            リクエストありがとうございます！確認して追加を検討します🍻
            <button onClick={() => setReqDone(false)} className="ml-2 text-blue-600 hover:underline">続けて送る</button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text" value={reqName} onChange={e => setReqName(e.target.value)}
              placeholder="ボードゲーム名（必須）" maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <textarea
              value={reqComment} onChange={e => setReqComment(e.target.value)}
              placeholder="おすすめポイント・ひとこと（任意）" rows={2} maxLength={300}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleRequest}
                disabled={!reqName.trim() || isPending}
                className="px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {isPending ? '送信中…' : 'リクエストを送る'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
