import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import MobileLayout from '@/components/MobileLayout'
import Footer from '@/components/Footer'
import { getCategories } from '@/lib/db'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ノミペディア - 飲みゲーをみんなでシェアするサイト',
  description: '飲みゲーを投稿・共有・コメントで盛り上がるサイト',
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
