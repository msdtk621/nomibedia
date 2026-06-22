import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import MobileLayout from '@/components/MobileLayout'
import Footer from '@/components/Footer'
import { getCategories, getNotices } from '@/lib/db'
import { asset } from '@/lib/asset'
import { SITE_URL } from '@/lib/site'

const geist = Geist({ subsets: ['latin'] })

// Google Analytics 4 の測定ID。本番では環境変数で上書き可能。
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-5M8RVGV0P5'

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
        {/* App Routerでは手動の<head>はNG（hydrationが壊れ全クライアントJSが死ぬ）。
            afterInteractiveのScriptはbody内に置けばNextが適切に読み込む */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8713761965517511"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics 4。既定の測定IDをコードに持ち、環境変数 NEXT_PUBLIC_GA_ID で上書き可。
            手動の<head>タグはhydrationを壊すため、必ずnext/scriptで読み込む。 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        <MobileLayout categories={categories} notices={notices}>
          {children}
          <Footer />
        </MobileLayout>
      </body>
    </html>
  )
}
