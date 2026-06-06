'use server'

import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(gameId: string, userId: string): Promise<{ liked: boolean; count: number }> {
  // いいねの登録・解除と集計はRLSを跨ぐため管理者権限で行う
  const admin = createAdminSupabaseClient()

  const { data: existing } = await admin
    .from('likes')
    .select('id')
    .eq('game_id', gameId)
    .eq('user_id', userId)
    .maybeSingle()

  const liked = !existing
  if (existing) {
    await admin.from('likes').delete().eq('game_id', gameId).eq('user_id', userId)
  } else {
    await admin.from('likes').insert({ game_id: gameId, user_id: userId })
  }

  const { count } = await admin.from('likes').select('*', { count: 'exact', head: true }).eq('game_id', gameId)
  const newCount = count ?? 0
  await admin.from('games').update({ like_count: newCount }).eq('id', gameId)
  revalidatePath(`/games/${gameId}`)
  return { liked, count: newCount }
}
