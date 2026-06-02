import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const rankIcons = ['👑', '🥈', '🥉', '4', '5']

async function getTopGames() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('games')
    .select('id, title, like_count, comment_count, category:categories(name, icon, slug)')
    .order('like_count', { ascending: false })
    .limit(5)
  return data ?? []
}

async function getPopularTags() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('tags').select('name').limit(10)
  return (data ?? []).map(t => t.name)
}

export default async function RankingSidebar() {
  const [ranked, tags] = await Promise.all([getTopGames(), getPopularTags()])
  const fallbackTags = ['盛り上がる', '簡単', '大人数向け', '罰ゲーム', 'カラオケ', 'サイコロ']
  const displayTags = tags.length > 0 ? tags : fallbackTags

  return (
    <aside className="w-64 shrink-0">
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span>👑</span>
          <h3 className="font-bold text-gray-900">人気ランキング</h3>
        </div>

        {ranked.length === 0 ? (
          <p className="text-xs text-gray-400 py-2">まだゲームがありません</p>
        ) : (
          <div className="space-y-3">
            {ranked.map((game, i) => {
              const cat = game.category as { name: string; icon: string; slug: string } | null
              return (
                <Link key={game.id} href={`/games/${game.id}`} className="flex gap-2 hover:bg-gray-50 rounded-lg p-1 -m-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-lg">
                    {cat?.icon ?? '🎮'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-blue-600 truncate">{cat?.name}</div>
                    <div className="text-sm font-medium text-gray-900 truncate">{game.title}</div>
                    <div className="text-xs text-gray-500">⭐{game.like_count} 💬{game.comment_count}</div>
                  </div>
                  <div className="text-lg shrink-0">{rankIcons[i]}</div>
                </Link>
              )
            })}
          </div>
        )}

        <Link href="/ranking" className="block text-center text-sm text-blue-600 mt-3 hover:underline">
          もっと見る →
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-bold text-gray-900 mb-3">人気のタグ</h3>
        <div className="flex flex-wrap gap-2">
          {displayTags.map(tag => (
            <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
