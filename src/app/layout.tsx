import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import MobileLayout from '@/components/MobileLayout'
import Footer from '@/components/Footer'
import { getCategories } from '@/lib/db'
import { asset } from '@/lib/asset'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ノミベディア - 定番からオリジナルまで、飲み会ゲームの百科事典',
  description: '飲みゲーを投稿・共有・コメントで盛り上がるサイト',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  openGraph: {
    title: 'ノミベディア - 定番からオリジナルまで、飲み会ゲームの百科事典',
    description: '飲みゲーを投稿・共有・コメントで盛り上がるサイト',
    type: 'website',
    locale: 'ja_JP',
    images: [{ url: asset('/logo.jpeg'), width: 512, height: 512, alt: 'ノミベディア' }],
  },
  twitter: {
    card: 'summary',
    title: 'ノミベディア',
    description: '飲みゲーを投稿・共有・コメントで盛り上がるサイト',
    images: [asset('/logo.jpeg')],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50`}>
        <MobileLayout categories={categories}>
          {children}
          <Footer />
        </MobileLayout>
      </body>
    </html>
  )
}
