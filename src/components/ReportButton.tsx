'use client'

import { useState } from 'react'
import { reportGame } from '@/app/actions/report'

export default function ReportButton({ gameId }: { gameId: string }) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  const handleReport = async (reason: string) => {
    await reportGame(gameId, reason)
    setDone(true)
    setOpen(false)
  }

  if (done) return <span className="text-xs text-gray-400">通報しました</span>

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="text-gray-400 text-sm hover:text-red-500">
        ⚑ 通報する
      </button>
      {open && (
        <div className="absolute right-0 bottom-8 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-48 z-10">
          <p className="text-xs font-medium text-gray-700 mb-2">通報理由を選択</p>
          {['不適切なコンテンツ', 'スパム・広告', '著作権侵害', 'その他'].map(r => (
            <button key={r} onClick={() => handleReport(r)}
              className="block w-full text-left text-sm text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded">
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
