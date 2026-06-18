'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendAdminPush } from '@/lib/push'
import { searchRakutenProduct } from '@/lib/rakuten-api'

export type BoardGame = {
  id: string
  name: string
  description: string | null
  vote_count: number
  image_url: string | null
  affiliate_amazon: string | null
  affiliate_rakuten: string | null
  rakuten_item_name: string | null
  rakuten_price: number | null
  created_at: string
}

function verifyAdmin(key: string) {
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey || key !== adminKey) throw new Error('権限がありません')
}

export async function voteBoardGame(boardGameId: string, voterId: string) {
  // board_games の票数更新は anon が RLS でブロックされ、増減RPCも未定義のため
  // 管理者権限で投票を反映し、票数は実際の投票行数から再計算して保存する。
  const admin = createAdminSupabaseClient()

  // すでに投票済みかチェック
  const { data: existing } = await admin
    .from('board_game_votes')
    .select('id')
    .eq('board_game_id', boardGameId)
    .eq('voter_id', voterId)
    .maybeSingle()

  let voted: boolean
  if (existing) {
    await admin.from('board_game_votes').delete().eq('id', existing.id)
    voted = false
  } else {
    await admin.from('board_game_votes').insert({ board_game_id: boardGameId, voter_id: voterId })
    voted = true
  }

  // 実際の投票数を数えて vote_count に保存（ズレても自動で正しい値に修正される）
  const { count } = await admin
    .from('board_game_votes')
    .select('id', { count: 'exact', head: true })
    .eq('board_game_id', boardGameId)
  await admin.from('board_games').update({ vote_count: count ?? 0 }).eq('id', boardGameId)

  return { voted }
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

// 管理者：既存ボドゲのアフィリンクを更新（投票・コメントは保持）
export async function updateBoardGameAffiliate(key: string, id: string, input: { amazon: string; rakuten: string }) {
  verifyAdmin(key)
  const admin = createAdminSupabaseClient()
  await admin.from('board_games').update({
    affiliate_amazon: input.amazon.trim() || null,
    affiliate_rakuten: input.rakuten.trim() || null,
  }).eq('id', id)
  revalidatePath('/board-games')
  revalidatePath(`/board-games/${id}`)
  revalidatePath('/admin/board-games')
}

// 管理者：楽天APIで商品を検索し、トプ画(image_url)と楽天アフィリンクを自動設定
export async function fetchRakutenForBoardGame(key: string, id: string, keyword: string) {
  verifyAdmin(key)
  const product = await searchRakutenProduct(keyword)
  if (!product) return { ok: false as const, message: '楽天で商品が見つからないか、API設定が未完了です' }
  const admin = createAdminSupabaseClient()
  await admin.from('board_games').update({
    image_url: product.imageUrl || null,
    affiliate_rakuten: product.affiliateUrl || null,
    rakuten_item_name: product.itemName || null,
    rakuten_price: product.price || null,
  }).eq('id', id)
  revalidatePath('/board-games')
  revalidatePath(`/board-games/${id}`)
  revalidatePath('/admin/board-games')
  return { ok: true as const, itemName: product.itemName, price: product.price, shopName: product.shopName }
}

// 管理者：リクエスト削除（対応済み）
export async function deleteBoardGameRequest(key: string, id: string) {
  verifyAdmin(key)
  const admin = createAdminSupabaseClient()
  await admin.from('board_game_requests').delete().eq('id', id)
  revalidatePath('/admin/board-games')
}
