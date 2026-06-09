'use server'

import { createAdminSupabaseClient } from '@/lib/supabase-server'

export async function reportGame(gameId: string, reason: string) {
  // reports テーブルは anon の INSERT が RLS でブロックされるため管理者権限で保存する
  const admin = createAdminSupabaseClient()
  await admin.from('reports').insert({ game_id: gameId, reason })
}
