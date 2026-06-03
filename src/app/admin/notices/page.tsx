import { createAdminSupabaseClient } from '@/lib/supabase-server'
import NoticesAdmin from './NoticesAdmin'

export const revalidate = 0
export const metadata = { title: 'お知らせ管理 | ノミベディア' }

export default async function AdminNoticesPage({
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
  const { data } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false })

  const notices = (data ?? []) as Array<{ id: string; content: string; created_at: string }>

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">お知らせ管理</h1>
        <p className="text-gray-500 text-sm">サイドバーに表示されるお知らせを編集できます</p>
      </div>
      <NoticesAdmin notices={notices} adminKey={key} />
    </div>
  )
}
