'use client'

import { useState, useTransition } from 'react'
import { dismissReport, deleteGameAsAdmin } from '@/app/actions/admin'

export default function ReportActions({
  reportId,
  gameId,
  adminKey,
}: {
  reportId: string
  gameId: string | null
  adminKey: string
}) {
  const [confirm, setConfirm] = useState<null | 'dismiss' | 'delete'>(null)
  const [isPending, startTransition] = useTransition()

  const handleDismiss = () => {
    startTransition(async () => {
      await dismissReport(reportId, adminKey)
    })
  }

  const handleDeleteGame = () => {
    if (!gameId) return
    startTransition(async () => {
      await deleteGameAsAdmin(gameId, adminKey)
    })
  }

  if (confirm === 'delete') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-red-600">投稿ごと削除しますか？</span>
        <button onClick={handleDeleteGame} disabled={isPending}
          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
          {isPending ? '削除中…' : '削除する'}
        </button>
        <button onClick={() => setConfirm(null)} className="px-2 py-1 border border-gray-300 text-gray-600 rounded">
          やめる
        </button>
      </div>
    )
  }

  if (confirm === 'dismiss') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">この通報を消しますか？</span>
        <button onClick={handleDismiss} disabled={isPending}
          className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50">
          {isPending ? '処理中…' : '消す'}
        </button>
        <button onClick={() => setConfirm(null)} className="px-2 py-1 border border-gray-300 text-gray-600 rounded">
          やめる
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => setConfirm('dismiss')}
        className="px-2.5 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
      >
        通報を消す
      </button>
      {gameId && (
        <button
          onClick={() => setConfirm('delete')}
          className="px-2.5 py-1 text-xs border border-red-300 text-red-500 rounded hover:bg-red-50"
        >
          投稿を削除
        </button>
      )}
    </div>
  )
}
