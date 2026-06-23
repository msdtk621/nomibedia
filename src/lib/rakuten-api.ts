// 楽天 Ichiba Item Search API（新ポータル版）
// 認証: applicationId + accessKey（環境変数）。許可ドメイン制約のため Origin ヘッダ必須。
// accessKey は秘密キーなので必ず環境変数で管理（git・クライアントには出さない）。
const ENDPOINT = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401'
const RAKUTEN_AFFILIATE_ID = '54c2f9c9.71a0e1e0.54c2f9ca.90f64422'
const SITE_ORIGIN = 'https://nomibedia.com'

export type RakutenProduct = {
  itemName: string
  price: number
  imageUrl: string
  affiliateUrl: string
  shopName: string
}

// キーワードで楽天市場のトップ商品を1件取得（画像・価格・アフィリンク）
// opts.revalidate（秒）を渡すと結果をデータキャッシュに保存する。
//   ・おすすめグッズ枠 … 全ページ共通＆日次更新で十分なので revalidate を指定しAPIの叩きすぎを防ぐ
//   ・管理画面の手動取得 … 既定（no-store）で常に最新を取得
export async function searchRakutenProduct(
  keyword: string,
  opts: { revalidate?: number } = {},
): Promise<RakutenProduct | null> {
  const applicationId = process.env.RAKUTEN_APP_ID
  const accessKey = process.env.RAKUTEN_ACCESS_KEY
  if (!applicationId || !accessKey || !keyword.trim()) return null

  const params = new URLSearchParams({
    applicationId,
    accessKey,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    keyword: keyword.trim(),
    hits: '1',
    imageFlag: '1', // 画像のある商品のみ
    formatVersion: '2',
    format: 'json',
  })

  const cacheOpt = opts.revalidate
    ? { next: { revalidate: opts.revalidate, tags: ['rakuten-goods'] } }
    : { cache: 'no-store' as const }

  let res: Response
  try {
    res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: { Origin: SITE_ORIGIN, Referer: `${SITE_ORIGIN}/` },
      ...cacheOpt,
    })
  } catch {
    return null
  }
  if (!res.ok) return null

  const data = await res.json().catch(() => null)
  const item = data?.Items?.[0]
  if (!item?.itemName) return null

  // mediumImageUrls は 128x128。サムネサーバーの _ex を上げて高解像度トプ画にする。
  const rawImg: string = item.mediumImageUrls?.[0] ?? item.smallImageUrls?.[0] ?? ''
  const imageUrl = rawImg.replace(/\?_ex=\d+x\d+/, '?_ex=400x400')

  return {
    itemName: item.itemName,
    price: item.itemPrice ?? 0,
    imageUrl,
    affiliateUrl: item.affiliateUrl ?? '',
    shopName: item.shopName ?? '',
  }
}
