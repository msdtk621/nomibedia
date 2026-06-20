import { recommendedGoods, hasGoods, AFFILIATE_REL } from '@/lib/affiliate'

// 「飲み会おすすめグッズ」枠。商品が未登録なら何も描画しない。
// カードのデザインはボードゲーム投票一覧（BoardGameClient）に統一。
export default function RecommendedGoods() {
  if (!hasGoods) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-900">飲み会おすすめグッズ</h3>
        <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">PR</span>
      </div>
      <div className="space-y-3">
        {recommendedGoods.map(g => (
          <a
            key={g.id}
            href={g.url}
            target="_blank"
            rel={AFFILIATE_REL}
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
              <div className="font-semibold text-gray-900 line-clamp-2 leading-snug">{g.name}</div>
              {g.price && <div className="text-sm text-gray-500 mt-0.5 truncate">{g.price}</div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
