'use client'

import { useState } from 'react'

const EMOJI_CATEGORIES = {
  '人・動作': ['👆', '👇', '👈', '👉', '👋', '🤝', '👥', '🙋', '🙅', '🙆', '🤦', '🤷', '💪', '🫵', '👀', '🗣️', '🤫', '🤔'],
  '矢印・記号': ['➡️', '⬅️', '⬆️', '⬇️', '🔄', '↩️', '↪️', '✅', '❌', '⭕', '❓', '❗', '🔢', '🔀', '⏩', '⏭️'],
  '数字・順番': ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🔁', '🔂', '▶️', '⏸️', '🏁', '🎯', '📍'],
  '感情・状態': ['😄', '😂', '😱', '😤', '🤪', '😵', '🥴', '🤢', '😴', '🤩', '😎', '🥳', '😭', '🫣', '🙈'],
  '飲み・ゲーム': ['🍺', '🥂', '🎲', '🃏', '🎮', '🎯', '🏆', '🥇', '💀', '⚡', '🔥', '💥', '🎉', '🎊'],
}

export default function EmojiPicker({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (emojis: string[]) => void
}) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0])

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 選択済み絵文字の表示 */}
      <div className="p-3 bg-gray-50 min-h-[48px] flex flex-wrap gap-1 items-center">
        {selected.length === 0 ? (
          <span className="text-xs text-gray-400">絵文字をクリックして追加</span>
        ) : (
          <>
            {selected.map((e, i) => (
              <span
                key={i}
                onClick={() => onChange(selected.filter((_, idx) => idx !== i))}
                className="text-xl cursor-pointer hover:opacity-50 transition-opacity"
                title="クリックで削除"
              >
                {e}
              </span>
            ))}
            <button
              type="button"
              onClick={() => onChange([])}
              className="ml-auto text-xs text-gray-400 hover:text-red-400 px-2"
            >
              全削除
            </button>
          </>
        )}
      </div>

      {/* カテゴリタブ */}
      <div className="flex overflow-x-auto bg-white border-b border-gray-100">
        {Object.keys(EMOJI_CATEGORIES).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 絵文字パレット */}
      <div className="p-2 flex flex-wrap gap-1 bg-white max-h-28 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange([...selected, emoji])}
            className="text-xl p-1 rounded hover:bg-gray-100 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
