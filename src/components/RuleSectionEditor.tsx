'use client'

import { useRef } from 'react'
import Image from 'next/image'
import EmojiPicker from './EmojiPicker'

export type EmojiItem = { id: string; emoji: string; x: number; y: number; size: number }

export type RuleSection = {
  id: string
  text: string
  mediaType: 'none' | 'image' | 'emoji'
  imageFile?: File | null
  imagePreview?: string | null
  emojiCanvas: EmojiItem[]
}

export function createRuleSection(): RuleSection {
  return {
    id: Math.random().toString(36).slice(2),
    text: '',
    mediaType: 'none',
    imageFile: null,
    imagePreview: null,
    emojiCanvas: [],
  }
}

export default function RuleSectionEditor({
  sections,
  onChange,
}: {
  sections: RuleSection[]
  onChange: (sections: RuleSection[]) => void
}) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const update = (id: string, patch: Partial<RuleSection>) => {
    onChange(sections.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  const remove = (id: string) => {
    onChange(sections.filter(s => s.id !== id))
  }

  const handleImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('画像は5MB以下にしてください'); return }
    const reader = new FileReader()
    reader.onload = ev => update(id, { imageFile: file, imagePreview: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {sections.map((section, i) => (
        <div key={section.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(section.id)}
              className="ml-auto text-gray-300 hover:text-red-400 text-xs px-2"
            >
              削除
            </button>
          </div>

          <textarea
            rows={2}
            value={section.text}
            onChange={e => update(section.id, { text: e.target.value })}
            placeholder="このステップの説明..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none bg-white"
          />

          {/* メディア選択 */}
          {section.mediaType === 'none' && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => update(section.id, { mediaType: 'image' })}
                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 bg-white"
              >
                📷 画像追加
              </button>
              <button
                type="button"
                onClick={() => update(section.id, { mediaType: 'emoji' })}
                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 bg-white"
              >
                😊 絵文字で説明
              </button>
            </div>
          )}

          {section.mediaType === 'image' && (
            <div className="mt-2">
              {section.imagePreview ? (
                <div className="relative w-full h-32">
                  <Image src={section.imagePreview} alt="プレビュー" fill className="object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => update(section.id, { imageFile: null, imagePreview: null, mediaType: 'none' })}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >×</button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-400"
                  onClick={() => fileRefs.current[section.id]?.click()}
                >
                  <p className="text-xs text-gray-500">クリックして画像を選択</p>
                </div>
              )}
              <input
                ref={el => { fileRefs.current[section.id] = el }}
                type="file"
                name={`rule_image_${section.id}`}
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={e => handleImage(section.id, e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => update(section.id, { mediaType: 'none', imageFile: null, imagePreview: null })}
                className="text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                キャンセル
              </button>
            </div>
          )}

          {section.mediaType === 'emoji' && (
            <div className="mt-2">
              <EmojiPicker
                items={section.emojiCanvas}
                onChange={items => update(section.id, { emojiCanvas: items })}
              />
              <button
                type="button"
                onClick={() => update(section.id, { mediaType: 'none', emojiCanvas: [] })}
                className="text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...sections, createRuleSection()])}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + ステップを追加
      </button>
    </div>
  )
}
