import Link from 'next/link'

/**
 * 一覧のページ送り。
 * クライアント側の state ではなく URL（?page=2）で持つことで、
 * 戻る操作でページが保たれ、検索エンジンにも各ページを辿ってもらえる。
 */
export default function Pagination({
  page,
  totalPages,
  basePath = '/',
  params = {},
}: {
  page: number
  totalPages: number
  basePath?: string
  /** page 以外に引き継ぎたいクエリ（q, tag など） */
  params?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  const href = (p: number) => {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value)
    }
    if (p > 1) sp.set('page', String(p))
    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  // 現在地の前後1ページ＋最初と最後だけ出し、離れているところは「…」で省略する
  const nums: (number | 'gap')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      nums.push(p)
    } else if (nums[nums.length - 1] !== 'gap') {
      nums.push('gap')
    }
  }

  const arrow = 'flex items-center justify-center min-w-9 h-9 px-2 rounded-lg border text-sm font-medium transition-colors'

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="ページ送り">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${arrow} bg-white border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600`} rel="prev">
          ‹
        </Link>
      ) : (
        <span className={`${arrow} bg-gray-50 border-gray-100 text-gray-300`} aria-disabled="true">‹</span>
      )}

      {nums.map((n, i) =>
        n === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400 text-sm">…</span>
        ) : n === page ? (
          <span
            key={n}
            aria-current="page"
            className={`${arrow} bg-amber-400 border-amber-400 text-white`}
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            className={`${arrow} bg-white border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600`}
          >
            {n}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${arrow} bg-white border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600`} rel="next">
          ›
        </Link>
      ) : (
        <span className={`${arrow} bg-gray-50 border-gray-100 text-gray-300`} aria-disabled="true">›</span>
      )}
    </nav>
  )
}
