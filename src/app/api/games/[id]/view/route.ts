import { createAdminSupabaseClient } from '@/lib/supabase-server'

// 閲覧数の加算用エンドポイント。ゲーム詳細ページがISRキャッシュされても閲覧数を
// 正確に数えるため、クライアント(ViewCounter)から1セッション1回だけ叩く。
// JSを実行しないクローラーでは発火しないため、クローラーによる水増しも起きない。
// 加算はRLSを跨ぐため管理者権限で行う。
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const admin = createAdminSupabaseClient()
    const { data } = await admin.from('games').select('view_count').eq('id', id).single()
    if (data) {
      await admin
        .from('games')
        .update({ view_count: (data.view_count ?? 0) + 1 })
        .eq('id', id)
    }
  } catch {
    // 計測の失敗はページ表示に影響させない
  }
  return new Response(null, { status: 204 })
}
