'use client'

import { useState } from 'react'

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `${title} | ノミベディア`

  const shareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getUrl())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getUrl())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // クリップボード非対応時はWeb Share APIを試す
      if (navigator.share) navigator.share({ title: shareText, url: getUrl() })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-1">シェア:</span>
      <button
        onClick={shareX}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:opacity-80 transition-opacity text-xs font-bold"
        title="Xでシェア"
      >
        𝕏
      </button>
      <button
        onClick={shareLine}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#06C755] text-white hover:opacity-80 transition-opacity text-xs font-bold"
        title="LINEでシェア"
      >
        L
      </button>
      <button
        onClick={copyLink}
        className="h-8 px-3 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs"
        title="リンクをコピー"
      >
        {copied ? '✓ コピー済み' : '🔗 リンク'}
      </button>
    </div>
  )
}
