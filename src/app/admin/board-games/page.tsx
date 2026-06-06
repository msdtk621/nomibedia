import { createAdminSupabaseClient } from '@/lib/supabase-server'
import BoardGamesAdmin from './BoardGamesAdmin'

export const revalidate = 0
export const metadata = { title: 'ボードゲーム管理 | ノミベディア' }

export default async function AdminBoardGamesPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const { key } = await searchParams
  const adminKey = process.env.ADMIN_KEY

  if (!adminKey || key !== adminKey) {
    return (
      <div className="max-w-md mx-auto p-6 text-center py-20 text-gray-500">
        <p className="text-lg font-bold text-gray-700 mb-2">アクセス権限がありません</p>
        <p className="text-sm">このページは管理者専用です。</p>
      </div>
    )
  }

  const supabase = createAdminSupabaseClient()
  const [{ data: games }, { data: requests }] = await Promise.all([
    supabase.from('board_games').select('*').order('vote_count', { ascending: false }),
    supabase.from('board_game_requests').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ボードゲーム管理</h1>
        <p className="text-gray-500 text-sm">ボードゲームの追加・削除・リクエスト確認</p>
      </div>
      <BoardGamesAdmin
        games={(games ?? []) as never}
        requests={(requests ?? []) as never}
        adminKey={key}
      />
    </div>
  )
}
