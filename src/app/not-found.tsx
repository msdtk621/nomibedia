import Link from 'next/link'
import { asset } from '@/lib/asset'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/logo.jpeg")} alt="ノミベディア" className="w-20 h-20 rounded-full object-cover mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6">このページは見つかりませんでした</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        トップに戻る
      </Link>
    </div>
  )
}
