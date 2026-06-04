import { hangoverAds, hasHangoverAds, AFFILIATE_REL } from '@/lib/affiliate'

// 二日酔い対策バナー（A8.net）。広告が未登録なら何も描画しない。
export default function HangoverBanner() {
  if (!hasHangoverAds) return null
  const ad = hangoverAds[0]

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">🌿</span>
        <span className="text-sm font-bold text-amber-800">飲んだ後のケアに</span>
        <span className="ml-auto text-[10px] text-amber-500 border border-amber-200 px-1.5 py-0.5 rounded">PR</span>
      </div>
      <a href={ad.href} target="_blank" rel={AFFILIATE_REL} className="block">
        {ad.imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imgSrc}
            alt={ad.text}
            width={ad.imgWidth}
            height={ad.imgHeight}
            className="rounded-lg mx-auto"
          />
        ) : (
          <span className="text-sm text-amber-700 underline hover:no-underline">{ad.text}</span>
        )}
      </a>
    </div>
  )
}
