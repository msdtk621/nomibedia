import { amazonSearch, rakutenSearch, hasAmazon, hasRakuten, AFFILIATE_REL } from '@/lib/affiliate'

const AMAZON_COLOR = '#FF9900'
const RAKUTEN_COLOR = '#BF0000'

function CartIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

// ボードゲームの楽天/Amazon購入(検索)リンク。
// 個別アフィリンク(amazonUrl/rakutenUrl)があればそれを優先し、無ければ商品名で検索リンクにフォールバック。
// size='sm' …ランキング一覧カード用の小さめ / size='lg' …詳細ページ用の大きめ
export default function ShopButtons({
  keyword,
  amazonUrl,
  rakutenUrl,
  size = 'sm',
}: {
  keyword: string
  amazonUrl?: string | null
  rakutenUrl?: string | null
  size?: 'sm' | 'lg'
}) {
  const amazonHref = amazonUrl || (hasAmazon ? amazonSearch(keyword) : null)
  const rakutenHref = rakutenUrl || (hasRakuten ? rakutenSearch(keyword) : null)
  if (!amazonHref && !rakutenHref) return null

  const amazonLabel = size === 'lg' ? (amazonUrl ? 'Amazonで見る' : 'Amazonで探す') : 'Amazon'
  const rakutenLabel = size === 'lg' ? (rakutenUrl ? '楽天で見る' : '楽天で探す') : '楽天'

  if (size === 'lg') {
    const cls = 'flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors'
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        {amazonHref && (
          <a href={amazonHref} target="_blank" rel={AFFILIATE_REL} className={cls}>
            <CartIcon color={AMAZON_COLOR} size={18} />{amazonLabel}
          </a>
        )}
        {rakutenHref && (
          <a href={rakutenHref} target="_blank" rel={AFFILIATE_REL} className={cls}>
            <CartIcon color={RAKUTEN_COLOR} size={18} />{rakutenLabel}
          </a>
        )}
      </div>
    )
  }

  const cls = 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors'
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-400 border border-gray-200 px-1 py-px rounded shrink-0">PR</span>
      {amazonHref && (
        <a href={amazonHref} target="_blank" rel={AFFILIATE_REL} className={cls}>
          <CartIcon color={AMAZON_COLOR} size={14} />{amazonLabel}
        </a>
      )}
      {rakutenHref && (
        <a href={rakutenHref} target="_blank" rel={AFFILIATE_REL} className={cls}>
          <CartIcon color={RAKUTEN_COLOR} size={14} />{rakutenLabel}
        </a>
      )}
    </div>
  )
}
