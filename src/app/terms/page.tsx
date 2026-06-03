export const metadata = { title: '利用規約 | ノミベディア' }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">利用規約</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-700 space-y-6">
        <p className="text-sm text-gray-500">最終更新日：2026年6月2日</p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第1条（適用）</h2>
          <p>本規約は、ノミベディア（以下「当サイト」）が提供するサービスの利用に関する条件を定めるものです。ユーザーは本規約に同意した上でサービスをご利用ください。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第2条（禁止事項）</h2>
          <p>ユーザーは以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>他のユーザーへの誹謗中傷・差別的表現を含む投稿</li>
            <li>著作権・肖像権等を侵害するコンテンツの投稿</li>
            <li>スパム・広告目的の連続投稿</li>
            <li>未成年者を対象とした有害なコンテンツの投稿</li>
            <li>違法行為を助長するコンテンツの投稿</li>
            <li>当サイトの運営を妨げる行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第3条（コンテンツの取り扱い）</h2>
          <p>ユーザーが投稿したコンテンツの著作権はユーザーに帰属しますが、当サイトはサービス運営・改善のために投稿コンテンツを利用できるものとします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第4条（コンテンツの削除）</h2>
          <p>当サイトは、本規約に違反するコンテンツを予告なく削除できるものとします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第5条（免責事項）</h2>
          <p>当サイトに掲載されたゲーム・コンテンツの正確性・安全性について保証しません。ユーザーは自己の責任においてサービスをご利用ください。飲酒は適量を心がけ、20歳未満の飲酒は法律で禁じられています。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第6条（規約の変更）</h2>
          <p>当サイトは必要に応じて本規約を変更することができます。変更後は本ページに掲載します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">第7条（お問い合わせ）</h2>
          <p>本規約に関するお問い合わせは、下記メールアドレスまでご連絡ください。</p>
          <p className="mt-2">
            <a href="mailto:kippo.pokky@gmail.com" className="text-blue-600 hover:underline">kippo.pokky@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}
