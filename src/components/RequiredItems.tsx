import { itemKeywordLinks, hasItemLinks, AFFILIATE_REL } from '@/lib/affiliate'
import { searchRakutenProduct } from '@/lib/rakuten-api'
import ShopButtons from './ShopButtons'

// 楽天APIの結果は12hキャッシュ（全ゲーム共通の道具なのでAPIの叩きすぎ防止）
const GOODS_REVALIDATE = 60 * 60 * 12
// 本文下に出す実商品カードの最大数（増やしすぎると広告的に重くなる）
const MAX_CARDS = 2

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 「必要なもの」テキスト中のキーワード（サイコロ/トランプ等）を物販リンクに自動変換し、
// さらに検出した道具については楽天APIで実商品カード（画像・最安値・Amazon/楽天）を本文下に表示する。
// 「必要なもの」を読む＝今まさに道具を探している瞬間なのでCVRが構造的に高い枠。
// 楽天キー未設定/取得失敗時はカードを出さず、従来の自動リンクのみにフォールバックする。
export default async function RequiredItems({ text }: { text: string }) {
  if (!hasItemLinks || !text) {
    return <p className="text-gray-700">{text}</p>
  }

  // 長いキーワードを優先してマッチさせる
  const keywords = [...itemKeywordLinks].sort((a, b) => b.keyword.length - a.keyword.length)
  const urlOf = new Map(keywords.map((k) => [k.keyword, k.url]))
  const pattern = new RegExp(`(${keywords.map((k) => escapeRegExp(k.keyword)).join('|')})`, 'g')

  const parts = text.split(pattern)
  const linked = parts.some((part) => urlOf.has(part))

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

  // テキストに登場した道具のうち、先頭 MAX_CARDS 件を楽天APIで実商品化
  const seen = new Set<string>()
  const picks = keywords
    .filter((k) => text.includes(k.keyword) && !seen.has(k.keyword) && seen.add(k.keyword))
    .slice(0, MAX_CARDS)

  const fetched = await Promise.all(
    picks.map(async (k) => {
      const live = await searchRakutenProduct(k.searchKeyword ?? k.keyword, {
        revalidate: GOODS_REVALIDATE,
        hits: 20,
      })
      return live ? { keyword: k.keyword, amazonUrl: k.url, live } : null
    }),
  )
  const cards = fetched.filter((c): c is NonNullable<typeof c> => c !== null)

  return (
    <div>
      <p className="text-gray-700">{nodes}</p>

      {cards.length > 0 && (
        <div className="mt-3 space-y-2">
          {cards.map((c) => (
            <div key={c.keyword} className="flex gap-3 p-3 border border-gray-200 rounded-lg bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.live.imageUrl}
                alt={c.keyword}
                className="w-16 h-16 object-contain rounded bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-amber-600 mb-0.5">「{c.keyword}」を探すなら</div>
                <div className="text-sm text-gray-800 line-clamp-2 leading-snug mb-1">{c.live.itemName}</div>
                {c.live.price > 0 && (
                  <div className="mb-1.5">
                    <span className="text-sm font-bold text-gray-900">¥{c.live.price.toLocaleString()}</span>
                    <span className="ml-1 text-[10px] text-gray-400">楽天参考価格</span>
                  </div>
                )}
                <ShopButtons keyword={c.keyword} amazonUrl={c.amazonUrl} rakutenUrl={c.live.affiliateUrl} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {(linked || cards.length > 0) && (
        <p className="mt-2 text-[11px] text-gray-400">※リンクは広告（PR）を含みます</p>
      )}
    </div>
  )
}
