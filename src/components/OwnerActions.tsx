'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteGame } from '@/app/actions/game'

export default function OwnerActions({ gameId, authorId }: { gameId: string; authorId: string }) {
  const [isOwner, setIsOwner] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const myIds = JSON.parse(localStorage.getItem('nomipedia_my_author_ids') || '[]')
    setIsOwner(myIds.includes(authorId))
  }, [authorId])

  if (!isOwner) return null

  const handleDelete = () => {
    startTransition(async () => {
      await deleteGame(gameId, authorId)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/games/${gameId}/edit`}
        className="px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        編集
      </Link>
      {showConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-600">本当に削除しますか？</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? '削除中…' : '削除する'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="px-3 py-1.5 text-sm border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      )}
    </div>
  )
}
