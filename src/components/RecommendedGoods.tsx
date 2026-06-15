import { recommendedGoods, hasGoods, AFFILIATE_REL } from '@/lib/affiliate'

// サイドバー「飲み会おすすめグッズ」枠。商品ごとに [楽天][Amazon] のリンクボタンを並べる。
// 商品が未登録なら何も描画しない。
export default function RecommendedGoods() {
  if (!hasGoods) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">飲み会おすすめグッズ</h3>
        <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">PR</span>
      </div>
      <div className="space-y-4">
        {recommendedGoods.map(g => (
          <div key={g.id} className="flex gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
              {g.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">🛒</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {g.tag && <div className="text-xs text-amber-600 truncate">{g.tag}</div>}
              <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-1.5">{g.name}</div>
              <div className="flex gap-1.5">
                {g.rakutenUrl && (
                  <a
                    href={g.rakutenUrl}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="flex-1 text-center text-xs font-bold text-white bg-[#bf0000] hover:bg-[#a00000] rounded py-1 transition-colors"
                  >
                    楽天
                  </a>
                )}
                {g.amazonUrl && (
                  <a
                    href={g.amazonUrl}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="flex-1 text-center text-xs font-bold text-gray-900 bg-[#ff9900] hover:bg-[#e88a00] rounded py-1 transition-colors"
                  >
                    Amazon
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
