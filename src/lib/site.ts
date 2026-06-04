// サイトの公開URL。本番ドメインは nomibedia.com。
// Vercel/Netlify などでは NEXT_PUBLIC_SITE_URL を設定すると上書きできる。
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://nomibedia.com')
