import { createAdminSupabaseClient } from '@/lib/supabase-server'
import AdminDashboard from './AdminDashboard'

export const revalidate = 0
export const metadata = { title: '管理ダッシュボード | ノミベディア' }

export default async function AdminHomePage({
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
  const [reportsRes, requestsRes, noticesRes] = await Promise.all([
    supabase.from('reports').select('created_at').order('created_at', { ascending: false }),
    supabase.from('board_game_requests').select('created_at').order('created_at', { ascending: false }),
    supabase.from('notices').select('id'),
  ])

  const reportTimes = (reportsRes.data ?? []).map((r: { created_at: string }) => r.created_at)
  const requestTimes = (requestsRes.data ?? []).map((r: { created_at: string }) => r.created_at)
  const noticeCount = (noticesRes.data ?? []).length

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">管理ダッシュボード</h1>
        <p className="text-gray-500 text-sm">新着があると 🔴 バッジでお知らせします</p>
      </div>
      <AdminDashboard
        adminKey={key}
        reportTimes={reportTimes}
        requestTimes={requestTimes}
        noticeCount={noticeCount}
      />
    </div>
  )
}
