'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function postComment(gameId: string, authorName: string, content: string) {
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
  })

  await supabase.from('games').update({ comment_count: number }).eq('id', gameId)

  revalidatePath(`/games/${gameId}`)
}
