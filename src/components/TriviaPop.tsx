'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { triviaCategoryMeta, type Trivia } from '@/lib/trivia'

/**
 * 豆知識のPOP1枚。
 * 「続きを読む」でモーダルが開き、結論だけを短く見せる。
 * さらに詳しく知りたい人だけ /trivia/[slug] へ送る三段構え。
 * 投稿カード（白地・グレー枠）に埋もれないよう、意図的に色を強くしている。
 */
export default function TriviaPop({ trivia }: { trivia: Trivia }) {
  const [open, setOpen] = useState(false)
  const meta = triviaCategoryMeta[trivia.category]

  // モーダルを開いている間は背面のスクロールを止める
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* POP本体。h-full は横に並べたとき高さを揃えるため。
          スマホは2列で幅が狭いので、余白と文字を一段小さくする */}
      <div className="h-full flex flex-col bg-amber-50 border-2 border-amber-300 rounded-xl p-3 lg:p-4 shadow-sm">
        <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-2.5">
          <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs lg:text-sm shrink-0">
            {meta.emoji}
          </span>
          <span className="font-bold text-amber-600 text-[11px] lg:text-sm leading-tight">
            {meta.label}の豆知識
          </span>
        </div>

        {/* flex-1 で問いかけを伸ばし、ボタンをカード下端に揃える */}
        <p className="flex-1 font-bold text-gray-900 text-sm lg:text-base leading-snug">
          {trivia.question}
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2.5 lg:mt-3 w-full inline-flex items-center justify-center px-2 py-1.5 lg:py-2 rounded-lg bg-amber-400 text-white text-xs lg:text-sm font-bold hover:bg-amber-500 transition-colors"
        >
          続きを読む
        </button>
      </div>

      {/* モーダル */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`trivia-${trivia.slug}-title`}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-2 mb-6">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0">
                {meta.emoji}
              </span>
              <span className="font-bold text-amber-500 text-lg leading-8">
                {meta.label}の豆知識
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="ml-auto text-gray-400 hover:text-gray-600 text-2xl leading-none px-1"
              >
                ×
              </button>
            </div>

            <h2
              id={`trivia-${trivia.slug}-title`}
              className="text-xl md:text-2xl font-bold text-gray-900 text-center leading-relaxed"
            >
              {trivia.question}
            </h2>

            <div className="border-t-2 border-dotted border-amber-300 my-6" />

            <p className="text-gray-700 leading-relaxed">{trivia.answer}</p>

            <Link
              href={`/trivia/${trivia.slug}`}
              className="mt-6 flex items-center justify-center gap-1 w-full px-6 py-3 bg-amber-400 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors"
            >
              もっと詳しく読む →
            </Link>

            <Link
              href="/trivia"
              className="mt-3 block text-center text-sm text-gray-500 hover:text-amber-600 hover:underline"
            >
              ほかの豆知識も見る
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
