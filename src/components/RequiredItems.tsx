import { itemKeywordLinks, hasItemLinks, AFFILIATE_REL } from '@/lib/affiliate'

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 「必要なもの」テキスト中のキーワード（サイコロ/トランプ等）を物販リンクに自動変換する。
// キーワード辞書が空のときはプレーンテキストをそのまま表示（＝アフィUIは出ない）。
export default function RequiredItems({ text }: { text: string }) {
  if (!hasItemLinks || !text) {
    return <p className="text-gray-700">{text}</p>
  }

  // 長いキーワードを優先してマッチさせる
  const keywords = [...itemKeywordLinks].sort((a, b) => b.keyword.length - a.keyword.length)
  const urlOf = new Map(keywords.map(k => [k.keyword, k.url]))
  const pattern = new RegExp(`(${keywords.map(k => escapeRegExp(k.keyword)).join('|')})`, 'g')

  const parts = text.split(pattern)
  const linked = parts.some(part => urlOf.has(part))

  const nodes = parts.map((part, i) => {
    const url = urlOf.get(part)
    if (url) {
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel={AFFILIATE_REL}
          className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:decoration-amber-500"
        >
          {part}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })

  return (
    <div>
      <p className="text-gray-700">{nodes}</p>
      {linked && (
        <p className="mt-1 text-[11px] text-gray-400">
          ※リンクは広告（PR）を含みます
        </p>
      )}
    </div>
  )
}
