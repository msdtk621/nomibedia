export const metadata = { title: 'プライバシーポリシー | ノミベディア' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">プライバシーポリシー</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 prose prose-sm max-w-none text-gray-700 space-y-6">
        <p className="text-sm text-gray-500">最終更新日：2026年6月4日</p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. 収集する情報</h2>
          <p>当サイト「ノミベディア」は、以下の情報を収集する場合があります。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>投稿・コメント時に入力されたニックネーム・テキスト</li>
            <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
            <li>Cookieおよびローカルストレージに保存される識別情報</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. 情報の利用目的</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>サービスの提供・運営・改善</li>
            <li>不正利用・スパムの防止</li>
            <li>アクセス解析および広告配信</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. 広告について</h2>
          <p>当サイトはGoogle AdSenseを利用した広告を掲載する場合があります。Googleはユーザーの興味に合わせた広告を表示するためにCookieを使用します。Googleの広告Cookieの使用はGoogleのプライバシーポリシーに従います。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. アフィリエイトプログラムについて</h2>
          <p>当サイトは、Amazonアソシエイト・楽天アフィリエイト・A8.net等のアフィリエイトプログラムを利用し、飲み会グッズやお酒・健康食品等の商品・サービスを紹介しています。これらのリンクを経由して商品・サービスが購入された場合、当サイトが紹介料を受け取ることがあります。アフィリエイトリンクを含む箇所には「PR」「広告」等の表記を行います。各サービスにおけるCookieの利用や個人情報の取り扱いは、各事業者のプライバシーポリシーに従います。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. アクセス解析</h2>
          <p>当サイトはアクセス解析のためにCookieを使用する場合があります。これらのデータは匿名で収集されており、個人を特定するものではありません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. 第三者への提供</h2>
          <p>当サイトは、法令に基づく場合を除き、収集した個人情報を第三者に提供することはありません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. プライバシーポリシーの変更</h2>
          <p>本ポリシーの内容は、必要に応じて変更することがあります。変更後は本ページに掲載します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. お問い合わせ</h2>
          <p>本ポリシーに関するお問い合わせは、下記メールアドレスまでご連絡ください。</p>
          <p className="mt-2">
            <a href="mailto:kippo.pokky@gmail.com" className="text-blue-600 hover:underline">kippo.pokky@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}
