import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import MobileLayout from '@/components/MobileLayout'
import Footer from '@/components/Footer'
import { getCategories, getNotices } from '@/lib/db'
import { asset } from '@/lib/asset'
import { SITE_URL } from '@/lib/site'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ノミベディア - 定番からオリジナルまで、飲み会ゲームの百科事典',
  description: '飲みゲーを投稿・共有・コメントで盛り上がるサイト',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'ノミベディア - 定番からオリジナルまで、飲み会ゲームの百科事典',
    description: '定番からオリジナルまで、飲み会ゲームをみんなでシェア',
    type: 'website',
    locale: 'ja_JP',
    images: [{ url: asset('/og.jpeg'), width: 1200, height: 630, alt: 'ノミベディア' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ノミベディア - 定番からオリジナルまで、飲み会ゲームの百科事典',
    description: '定番からオリジナルまで、飲み会ゲームをみんなでシェア',
    images: [asset('/og.jpeg')],
  },
  // Google Search Console認証：環境変数 GOOGLE_SITE_VERIFICATION に
  // 認証コードをセットすると <meta google-site-verification> が自動で出力される
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'ノミベディア',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, notices] = await Promise.all([getCategories(), getNotices().catch(() => [])])

  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50`}>
        <MobileLayout categories={categories} notices={notices}>
          {children}
          <Footer />
        </MobileLayout>
      </body>
    </html>
  )
}
