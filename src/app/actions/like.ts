'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(gameId: string, userId: string): Promise<{ liked: boolean; count: number }> {
  const supabase = await createServerSupabaseClient()

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('game_id', gameId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    await supabase.from('likes').delete().eq('game_id', gameId).eq('user_id', userId)
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('game_id', gameId)
    const newCount = count ?? 0
    await supabase.from('games').update({ like_count: newCount }).eq('id', gameId)
    revalidatePath(`/games/${gameId}`)
    return { liked: false, count: newCount }
  } else {
    await supabase.from('likes').insert({ game_id: gameId, user_id: userId })
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('game_id', gameId)
    const newCount = count ?? 0
    await supabase.from('games').update({ like_count: newCount }).eq('id', gameId)
    revalidatePath(`/games/${gameId}`)
    return { liked: true, count: newCount }
  }
}
