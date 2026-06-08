import ClaimClient from './ClaimClient'

export const metadata = { title: '運営投稿の編集権限 | ノミベディア' }

export default async function AdminClaimPage({
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

  return (
    <div className="max-w-md mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">運営投稿の編集権限</h1>
      <ClaimClient />
    </div>
  )
}
