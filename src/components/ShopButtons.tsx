import { amazonSearch, rakutenSearch, hasAmazon, hasRakuten, AFFILIATE_REL } from '@/lib/affiliate'

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
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        {amazonHref && (
          <a href={amazonHref} target="_blank" rel={AFFILIATE_REL}
            className="flex-1 text-center px-4 py-3 bg-[#FF9900] text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            {amazonLabel}
          </a>
        )}
        {rakutenHref && (
          <a href={rakutenHref} target="_blank" rel={AFFILIATE_REL}
            className="flex-1 text-center px-4 py-3 bg-[#BF0000] text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            {rakutenLabel}
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-400 border border-gray-200 px-1 py-px rounded shrink-0">PR</span>
      {amazonHref && (
        <a href={amazonHref} target="_blank" rel={AFFILIATE_REL}
          className="px-2.5 py-1 text-xs font-bold text-white bg-[#FF9900] rounded-md hover:opacity-90 transition-opacity">
          🛒 {amazonLabel}
        </a>
      )}
      {rakutenHref && (
        <a href={rakutenHref} target="_blank" rel={AFFILIATE_REL}
          className="px-2.5 py-1 text-xs font-bold text-white bg-[#BF0000] rounded-md hover:opacity-90 transition-opacity">
          🛒 {rakutenLabel}
        </a>
      )}
    </div>
  )
}
