'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendAdminPush } from '@/lib/push'

export type BoardGame = {
  id: string
  name: string
  description: string | null
  vote_count: number
  image_url: string | null
  affiliate_amazon: string | null
  affiliate_rakuten: string | null
  created_at: string
}

function verifyAdmin(key: string) {
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey || key !== adminKey) throw new Error('権限がありません')
}

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
  return (data ?? []) as BoardGame[]
}

export async function getBoardGame(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('board_games').select('*').eq('id', id).single()
  return (data as BoardGame | null) ?? null
}

export async function getBoardGameComments(boardGameId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('board_game_comments')
    .select('*')
    .eq('board_game_id', boardGameId)
    .order('number', { ascending: true })
  return data ?? []
}

export async function addBoardGameComment(boardGameId: string, authorName: string, content: string, replyTo?: number | null) {
  const supabase = await createServerSupabaseClient()
  const { count } = await supabase
    .from('board_game_comments')
    .select('*', { count: 'exact', head: true })
    .eq('board_game_id', boardGameId)
  const number = (count ?? 0) + 1
  const authorId = Math.random().toString(36).slice(2, 10).toUpperCase()
  await supabase.from('board_game_comments').insert({
    board_game_id: boardGameId,
    author_name: authorName || '名無しさん@〜ぽん',
    author_id: authorId,
    content,
    number,
    reply_to: replyTo ?? null,
  })
  revalidatePath(`/board-games/${boardGameId}`)
}

// 一般ユーザーからのボドゲ追加リクエスト
export async function submitBoardGameRequest(name: string, comment: string) {
  if (!name.trim()) return
  // board_game_requests は anon の INSERT が RLS でブロックされるため管理者権限で保存
  const admin = createAdminSupabaseClient()
  const reqName = name.trim().slice(0, 100)
  await admin.from('board_game_requests').insert({
    name: reqName,
    comment: comment.trim().slice(0, 300) || null,
  })
  await sendAdminPush('新しいボドゲリクエスト', `「${reqName}」のリクエストが届きました`, '/admin')
}

// 管理者：ボドゲ追加
export async function addBoardGame(key: string, input: {
  name: string; description: string; imageUrl: string; amazon: string; rakuten: string
}) {
  verifyAdmin(key)
  const admin = createAdminSupabaseClient()
  await admin.from('board_games').insert({
    name: input.name.slice(0, 100),
    description: input.description.slice(0, 500) || null,
    image_url: input.imageUrl || null,
    affiliate_amazon: input.amazon || null,
    affiliate_rakuten: input.rakuten || null,
    vote_count: 0,
  })
  revalidatePath('/board-games')
  revalidatePath('/admin/board-games')
}

// 管理者：ボドゲ削除
export async function deleteBoardGame(key: string, id: string) {
  verifyAdmin(key)
  const admin = createAdminSupabaseClient()
  await admin.from('board_game_votes').delete().eq('board_game_id', id)
  await admin.from('board_game_comments').delete().eq('board_game_id', id)
  await admin.from('board_games').delete().eq('id', id)
  revalidatePath('/board-games')
  revalidatePath('/admin/board-games')
}

// 管理者：リクエスト削除（対応済み）
export async function deleteBoardGameRequest(key: string, id: string) {
  verifyAdmin(key)
  const admin = createAdminSupabaseClient()
  await admin.from('board_game_requests').delete().eq('id', id)
  revalidatePath('/admin/board-games')
}
