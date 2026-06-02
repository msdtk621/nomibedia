'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

type Category = { id: string; name: string; slug: string; icon: string }

export default function MobileLayout({ categories, children }: { categories: Category[]; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // ルート変更時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false)
  }, [])

  return (
    <>
      <Header onMenuToggle={() => setMenuOpen(v => !v)} />

      {/* モバイルオーバーレイ */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* サイドバー：PCは常に表示、モバイルはスライド */}
        <div className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-transform duration-200
          md:translate-x-0 md:block
          ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar categories={categories} onNavigate={() => setMenuOpen(false)} />
        </div>

        <main className="md:ml-52 flex-1 min-h-screen w-full">
          {children}
        </main>
      </div>
    </>
  )
}
