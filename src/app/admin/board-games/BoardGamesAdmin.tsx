'use client'

import { useState, useTransition } from 'react'
import { addBoardGame, deleteBoardGame, deleteBoardGameRequest, updateBoardGameAffiliate, fetchRakutenForBoardGame } from '@/app/actions/boardgame'

type BoardGame = {
  id: string; name: string; description: string | null; vote_count: number
  image_url: string | null; affiliate_amazon: string | null; affiliate_rakuten: string | null
}
type Request = { id: string; name: string; comment: string | null; created_at: string }

export default function BoardGamesAdmin({
  games, requests, adminKey,
}: { games: BoardGame[]; requests: Request[]; adminKey: string }) {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', amazon: '', rakuten: '' })
  // 既存ボドゲのアフィリンク編集
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ amazon: '', rakuten: '' })
  // 楽天自動取得用のキーワードと結果メッセージ
  const [rakutenKeyword, setRakutenKeyword] = useState('')
  const [rakutenMsg, setRakutenMsg] = useState('')

  const startEdit = (g: BoardGame) => {
    setEditId(g.id)
    setEditForm({ amazon: g.affiliate_amazon ?? '', rakuten: g.affiliate_rakuten ?? '' })
    setRakutenKeyword(`${g.name} ボードゲーム`)
    setRakutenMsg('')
  }
  const handleUpdate = (id: string) => startTransition(async () => {
    await updateBoardGameAffiliate(adminKey, id, editForm)
    setEditId(null)
  })
  const handleFetchRakuten = (id: string) => startTransition(async () => {
    setRakutenMsg('取得中…')
    const r = await fetchRakutenForBoardGame(adminKey, id, rakutenKeyword)
    setRakutenMsg(r.ok ? `✅ 設定: ${r.itemName.slice(0, 40)}（¥${r.price} / ${r.shopName}）` : `⚠️ ${r.message}`)
    if (r.ok) setEditId(null)
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    startTransition(async () => {
      await addBoardGame(adminKey, form)
      setForm({ name: '', description: '', imageUrl: '', amazon: '', rakuten: '' })
    })
  }

  const handleDelete = (id: string) => startTransition(async () => { await deleteBoardGame(adminKey, id) })
  const handleDeleteReq = (id: string) => startTransition(async () => { await deleteBoardGameRequest(adminKey, id) })

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500'

  return (
    <div className="space-y-8">
      {/* 追加フォーム */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="font-bold text-gray-900 mb-3">ボードゲームを追加</h2>
        <div className="space-y-2">
          <input className={input} placeholder="名前（必須）" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <textarea className={`${input} resize-none`} rows={2} placeholder="説明" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className={input} placeholder="画像URL（任意）" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          <input className={input} placeholder="Amazonアフィリンク（任意）" value={form.amazon} onChange={e => setForm({ ...form, amazon: e.target.value })} />
          <input className={input} placeholder="楽天アフィリンク（任意）" value={form.rakuten} onChange={e => setForm({ ...form, rakuten: e.target.value })} />
          <div className="flex justify-end">
            <button onClick={handleAdd} disabled={!form.name.trim() || isPending}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
              追加
            </button>
          </div>
        </div>
      </div>

      {/* 一覧 */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">登録済み（{games.length}件）</h2>
        <div className="space-y-2">
          {games.map(g => (
            <div key={g.id} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded shrink-0 overflow-hidden flex items-center justify-center">
                  {g.image_url ? <img src={g.image_url} alt="" className="w-full h-full object-cover" /> : <span>🎲</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{g.name} <span className="text-xs text-gray-400">👍{g.vote_count}</span></div>
                  <div className="text-xs text-gray-400">
                    {g.affiliate_amazon ? 'Amazon✓ ' : ''}{g.affiliate_rakuten ? '楽天✓' : ''}
                    {!g.affiliate_amazon && !g.affiliate_rakuten ? 'アフィ未設定（商品名で検索リンク）' : ''}
                  </div>
                </div>
                <button onClick={() => (editId === g.id ? setEditId(null) : startEdit(g))} disabled={isPending}
                  className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 shrink-0">
                  {editId === g.id ? '閉じる' : 'アフィ編集'}
                </button>
                <button onClick={() => handleDelete(g.id)} disabled={isPending}
                  className="text-xs text-red-500 border border-red-200 rounded px-2 py-1 hover:bg-red-50 shrink-0">削除</button>
              </div>

              {editId === g.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {/* 楽天から画像・リンクを自動取得 */}
                  <div className="bg-red-50 border border-red-100 rounded-lg p-2 space-y-2">
                    <div className="text-xs font-bold text-[#BF0000]">楽天から画像・リンクを自動取得</div>
                    <input className={input} placeholder="検索キーワード" value={rakutenKeyword}
                      onChange={e => setRakutenKeyword(e.target.value)} />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500 truncate">{rakutenMsg}</span>
                      <button onClick={() => handleFetchRakuten(g.id)} disabled={isPending || !rakutenKeyword.trim()}
                        className="px-3 py-1.5 bg-[#BF0000] text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 shrink-0">
                        {isPending ? '取得中…' : '🛒 楽天から取得'}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">トップ商品の画像をトプ画に、楽天リンクを商品ページ直リンクに設定します。</p>
                  </div>
                  <input className={input} placeholder="Amazonアフィリンク（空欄で検索リンクに戻る）"
                    value={editForm.amazon} onChange={e => setEditForm({ ...editForm, amazon: e.target.value })} />
                  <input className={input} placeholder="楽天アフィリンク（空欄で検索リンクに戻る）"
                    value={editForm.rakuten} onChange={e => setEditForm({ ...editForm, rakuten: e.target.value })} />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditId(null)} disabled={isPending}
                      className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">キャンセル</button>
                    <button onClick={() => handleUpdate(g.id)} disabled={isPending}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      {isPending ? '保存中…' : '保存'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* リクエスト */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">ユーザーからのリクエスト（{requests.length}件）</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-400">リクエストはまだありません</p>
        ) : (
          <div className="space-y-2">
            {requests.map(r => (
              <div key={r.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{r.name}</div>
                  {r.comment && <div className="text-sm text-gray-600 mt-0.5">{r.comment}</div>}
                  <div className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleString('ja-JP')}</div>
                </div>
                <button onClick={() => handleDeleteReq(r.id)} disabled={isPending}
                  className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 shrink-0">対応済み</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
