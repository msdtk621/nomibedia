'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function postComment(gameId: string, authorName: string, content: string, replyTo?: number | null) {
  const supabase = await createServerSupabaseClient()

  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId)

  const number = (count ?? 0) + 1
  const authorId = Math.random().toString(36).slice(2, 10).toUpperCase()

  await supabase.from('comments').insert({
    game_id: gameId,
    author_name: authorName || '名無しさん@〜ぽん',
    author_id: authorId,
    content,
    number,
    reply_to: replyTo ?? null,
  })

  // コメント数の更新はRLSを跨ぐため管理者権限で行う
  await createAdminSupabaseClient().from('games').update({ comment_count: number }).eq('id', gameId)

  revalidatePath(`/games/${gameId}`)
}
