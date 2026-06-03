'use client'

import { useState, useRef, useCallback } from 'react'

type EmojiItem = { id: string; emoji: string; x: number; y: number; size: number }

const EMOJI_CATEGORIES: Record<string, string[]> = {
  'にこにこ顔': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','🫠','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤗','🤭','🫢','🤫','😌','😎','🥸','🤓','🧐'],
  'こまり顔': ['🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😔','😪','🤤','😴','🥱','😮‍💨','😕','🫤','🙁','☹️','😟','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫'],
  'びっくり・病気': ['🤯','😳','🥵','🥶','😶‍🌫️','😵','😵‍💫','🫨','🤢','🤮','🤧','😷','🤒','🤕','🥴','😠','😡','🤬','😈','👿','💀','☠️','👻','💩','🤡','👹','👺','🥳','🥹','😤','🫣','🙈','🙉','🙊'],
  '手・指': ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🙏','🤝','💅','🤳'],
  '体の部位': ['💪','🦾','🦵','🦿','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','💋','🩸'],
  '記号・矢印': ['➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','🔄','↩️','↪️','✅','❌','⭕','❓','❗','🔢','🔀','⏩','⏭️','▶️','⏸️','🏁','🎯','📍','💬','💭','🗯️','🔊','🔇','✨','💥','🌟','⚡','🔥','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'],
  '飲み・ゲーム': ['🍺','🍻','🥂','🍷','🥃','🍾','🍶','🍹','🍸','🎲','🃏','🎮','🎯','🏆','🥇','🥈','🥉','🎉','🎊','🎰','♟️','🧩','🎭','🀄','🎴'],
  '動物・もの': ['🐱','🐶','🐸','🦊','🐼','🦁','🐻','🐨','🐯','🦄','🐙','🦋','🌸','🍀','⭐','🌈','🌙','☀️','❄️','🔑','💎','🎁','📱','💻','📷','🎵','🎶','💯','❤️','💔'],
}

export default function EmojiCanvas({
  items,
  onChange,
}: {
  items: EmojiItem[]
  onChange: (items: EmojiItem[]) => void
}) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0])
  const [dragId, setDragId] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState(36)
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const addEmoji = (emoji: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    onChange([...items, {
      id: Math.random().toString(36).slice(2),
      emoji,
      x: Math.random() * (rect.width - 60) + 10,
      y: Math.random() * (200 - 60) + 10,
      size: selectedSize,
    }])
  }

  const removeEmoji = (id: string) => onChange(items.filter(i => i.id !== id))

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const item = items.find(i => i.id === id)
    if (!item || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left - item.x, y: e.clientY - rect.top - item.y }
    setDragId(id)
  }, [items])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.current.x, rect.width - 40))
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.current.y, rect.height - 40))
    onChange(items.map(i => i.id === dragId ? { ...i, x, y } : i))
  }, [dragId, items, onChange])

  const onTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    const item = items.find(i => i.id === id)
    if (!item || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    dragOffset.current = { x: touch.clientX - rect.left - item.x, y: touch.clientY - rect.top - item.y }
    setDragId(id)
  }, [items])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragId || !canvasRef.current) return
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = Math.max(0, Math.min(touch.clientX - rect.left - dragOffset.current.x, rect.width - 40))
    const y = Math.max(0, Math.min(touch.clientY - rect.top - dragOffset.current.y, rect.height - 40))
    onChange(items.map(i => i.id === dragId ? { ...i, x, y } : i))
  }, [dragId, items, onChange])

  const stopDrag = () => setDragId(null)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden select-none">
      {/* キャンバス */}
      <div
        ref={canvasRef}
        className="relative w-full bg-gray-50 overflow-hidden"
        style={{ height: 220 }}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            下のパレットから絵文字を追加・ドラッグで配置
          </div>
        )}
        {items.map(item => (
          <div
            key={item.id}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ left: item.x, top: item.y, fontSize: item.size, lineHeight: 1 }}
            onMouseDown={e => onMouseDown(e, item.id)}
            onTouchStart={e => onTouchStart(e, item.id)}
            onTouchMove={onTouchMove}
            onTouchEnd={stopDrag}
            onDoubleClick={() => removeEmoji(item.id)}
            title="ダブルクリックで削除"
          >
            {item.emoji}
          </div>
        ))}
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="absolute top-1 right-1 text-xs text-gray-400 hover:text-red-400 bg-white rounded px-1"
          >
            全削除
          </button>
        )}
      </div>

      {/* サイズ・操作ヒント */}
      <div className="flex items-center gap-3 px-3 py-1.5 bg-white border-t border-gray-100 text-xs text-gray-500">
        <span>サイズ:</span>
        {[24, 36, 48, 64].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setSelectedSize(s)}
            className={`px-2 py-0.5 rounded ${selectedSize === s ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {s === 24 ? '小' : s === 36 ? '中' : s === 48 ? '大' : '特大'}
          </button>
        ))}
        <span className="ml-auto text-gray-400">ダブルタップで削除</span>
      </div>

      {/* カテゴリタブ */}
      <div className="flex overflow-x-auto bg-white border-t border-gray-100">
        {Object.keys(EMOJI_CATEGORIES).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap transition-colors shrink-0 ${
              activeCategory === cat ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 絵文字パレット */}
      <div className="p-2 flex flex-wrap gap-0.5 bg-white max-h-32 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory].map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => addEmoji(emoji)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            style={{ fontSize: 24 }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
