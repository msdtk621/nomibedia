'use server'

import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

function verify(key: string) {
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey || key !== adminKey) throw new Error('権限がありません')
}

// 通報を消す（対応済みにする）
export async function dismissReport(reportId: string, key: string) {
  verify(key)
  const admin = createAdminSupabaseClient()
  await admin.from('reports').delete().eq('id', reportId)
  revalidatePath('/admin/reports')
}

// 通報された投稿を削除する（関連データも一緒に削除）
export async function deleteGameAsAdmin(gameId: string, key: string) {
  verify(key)
  const admin = createAdminSupabaseClient()
  // 依存データを先に削除（外部キーエラー防止）
  await admin.from('reports').delete().eq('game_id', gameId)
  await admin.from('comments').delete().eq('game_id', gameId)
  await admin.from('game_tags').delete().eq('game_id', gameId)
  await admin.from('likes').delete().eq('game_id', gameId)
  await admin.from('games').delete().eq('id', gameId)
  revalidatePath('/admin/reports')
}
