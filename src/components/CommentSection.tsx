'use client'

import { useState, useTransition } from 'react'
import { postComment } from '@/app/actions/comment'

type Comment = {
  id: string
  game_id: string
  number: number
  author_name: string
  author_id: string
  content: string
  created_at: string
  reply_to?: number | null
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div id={`c${comment.number}`} className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-baseline gap-2 mb-1 text-xs text-gray-500 flex-wrap">
        <span className="font-bold text-gray-700 text-sm">{comment.number}</span>
        <span className="text-green-700 font-medium">{comment.author_name}</span>
        <span>{formatDate(comment.created_at)}</span>
        <span>ID: {comment.author_id}</span>
      </div>
      <div className="text-sm text-gray-800 whitespace-pre-line pl-5 leading-relaxed">
        {comment.reply_to && (
          <a href={`#c${comment.reply_to}`} className="text-blue-500 hover:underline mr-1">&gt;&gt;{comment.reply_to}</a>
        )}
        {comment.content}
      </div>
    </div>
  )
}

export default function CommentSection({ gameId, initialComments }: { gameId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [name, setName] = useState('名無しさん@〜ぽん')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const optimistic: Comment = {
      id: String(Date.now()),
      game_id: gameId,
      number: comments.length + 1,
      author_name: name || '名無しさん@〜ぽん',
      author_id: '...',
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    setComments(prev => [...prev, optimistic])
    const saved = content.trim()
    const savedName = name
    setContent('')

    startTransition(async () => {
      await postComment(gameId, savedName, saved)
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-gray-900">コメント一覧（{comments.length}件）</h2>
      </div>

      <div className="divide-y divide-gray-100 px-5">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-gray-400 text-sm">まだコメントはありません。最初のコメントを書いてみよう！</p>
        ) : (
          comments.map(c => <CommentItem key={c.id} comment={c} />)
        )}
      </div>

      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="名無しさん@〜ぽん"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">コメント</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="コメントを入力..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={!content.trim() || isPending}
            >
              {isPending ? '送信中...' : '書き込む'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
