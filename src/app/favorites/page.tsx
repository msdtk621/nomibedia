import RankingSidebar from '@/components/RankingSidebar'
import FavoritesClient from './FavoritesClient'

export const metadata = { title: 'お気に入り | ノミベディア' }

export default function FavoritesPage() {
  return (
    <div className="flex gap-6 p-3 md:p-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl text-amber-400">★</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">お気に入り</h1>
            <p className="text-gray-500 text-sm">あなたが保存した飲みゲーム</p>
          </div>
        </div>
        <FavoritesClient />
      </div>
      <RankingSidebar />
    </div>
  )
}
