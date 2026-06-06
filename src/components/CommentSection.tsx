'use client'

import { useState, useTransition, useRef } from 'react'

type Comment = {
  id: string
  game_id?: string
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

// 本文中の「>>数字」をタップ可能なアンカーに変換
function renderContent(content: string, onAnchor: (n: number) => void) {
  const parts = content.split(/(>>\d+)/g)
  return parts.map((part, i) => {
    const m = part.match(/^>>(\d+)$/)
    if (m) {
      const n = parseInt(m[1], 10)
      return (
        <button
          key={i}
          type="button"
          onClick={() => onAnchor(n)}
          className="text-blue-500 hover:underline font-medium"
        >
          {part}
        </button>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function CommentItem({
  comment,
  onReply,
  onAnchor,
}: {
  comment: Comment
  onReply: (n: number) => void
  onAnchor: (n: number) => void
}) {
  return (
    <div id={`c${comment.number}`} className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-baseline gap-2 mb-1 text-xs text-gray-500 flex-wrap">
        <span className="font-bold text-gray-700 text-sm">{comment.number}</span>
        <span className="text-green-700 font-medium">{comment.author_name}</span>
        <span>{formatDate(comment.created_at)}</span>
        <span>ID: {comment.author_id}</span>
        <button
          type="button"
          onClick={() => onReply(comment.number)}
          className="ml-auto text-blue-500 hover:underline"
        >
          返信
        </button>
      </div>
      <div className="text-sm text-gray-800 whitespace-pre-line pl-5 leading-relaxed">
        {comment.reply_to && (
          <button
            type="button"
            onClick={() => onAnchor(comment.reply_to as number)}
            className="text-blue-500 hover:underline font-medium mr-1"
          >
            &gt;&gt;{comment.reply_to}
          </button>
        )}
        {renderContent(comment.content, onAnchor)}
      </div>
    </div>
  )
}

export default function CommentSection({
  initialComments,
  onSubmit,
}: {
  initialComments: Comment[]
  onSubmit: (name: string, content: string, replyTo: number | null) => Promise<void>
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [name, setName] = useState('名無しさん@〜ぽん')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [preview, setPreview] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getComment = (n: number) => comments.find(c => c.number === n) ?? null

  const handleReply = (n: number) => {
    setReplyTo(n)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const optimistic: Comment = {
      id: String(Date.now()),
      number: comments.length + 1,
      author_name: name || '名無しさん@〜ぽん',
      author_id: '...',
      content: content.trim(),
      created_at: new Date().toISOString(),
      reply_to: replyTo,
    }
    setComments(prev => [...prev, optimistic])
    const saved = content.trim()
    const savedName = name || '名無しさん@〜ぽん'
    const savedReplyTo = replyTo
    setContent('')
    setReplyTo(null)

    startTransition(async () => {
      await onSubmit(savedName, saved, savedReplyTo)
    })
  }

  const previewComment = preview != null ? getComment(preview) : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden relative">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-gray-900">コメント一覧（{comments.length}件）</h2>
      </div>

      <div className="divide-y divide-gray-100 px-5">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-gray-400 text-sm">まだコメントはありません。最初のコメントを書いてみよう！</p>
        ) : (
          comments.map(c => (
            <CommentItem key={c.id} comment={c} onReply={handleReply} onAnchor={setPreview} />
          ))
        )}
      </div>

      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyTo != null && (
            <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <span className="text-blue-700">&gt;&gt;{replyTo} に返信中</span>
              <button type="button" onClick={() => setReplyTo(null)} className="ml-auto text-gray-400 hover:text-red-500">×</button>
            </div>
          )}
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
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="コメントを入力...（>>番号 で返信できます）"
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

      {/* >>番号 タップ時のプレビュー */}
      {preview != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center mb-2">
              <span className="text-sm font-bold text-gray-700">&gt;&gt;{preview}</span>
              <button type="button" onClick={() => setPreview(null)} className="ml-auto text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
            </div>
            {previewComment ? (
              <>
                <div className="flex items-baseline gap-2 mb-1 text-xs text-gray-500 flex-wrap">
                  <span className="text-green-700 font-medium">{previewComment.author_name}</span>
                  <span>{formatDate(previewComment.created_at)}</span>
                  <span>ID: {previewComment.author_id}</span>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {previewComment.reply_to && (
                    <span className="text-blue-500 font-medium mr-1">&gt;&gt;{previewComment.reply_to}</span>
                  )}
                  {previewComment.content}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">コメントが見つかりません</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
