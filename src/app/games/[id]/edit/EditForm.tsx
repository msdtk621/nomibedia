'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { updateGame } from '@/app/actions/game'
import { categoryImages } from '@/lib/categoryImages'
import { asset } from '@/lib/asset'
import { type Game } from '@/lib/types'
import RuleSectionEditor, { createRuleSection, type RuleSection } from '@/components/RuleSectionEditor'
import { compressImage, setFileInput } from '@/lib/compressImage'
import { SubmitButton, FormPendingOverlay } from '@/components/SubmitButton'

type Category = { id: string; slug: string; icon: string; name: string }

const PLAYER_COUNTS = ['2人', '3人', '4人', '5人', '6人', '7人以上']
const GAME_FLOWS = [
  '周り順を決める',
  'みんなで一緒に',
  'パンパンの手拍子リズム',
  '手拍子なしでどんどん回る',
  '指定された人に順番が飛ぶ',
]

const toggleArray = <T,>(arr: T[], val: T): T[] =>
  arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

export default function EditForm({ game, categories }: { game: Game; categories: Category[] }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const authorId = game.author_id as string
  const existingTags = (game.tags as Array<{ name: string }> | null)?.map(t => t.name) ?? []
  const existingCategoryIds = (game.category_ids as string[] | null) ?? (game.category_id ? [game.category_id as string] : [])

  // 既存のルールステップを編集用の形式に変換
  const initialSections: RuleSection[] = (() => {
    const existing = game.rule_sections as Array<{ id?: string; text?: string; mediaType?: string; emojiCanvas?: RuleSection['emojiCanvas']; imageUrl?: string | null }> | null
    if (existing && existing.length > 0) {
      return existing.map(s => ({
        id: s.id ?? Math.random().toString(36).slice(2),
        text: s.text ?? '',
        mediaType: (s.mediaType as RuleSection['mediaType']) ?? 'none',
        imageFile: null,
        imagePreview: s.imageUrl ?? null,
        imageUrl: s.imageUrl ?? null,
        emojiCanvas: s.emojiCanvas ?? [],
      }))
    }
    // 旧形式（rulesテキストのみ）のフォールバック
    return [{ ...createRuleSection(), text: (game.rules as string) ?? '' }]
  })()

  const [title, setTitle] = useState(game.title as string)
  const [description, setDescription] = useState(game.description as string)
  const [ruleSections, setRuleSections] = useState<RuleSection[]>(initialSections)
  const [referenceUrl, setReferenceUrl] = useState((game.reference_url as string | null) ?? '')
  const [tips, setTips] = useState((game.tips as string | null) ?? '')
  const [loseCondition, setLoseCondition] = useState((game.lose_condition as string | null) ?? '')
  const [playerCounts, setPlayerCounts] = useState<string[]>((game.player_count as string[] | null) ?? [])
  const [drinkLevel, setDrinkLevel] = useState((game.drink_level as number) ?? 1)
  const [gameFlows, setGameFlows] = useState<string[]>((game.game_flow as string[] | null) ?? [])
  const [categoryIds, setCategoryIds] = useState<string[]>(existingCategoryIds)
  const [tags, setTags] = useState<string[]>(existingTags)
  const [tagInput, setTagInput] = useState('')
  // トップ画像
  const [imagePreview, setImagePreview] = useState<string | null>((game.thumbnail_url as string | null) ?? null)
  const [removeThumbnail, setRemoveThumbnail] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const input = e.target
    const compressed = await compressImage(file)
    setFileInput(input, compressed)
    setRemoveThumbnail(false)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(compressed)
  }

  useEffect(() => {
    const myIds = JSON.parse(localStorage.getItem('nomipedia_my_author_ids') || '[]')
    if (myIds.includes(authorId)) {
      setAuthorized(true)
    } else {
      setAuthorized(false)
    }
  }, [authorId])

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  if (authorized === null) return null
  if (!authorized) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-16 text-gray-500">
        <p>このゲームを編集する権限がありません。</p>
        <Link href={`/games/${game.id as string}`} className="mt-4 inline-block text-blue-600 hover:underline">ゲームページに戻る</Link>
      </div>
    )
  }

  const action = updateGame.bind(null, game.id as string, authorId)

  return (
    <div className="max-w-2xl mx-auto p-3 md:p-6">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        <span>›</span>
        <Link href={`/games/${game.id as string}`} className="hover:text-blue-600">{game.title as string}</Link>
        <span>›</span>
        <span className="text-gray-900">編集</span>
      </nav>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">ゲームを編集する</h1>

        <form action={action} className="space-y-6">
          <input type="hidden" name="player_count" value={JSON.stringify(playerCounts)} />
          <input type="hidden" name="game_flow" value={JSON.stringify(gameFlows)} />
          <input type="hidden" name="tags" value={tags.join(',')} />
          <input type="hidden" name="drink_level" value={drinkLevel} />
          <input type="hidden" name="category_ids" value={JSON.stringify(categoryIds)} />
          <input type="hidden" name="rule_sections" value={JSON.stringify(ruleSections.map(s => ({
            id: s.id,
            text: s.text,
            mediaType: s.mediaType,
            emojiCanvas: s.emojiCanvas,
            imageUrl: s.imageUrl ?? null,
          })))} />
          <input type="hidden" name="rules" value={ruleSections.map(s => s.text).filter(Boolean).join('\n\n')} />
          <input type="hidden" name="remove_thumbnail" value={removeThumbnail ? '1' : ''} />

          <section>
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">1. 基本情報</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ゲーム名 <span className="text-red-500">*</span></label>
                <input
                  type="text" name="title" maxLength={50} required
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="text-xs text-gray-400 text-right mt-1">{title.length}/50</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => {
                    const img = categoryImages[c.slug]
                    const selected = categoryIds.includes(c.id)
                    return (
                      <button
                        key={c.id} type="button"
                        onClick={() => setCategoryIds(prev => toggleArray(prev, c.id))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {img ? <img src={asset(img)} alt={c.name} className="w-4 h-4 rounded object-cover" /> : <span>{c.icon}</span>}
                        {c.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">トップ画像（任意）</label>
                <p className="text-xs text-gray-400 mb-2">設定しない場合はカテゴリのイラストが表示されます</p>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-40">
                      <Image src={imagePreview} alt="プレビュー" fill className="object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImagePreview(null)
                          setRemoveThumbnail(true)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                      >×</button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-sm text-gray-500">クリックして画像を選択</p>
                      <p className="text-xs text-gray-400 mt-1">JPG・PNG・GIF・WebP</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">人数（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {PLAYER_COUNTS.map(p => (
                    <button
                      key={p} type="button"
                      onClick={() => setPlayerCounts(prev => toggleArray(prev, p))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        playerCounts.includes(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">飲みレベル</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setDrinkLevel(n)} className={`transition-opacity ${n <= drinkLevel ? 'opacity-100' : 'opacity-25'}`}>
                      <img src={asset("/beer.jpeg")} alt="ビール" className="w-8 h-8 rounded object-cover" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {['', '軽め', 'やや軽め', '普通', 'やや多め', 'がっつり'][drinkLevel]}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text" value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="タグを入力"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 border border-gray-300">追加</button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                        #{t}
                        <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">2. ゲームの説明</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ゲームの概要 <span className="text-red-500">*</span></label>
                <textarea
                  name="description" required maxLength={200} rows={3}
                  value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="text-xs text-gray-400 text-right mt-1">{description.length}/200</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ゲーム進行（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {GAME_FLOWS.map(f => (
                    <button
                      key={f} type="button"
                      onClick={() => setGameFlows(prev => toggleArray(prev, f))}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        gameFlows.includes(f) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">必要なもの</label>
                <input
                  type="text" name="required_items" maxLength={100}
                  defaultValue={(game.required_items as string | null) ?? ''}
                  placeholder="例：サイコロ、紙、ペンなど"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">3. 遊び方・ルール</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">遊び方・ルール <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-400 mb-3">ステップごとに分けて説明できます。各ステップに画像や絵文字で状況説明を追加できます。</p>
                <RuleSectionEditor sections={ruleSections} onChange={setRuleSections} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">負け条件</label>
                <textarea
                  name="lose_condition" maxLength={300} rows={2}
                  value={loseCondition} onChange={e => setLoseCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ポイント・コツ（任意）</label>
                <textarea
                  name="tips" maxLength={300} rows={3}
                  value={tips} onChange={e => setTips(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">参考動画URL（任意）</label>
                <input
                  type="url" name="reference_url" maxLength={500}
                  value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)}
                  placeholder="例：https://www.youtube.com/watch?v=..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <Link href={`/games/${game.id as string}`} className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center">
              キャンセル
            </Link>
            <SubmitButton idleLabel="保存する" pendingLabel="保存中…" className="flex-1" />
          </div>
          <FormPendingOverlay label="保存中…" />
        </form>
      </div>
    </div>
  )
}
