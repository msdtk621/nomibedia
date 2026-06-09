'use server'

import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { sendAdminPush } from '@/lib/push'

export async function reportGame(gameId: string, reason: string) {
  // reports テーブルは anon の INSERT が RLS でブロックされるため管理者権限で保存する
  const admin = createAdminSupabaseClient()
  await admin.from('reports').insert({ game_id: gameId, reason })
  await sendAdminPush('新しい通報', `通報が届きました（理由: ${reason}）`, '/admin')
}
