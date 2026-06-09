'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const SEEN_KEY = 'nomibedia_admin_seen'

type Seen = { reports: number; requests: number }

function countNew(times: string[], since: number): number {
  return times.filter(t => new Date(t).getTime() > since).length
}

export default function AdminDashboard({
  adminKey,
  reportTimes,
  requestTimes,
  noticeCount,
}: {
  adminKey: string
  reportTimes: string[]
  requestTimes: string[]
  noticeCount: number
}) {
  const [seen, setSeen] = useState<Seen | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SEEN_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      setSeen({ reports: parsed.reports ?? 0, requests: parsed.requests ?? 0 })
    } catch {
      setSeen({ reports: 0, requests: 0 })
    }
  }, [])

  const markSeen = (kind: 'reports' | 'requests') => {
    setSeen(prev => {
      const next = { reports: prev?.reports ?? 0, requests: prev?.requests ?? 0, [kind]: Date.now() }
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  // seen が読み込まれるまではバッジを出さない（チラつき防止）
  const newReports = seen ? countNew(reportTimes, seen.reports) : 0
  const newRequests = seen ? countNew(requestTimes, seen.requests) : 0

  const q = `?key=${encodeURIComponent(adminKey)}`

  return (
    <div className="space-y-3">
      <Card
        href={`/admin/reports${q}`}
        emoji="🚨"
        title="通報一覧"
        desc={`報告された投稿 全${reportTimes.length}件`}
        badge={newReports}
        onSeen={() => markSeen('reports')}
      />
      <Card
        href={`/admin/board-games${q}`}
        emoji="🎲"
        title="ボードゲーム管理・リクエスト"
        desc={`リクエスト 全${requestTimes.length}件`}
        badge={newRequests}
        onSeen={() => markSeen('requests')}
      />
      <Card
        href={`/admin/notices${q}`}
        emoji="📢"
        title="お知らせ管理"
        desc={`現在 ${noticeCount}件 公開中`}
      />
      <Card
        href={`/admin/claim${q}`}
        emoji="✏️"
        title="運営投稿の編集権限"
        desc="この端末で運営投稿を編集できるようにする"
      />
    </div>
  )
}

function Card({
  href,
  emoji,
  title,
  desc,
  badge = 0,
  onSeen,
}: {
  href: string
  emoji: string
  title: string
  desc: string
  badge?: number
  onSeen?: () => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 transition-colors">
      <span className="text-2xl shrink-0">{emoji}</span>
      <Link href={href} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{title}</span>
          {badge > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </Link>
      {onSeen && badge > 0 && (
        <button
          onClick={onSeen}
          className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 shrink-0"
        >
          確認済み
        </button>
      )}
    </div>
  )
}
