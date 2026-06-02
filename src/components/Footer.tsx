import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>🍺</span>
          <span className="font-medium text-gray-700">ノミペディア</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-blue-600">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-blue-600">利用規約</Link>
        </div>
        <div className="text-xs">© 2026 ノミペディア</div>
      </div>
    </footer>
  )
}
