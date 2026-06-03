import { createAdminSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const revalidate = 0
export const metadata = { title: '通報一覧（管理） | ノミベディア' }

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const { key } = await searchParams
  const adminKey = process.env.ADMIN_KEY

  // 合言葉が一致しないとアクセス不可
  if (!adminKey || key !== adminKey) {
    return (
      <div className="max-w-md mx-auto p-6 text-center py-20 text-gray-500">
        <p className="text-lg font-bold text-gray-700 mb-2">アクセス権限がありません</p>
        <p className="text-sm">このページは管理者専用です。</p>
      </div>
    )
  }

  const supabase = createAdminSupabaseClient()
  const { data: reports } = await supabase
    .from('reports')
    .select('*, game:games(id, title)')
    .order('created_at', { ascending: false })

  const list = (reports ?? []) as Array<{
    id: string
    reason: string
    created_at: string
    game: { id: string; title: string } | null
  }>

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">通報一覧</h1>
        <p className="text-gray-500 text-sm">ユーザーから報告された投稿（{list.length}件）</p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>通報はまだありません 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium shrink-0 mt-0.5">
                {r.reason}
              </span>
              <div className="flex-1 min-w-0">
                {r.game ? (
                  <Link href={`/games/${r.game.id}`} className="font-medium text-blue-600 hover:underline break-all">
                    {r.game.title}
                  </Link>
                ) : (
                  <span className="text-gray-400">（削除済みの投稿）</span>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(r.created_at).toLocaleString('ja-JP')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
