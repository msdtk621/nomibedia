'use client'

import { useEffect, useState } from 'react'

// 管理者が投稿したゲームの投稿者ID（getOrCreate不要・固定）
const ADMIN_AUTHOR_ID = 'nomibedia'

export default function ClaimClient() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const key = 'nomipedia_my_author_ids'
    const ids: string[] = JSON.parse(localStorage.getItem(key) || '[]')
    if (!ids.includes(ADMIN_AUTHOR_ID)) {
      localStorage.setItem(key, JSON.stringify([...ids, ADMIN_AUTHOR_ID]))
    }
    setDone(true)
  }, [])

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
      {done ? (
        <>
          <div className="text-3xl mb-3">✅</div>
          <p className="font-bold text-gray-900 mb-1">この端末で「運営投稿」を編集できるようになりました</p>
          <p className="text-sm text-gray-500">運営として投稿したゲームのページに、編集・削除ボタンが表示されます。</p>
        </>
      ) : (
        <p className="text-gray-500">設定中…</p>
      )}
    </div>
  )
}
