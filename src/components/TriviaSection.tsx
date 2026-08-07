import Link from 'next/link'
import TriviaPop from './TriviaPop'
import { type Trivia } from '@/lib/trivia'

/**
 * 投稿一覧の隙間に差し込む豆知識のかたまり。
 * 見出しを付けて投稿カードの流れから切り離す。
 * PC は横3列、スマホは横2列。縦積みにすると投稿が下に押されるため、
 * スマホでは3件目を出さずに2列で収める。
 */
export default function TriviaSection({ items }: { items: Trivia[] }) {
  if (items.length === 0) return null

  return (
    <section className="bg-amber-100/40 border border-amber-200 rounded-2xl p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-bold text-gray-900 whitespace-nowrap shrink-0">🍷 お酒のあれこれ</h2>
        {/* 補足はスマホだと見出しを押し出して折り返すので、広い画面でだけ出す */}
        <span className="hidden md:inline text-xs text-gray-500">
          知ってると飲み会がちょっと楽しくなる話
        </span>
        <Link
          href="/trivia"
          className="ml-auto text-xs text-blue-600 hover:underline shrink-0"
        >
          一覧 →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
        {items.map((t, i) => (
          // スマホは2列までなので3件目は隠す
          <div key={t.slug} className={i < 2 ? '' : 'hidden lg:block'}>
            <TriviaPop trivia={t} />
          </div>
        ))}
      </div>
    </section>
  )
}
