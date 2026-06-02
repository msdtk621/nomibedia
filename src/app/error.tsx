'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">😵</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">エラーが発生しました</h1>
      <p className="text-gray-500 mb-6">しばらくしてからもう一度お試しください</p>
      <div className="flex gap-3">
        <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          もう一度試す
        </button>
        <Link href="/" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          トップに戻る
        </Link>
      </div>
    </div>
  )
}
