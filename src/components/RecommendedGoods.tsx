import { recommendedGoods, hasGoods } from '@/lib/affiliate'
import ShopButtons from './ShopButtons'

// サイドバー「飲み会おすすめグッズ」枠。商品ごとに ShopButtons（白地ミニマル・PR付き）でリンクを並べる。
// リンクの見た目はサイト共通の ShopButtons に統一。商品が未登録なら何も描画しない。
export default function RecommendedGoods() {
  if (!hasGoods) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-900">飲み会おすすめグッズ</h3>
      </div>
      <div className="space-y-3">
        {recommendedGoods.map(g => (
          <div
            key={g.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
              {g.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🛒</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {g.tag && <div className="text-xs text-amber-600 truncate">{g.tag}</div>}
              <div className="font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5">{g.name}</div>
              <ShopButtons keyword={g.name} amazonUrl={g.amazonUrl} rakutenUrl={g.rakutenUrl} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
