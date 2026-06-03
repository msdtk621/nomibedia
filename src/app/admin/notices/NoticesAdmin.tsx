'use client'

import { useState, useTransition } from 'react'
import { addNotice, deleteNotice } from '@/app/actions/admin'

type Notice = { id: string; content: string; created_at: string }

export default function NoticesAdmin({ notices, adminKey }: { notices: Notice[]; adminKey: string }) {
  const [text, setText] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleAdd = () => {
    const content = text.trim()
    if (!content) return
    startTransition(async () => {
      await addNotice(content, adminKey)
      setText('')
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNotice(id, adminKey)
    })
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">新しいお知らせを追加</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            maxLength={200}
            placeholder="例：新機能を追加しました！"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            disabled={isPending || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            追加
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">サイドバーの「お知らせ」に表示されます（最新5件）</p>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">お知らせはまだありません</div>
      ) : (
        <div className="space-y-2">
          {notices.map(n => (
            <div key={n.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
              <span className="flex-1 text-sm text-gray-700">{n.content}</span>
              <span className="text-xs text-gray-400 shrink-0">{new Date(n.created_at).toLocaleDateString('ja-JP')}</span>
              <button
                onClick={() => handleDelete(n.id)}
                disabled={isPending}
                className="text-xs text-red-500 border border-red-200 rounded px-2 py-1 hover:bg-red-50 disabled:opacity-50 shrink-0"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
