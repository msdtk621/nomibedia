'use client'

import { useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { postGame } from '@/app/actions/game'
import { categoryImages } from '@/lib/categoryImages'
import RuleSectionEditor, { createRuleSection, type RuleSection } from '@/components/RuleSectionEditor'
import { asset } from '@/lib/asset'
import { compressImage, setFileInput } from '@/lib/compressImage'

type Category = { id: string; slug: string; icon: string; name: string }

const PLAYER_COUNTS = ['2人', '3人', '4人', '5人', '6人', '7人以上']
const DEFAULT_TAGS = ['頭脳系', '運', '瞬発力', '簡単', '難しい', '大人数', '少人数']
const GAME_FLOWS = [
  '周り順を決める',
  'みんなで一緒に',
  'パンパンの手拍子リズム',
  '手拍子なしでどんどん回る',
  '指定された人に順番が飛ぶ',
]

function generateAuthorId() {
  return Math.random().toString(36).slice(2, 10)
}

// 送信中はボタンを無効化して二重投稿を防ぐ
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? '投稿中…' : '投稿する'}
    </button>
  )
}

export default function PostForm({ categories }: { categories: Category[] }) {
  const [authorId] = useState(() => generateAuthorId())
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ruleSections, setRuleSections] = useState<RuleSection[]>([createRuleSection()])
  const [tips, setTips] = useState('')
  const [loseCondition, setLoseCondition] = useState('')
  const [playerCounts, setPlayerCounts] = useState<string[]>([])
  const [drinkLevel, setDrinkLevel] = useState(1)
  const [gameFlows, setGameFlows] = useState<string[]>([])
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const input = e.target
    // 大きな写真は自動で縮小・圧縮して送信用に書き戻す
    const compressed = await compressImage(file)
    setFileInput(input, compressed)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(compressed)
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        <span>›</span>
        <span className="text-gray-900">投稿する</span>
      </nav>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">ゲームを投稿する</h1>
        <p className="text-sm text-gray-500 mb-6">あなたの知っている楽しいゲームをみんなにシェアしましょう！</p>

        <form
          action={postGame}
          onSubmit={() => {
            const ids = JSON.parse(localStorage.getItem('nomipedia_my_author_ids') || '[]')
            if (!ids.includes(authorId)) {
              localStorage.setItem('nomipedia_my_author_ids', JSON.stringify([...ids, authorId]))
            }
          }}
          className="space-y-6"
        >
          <input type="hidden" name="author_id" value={authorId} />
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
          })))} />

          {/* 1. 基本情報 */}
          <section>
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">1. 基本情報</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ゲーム名 <span className="text-red-500">*</span></label>
                <input
                  type="text" name="title" maxLength={50} required
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="ゲーム名を入力してください"
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
                        {img
                          ? <img src={asset(img)} alt={c.name} className="w-4 h-4 rounded object-cover" />
                          : <span>{c.icon}</span>
                        }
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
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                      >×</button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-sm text-gray-500">クリックして画像を選択</p>
                      <p className="text-xs text-gray-400 mt-1">JPG・PNG・GIF・WebP / 5MB以下</p>
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
                        playerCounts.includes(p)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
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
                    <button
                      key={n} type="button"
                      onClick={() => setDrinkLevel(n)}
                      className={`transition-opacity ${n <= drinkLevel ? 'opacity-100' : 'opacity-25'}`}
                    >
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
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="タグを入力"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button" onClick={addTag}
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 border border-gray-300"
                  >
                    追加
                  </button>
                </div>
                <div className="text-xs text-gray-500 mb-2">よく使うタグ：</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {DEFAULT_TAGS.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => !tags.includes(t) && tags.length < 10 && setTags(prev => [...prev, t])}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        tags.includes(t)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
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

          {/* 2. ゲームの説明 */}
          <section>
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">2. ゲームの説明</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ゲームの概要 <span className="text-red-500">*</span></label>
                <textarea
                  name="description" required maxLength={200} rows={3}
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="このゲームがどんなゲームか、簡単に説明してください"
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
                        gameFlows.includes(f)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
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
                  placeholder="例：サイコロ、紙、ペンなど"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* 3. ルール */}
          <section>
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">3. 遊び方・ルール</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">遊び方・ルール <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-400 mb-3">ステップごとに分けて説明できます。各ステップに画像や絵文字で状況説明を追加できます。</p>
                <RuleSectionEditor sections={ruleSections} onChange={setRuleSections} />
                {/* 後方互換: 旧rulesフィールドも送信 */}
                <input type="hidden" name="rules" value={ruleSections.map(s => s.text).filter(Boolean).join('\n\n')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">負け条件</label>
                <textarea
                  name="lose_condition" maxLength={300} rows={2}
                  value={loseCondition} onChange={e => setLoseCondition(e.target.value)}
                  placeholder="例：5回間違えた人が負け、最後まで残った人が負けなど"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ポイント・コツ（任意）</label>
                <textarea
                  name="tips" maxLength={300} rows={3}
                  value={tips} onChange={e => setTips(e.target.value)}
                  placeholder="より楽しむためのポイントやコツがあれば教えてください"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">参考動画URL（任意）</label>
                <input
                  type="url" name="reference_url" maxLength={500}
                  placeholder="例：https://www.youtube.com/watch?v=..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">YouTubeなどの参考動画リンクを貼れます</p>
              </div>
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <SubmitButton />
          </div>
          <p className="text-xs text-gray-400 text-center">* は必須項目です</p>
        </form>
      </div>
    </div>
  )
}
