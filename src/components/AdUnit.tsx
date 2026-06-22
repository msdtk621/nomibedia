'use client'

import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT, adSlots, type AdSlot } from '@/lib/ads'

// Google AdSense 広告ユニット。
// ・slot ID が未設定なら何も描画しない（空枠・レイアウト崩れを出さない＝アフィリ枠と同じ方針）。
// ・min-height を予約して CLS（レイアウトシフト）を防ぐ。SEOのCore Web Vitals対策。
// ・「スポンサーリンク」表記を必ず添える（AdSenseポリシー・誤クリック防止）。
export default function AdUnit({
  slot,
  minHeight = 280,
  className = '',
}: {
  slot: AdSlot
  minHeight?: number
  className?: string
}) {
  const slotId = adSlots[slot]
  const pushed = useRef(false)

  useEffect(() => {
    if (!slotId || pushed.current) return
    try {
      const w = window as unknown as { adsbygoogle?: Record<string, unknown>[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
      pushed.current = true
    } catch {
      // AdSense未ロード時などは無視
    }
  }, [slotId])

  if (!slotId) return null

  return (
    <div className={`my-4 ${className}`} aria-label="広告" style={{ minHeight: minHeight + 18 }}>
      <p className="text-[11px] text-gray-400 text-center mb-1">スポンサーリンク</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
