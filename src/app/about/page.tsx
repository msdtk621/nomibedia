import Link from 'next/link'

export const metadata = {
  title: 'このサイトについて｜ノミベディア',
  description: 'ノミベディアは、飲み会で使えるゲームのルールやアイデアをみんなで持ち寄る百科事典サイトです。サイトの目的・コンテンツの作り方・広告掲載についてご案内します。',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">このサイトについて</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">ノミベディアとは</h2>
          <p>「ノミベディア」は、飲み会やパーティーで使えるゲームのルール・遊び方を集めた百科事典サイトです。定番の飲み会ゲームから、あまり知られていないローカルルールまで、シーンや人数に合わせて探せることを目指しています。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">コンテンツの作り方</h2>
          <p>掲載しているゲームの多くは、ユーザーの皆様からの投稿（UGC）によって集められています。投稿されたコンテンツは、運営が内容を確認したうえで表記の整備等を行い掲載しています。ルールの解釈や呼び方には地域・グループによる差がある場合があります。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">広告・アフィリエイトの掲載について</h2>
          <p>当サイトはGoogle AdSense等の広告およびAmazon/楽天等のアフィリエイトプログラムを利用しています。これらの広告・リンクを経由して商品・サービスが購入された場合、当サイトが広告収入や紹介料を受け取ることがあります。広告・アフィリエイトリンクを含む箇所には「PR」「広告」等の表記を行っています。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">免責事項</h2>
          <p>当サイトに掲載されたゲーム・コンテンツの正確性・安全性については保証しかねます。ゲームを行う際は、周囲の安全やご自身の体調に十分配慮のうえ、自己の責任においてお楽しみください。掲載内容の利用により生じたいかなる損害についても、当サイトは責任を負いかねます。</p>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm font-medium">20歳未満の飲酒は法律で禁止されています。飲酒は適量を楽しみましょう。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">運営者情報</h2>
          <dl className="grid grid-cols-[6rem_1fr] gap-y-2 text-sm">
            <dt className="font-medium text-gray-900">サイト名</dt>
            <dd>ノミベディア（nomibedia.com）</dd>
            <dt className="font-medium text-gray-900">運営</dt>
            <dd>Code &amp; Chord</dd>
            <dt className="font-medium text-gray-900">連絡先</dt>
            <dd>info@code-and-chord.com</dd>
            <dt className="font-medium text-gray-900">運営開始</dt>
            <dd>2026年6月</dd>
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">お問い合わせ</h2>
          <p>コンテンツに関するご報告やサイトへのご意見・ご要望は、<Link href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</Link>からご連絡ください。</p>
        </section>
      </div>
    </div>
  )
}
