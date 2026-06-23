import { recommendedGoods, hasGoods } from '@/lib/affiliate'
import { searchRakutenProduct } from '@/lib/rakuten-api'
import ShopButtons from './ShopButtons'

// 楽天APIの結果は全ページ共通かつ日次更新で十分なので12hキャッシュ（APIの叩きすぎ防止）。
const GOODS_REVALIDATE = 60 * 60 * 12

// サイドバー「飲み会おすすめグッズ」枠。
// 楽天APIで各商品の実画像・参考価格・商品ページへのアフィリンクを取得して表示する。
// APIキー(RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY)未設定や取得失敗時は live が null になり、
// 静的な🛒＋検索リンク表示へ自動フォールバックする（壊れた枠は出ない）。
export default async function RecommendedGoods() {
  if (!hasGoods) return null

  const goods = await Promise.all(
    recommendedGoods.map(async (g) => {
      const live = await searchRakutenProduct(g.searchKeyword ?? g.name, {
        revalidate: GOODS_REVALIDATE,
      })
      return {
        ...g,
        imageUrl: live?.imageUrl ?? g.imageUrl,
        // 実商品が取れたら楽天ボタンはその商品ページへ深リンク（検索ページよりCVRが高い）
        rakutenUrl: live?.affiliateUrl || g.rakutenUrl,
        priceText: live?.price ? `¥${live.price.toLocaleString()}` : g.price,
      }
    }),
  )

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-900">飲み会おすすめグッズ</h3>
      </div>
      <div className="space-y-3">
        {goods.map(g => (
          <div
            key={g.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
              {g.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🛒</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {g.tag && <div className="text-xs text-amber-600 truncate">{g.tag}</div>}
              <div className="font-semibold text-gray-900 line-clamp-2 leading-snug mb-0.5">{g.name}</div>
              {g.priceText && (
                <div className="mb-1.5">
                  <span className="text-sm font-bold text-gray-900">{g.priceText}</span>
                  <span className="ml-1 text-[10px] text-gray-400">楽天参考価格</span>
                </div>
              )}
              <ShopButtons keyword={g.name} amazonUrl={g.amazonUrl} rakutenUrl={g.rakutenUrl} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
