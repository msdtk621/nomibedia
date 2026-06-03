'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { categoryImages } from '@/lib/categoryImages'
import { asset } from '@/lib/asset'

type Category = { id: string; name: string; slug: string; icon: string }

const navItems = [
  { href: '/', label: 'トップ', img: '/home.jpeg' },
  { href: '/ranking', label: '人気ランキング', img: '/crown.jpeg' },
  { href: '/new', label: '新着ゲーム', img: '/clock.png' },
  { href: '/comments', label: 'コメント新着', img: '/comment.png' },
  { href: '/board-games', label: 'ボードゲーム投票', img: '/IMG_3274.PNG' },
  { href: '/favorites', label: 'お気に入り', img: '/star.jpeg' },
]

const notices = [
  '・新機能「お気に入り登録」を追加しました！',
  '・ランキングの集計方法を調整しました',
  '・不適切な投稿は運営により削除されます',
]

export default function Sidebar({ categories, onNavigate }: { categories: Category[]; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="w-52 h-full overflow-y-auto bg-white border-r border-gray-200 py-4">
      <nav className="px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(item.img)} alt={item.label} className="w-5 h-5 rounded object-cover" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 px-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">カテゴリ</div>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            onClick={onNavigate}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
              pathname === `/category/${cat.slug}`
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {categoryImages[cat.slug] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(categoryImages[cat.slug])} alt={cat.name} className="w-5 h-5 rounded object-cover" />
            ) : (
              <span>{cat.icon}</span>
            )}
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-4 mx-3 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-semibold text-gray-500 mb-2">お知らせ</div>
        {notices.map((n, i) => (
          <p key={i} className="text-xs text-gray-600 mb-1 leading-relaxed">{n}</p>
        ))}
      </div>
    </aside>
  )
}
