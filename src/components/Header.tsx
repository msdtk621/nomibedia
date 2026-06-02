'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center h-full px-4 gap-3">
        {/* ハンバーガー（モバイルのみ） */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="メニュー"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="ノミペディア" className="w-10 h-10 rounded-full object-cover" />
          <div className="hidden sm:block">
            <div className="text-lg font-bold text-gray-900 leading-tight">ノミペディア</div>
            <div className="text-xs text-gray-500 leading-tight">飲みゲーをみんなでシェアするサイト</div>
          </div>
          <div className="sm:hidden">
            <div className="text-lg font-bold text-gray-900">ノミペディア</div>
          </div>
        </Link>

        {/* 検索（PC） */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ゲームを検索（例：山手線ゲーム、トランプ…）"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* 検索ボタン（モバイル） */}
          <button
            onClick={() => setSearchOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link href="/post" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
            <span className="hidden sm:inline">ゲームを投稿する</span>
            <span className="sm:hidden">投稿</span>
          </Link>
        </div>
      </div>

      {/* モバイル検索バー */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white border-b border-gray-200">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text" autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ゲームを検索…"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  )
}
