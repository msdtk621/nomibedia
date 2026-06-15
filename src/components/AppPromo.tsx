import { asset } from '@/lib/asset'

type PromoApp = {
  name: string
  genre: string
  desc: string
  icon: string
  url: string
}

const apps: PromoApp[] = [
  {
    name: 'ぬっこ様',
    genre: 'ゲーム',
    desc: '寝てるぬっこ様を起こしたら負け。そっと撫でるドキドキ脱力ゲーム。',
    icon: '/app-nukkosama.jpg',
    url: 'https://apps.apple.com/jp/app/id6779063105',
  },
  {
    name: 'お題出すぬっこ',
    genre: 'ライフスタイル',
    desc: '飲み会・合コンの「何話す？」を解決。お題をスワイプで集めて自分だけのデッキに。',
    icon: '/app-odai.jpg',
    url: 'https://apps.apple.com/jp/app/id6779667247',
  },
]

export default function AppPromo() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xl font-bold text-gray-900">ぬっこ様のアプリ</h2>
        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">PR</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {apps.map((app) => (
          <a
            key={app.url}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 md:p-4 hover:border-amber-300 hover:shadow-sm transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(app.icon)}
              alt={app.name}
              className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl object-cover shrink-0 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 truncate">{app.name}</span>
                <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-px shrink-0">{app.genre}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">{app.desc}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-white bg-gray-900 rounded-lg px-3 py-1.5 group-hover:bg-black">
                 App Store で見る
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
