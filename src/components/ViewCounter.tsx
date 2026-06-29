'use client'

import { useEffect } from 'react'

// ゲーム詳細ページの閲覧数をクライアントから加算する（ページのISRキャッシュと両立させるため）。
// 1ブラウザセッションにつき同じゲームは1回だけ数える（リロード連打での水増しを防ぐ）。
export default function ViewCounter({ gameId }: { gameId: string }) {
  useEffect(() => {
    const key = `viewed:${gameId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorageが使えない環境でも計測自体は試みる
    }
    fetch(`/api/games/${gameId}/view`, { method: 'POST', keepalive: true }).catch(() => {})
  }, [gameId])

  return null
}
