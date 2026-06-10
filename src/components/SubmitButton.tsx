'use client'

import { useFormStatus } from 'react-dom'

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

/**
 * フォーム送信ボタン。送信中はスピナー＋ラベル変更＋無効化で連打を防ぐ。
 * 必ず <form> の子孫として使うこと（useFormStatus のため）。
 */
export function SubmitButton({
  idleLabel,
  pendingLabel,
  className = '',
}: {
  idleLabel: string
  pendingLabel: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {pending && <Spinner className="w-4 h-4" />}
      {pending ? pendingLabel : idleLabel}
    </button>
  )
}

/**
 * 送信中に画面全体を覆うオーバーレイ。タップを完全にブロックし、進行中だと一目で分かる。
 * 必ず <form> の子孫として使うこと。
 */
export function FormPendingOverlay({ label = '保存中…' }: { label?: string }) {
  const { pending } = useFormStatus()
  if (!pending) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-3 bg-white rounded-2xl px-8 py-6 shadow-xl">
        <Spinner className="w-8 h-8 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-400">そのままお待ちください</span>
      </div>
    </div>
  )
}
