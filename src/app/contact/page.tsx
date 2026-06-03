export const metadata = { title: 'お問い合わせ | ノミベディア' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">お問い合わせ</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 text-gray-700">
        <p>ノミベディアへのお問い合わせは、以下のメールアドレスまでご連絡ください。</p>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <a
            href="mailto:kippo.pokky@gmail.com"
            className="text-blue-600 font-medium text-lg hover:underline"
          >
            kippo.pokky@gmail.com
          </a>
        </div>

        <section>
          <h2 className="font-bold text-gray-900 mb-2">お問い合わせいただける内容</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>不適切なコンテンツの報告</li>
            <li>著作権・権利侵害に関するご連絡</li>
            <li>サービスに関するご意見・ご要望</li>
            <li>その他ご不明な点</li>
          </ul>
        </section>

        <p className="text-sm text-gray-500">
          通常2〜3営業日以内にご返信いたします。内容によってはお返事できない場合もございます。
        </p>
      </div>
    </div>
  )
}
