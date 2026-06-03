'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function voteBoardGame(boardGameId: string, voterId: string) {
  const supabase = await createServerSupabaseClient()

  // すでに投票済みかチェック
  const { data: existing } = await supabase
    .from('board_game_votes')
    .select('id')
    .eq('board_game_id', boardGameId)
    .eq('voter_id', voterId)
    .single()

  if (existing) {
    // 取り消し
    await supabase.from('board_game_votes').delete().eq('id', existing.id)
    await supabase.rpc('decrement_board_game_vote', { game_id: boardGameId })
    return { voted: false }
  } else {
    // 投票
    await supabase.from('board_game_votes').insert({ board_game_id: boardGameId, voter_id: voterId })
    await supabase.rpc('increment_board_game_vote', { game_id: boardGameId })
    return { voted: true }
  }
}

export async function getBoardGames() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('board_games')
    .select('*')
    .order('vote_count', { ascending: false })
  return data ?? []
}
