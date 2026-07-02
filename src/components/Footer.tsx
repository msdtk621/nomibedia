import Link from 'next/link'
import { asset } from '@/lib/asset'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-6 pb-4 mt-8">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/logo.jpeg")} alt="ノミベディア" className="w-6 h-6 rounded-full object-cover" />
            <span className="font-medium text-gray-700">ノミベディア</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-blue-600">このサイトについて</Link>
            <Link href="/privacy" className="hover:text-blue-600">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:text-blue-600">利用規約</Link>
            <Link href="/contact" className="hover:text-blue-600">お問い合わせ</Link>
          </div>
          <div className="text-xs">© 2026 ノミベディア</div>
        </div>
        <p className="text-center text-xs text-gray-400">
          当サイトは20歳以上の方を対象としています。未成年者の飲酒は法律で禁止されています。
        </p>
      </div>
    </footer>
  )
}
