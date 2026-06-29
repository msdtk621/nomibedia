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

// 楽天API（formatVersion:2）の生アイテム。必要なフィールドのみ。
type RakutenRawItem = {
  itemName?: string
  itemPrice?: number
  mediumImageUrls?: string[]
  smallImageUrls?: string[]
  affiliateUrl?: string
  shopName?: string
}

// アイテムから高解像度の画像URLを取り出す（無ければ null）。
// mediumImageUrls は 128x128。サムネサーバーの _ex を上げて高解像度トプ画にする。
function pickImage(item: RakutenRawItem): string | null {
  const raw = item.mediumImageUrls?.[0] ?? item.smallImageUrls?.[0] ?? ''
  if (!raw) return null
  return raw.replace(/\?_ex=\d+x\d+/, '?_ex=400x400')
}

// キーワードで楽天市場の商品を1件取得（画像・価格・アフィリンク）。
// 複数件取得し「画像が実際にある最初の商品」を採用するため、トップ1件が欠けても落ちない。
//   ・opts.revalidate（秒）… 結果をデータキャッシュに保存（おすすめグッズはAPIの叩きすぎ防止／管理画面は既定no-storeで最新）
//   ・opts.sort … 楽天の並び順。'+itemPrice' で安い順＝最安値の商品を拾える（既定 'standard'）
//   ・opts.hits … 取得件数（既定10）。画像欠けや最安候補の母数を確保する
export async function searchRakutenProduct(
  keyword: string,
  opts: { revalidate?: number; sort?: string; hits?: number } = {},
): Promise<RakutenProduct | null> {
  const applicationId = process.env.RAKUTEN_APP_ID
  const accessKey = process.env.RAKUTEN_ACCESS_KEY
  if (!applicationId || !accessKey || !keyword.trim()) return null

  const params = new URLSearchParams({
    applicationId,
    accessKey,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    keyword: keyword.trim(),
    hits: String(opts.hits ?? 10),
    imageFlag: '1', // 画像のある商品のみ
    sort: opts.sort ?? 'standard',
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
  const items: RakutenRawItem[] = data?.Items ?? []

  // 並び順を保ったまま「商品名と画像が両方ある」最初の商品を採用。
  // sort='+itemPrice' の場合これがそのまま「画像のある最安商品」になる。
  for (const item of items) {
    const imageUrl = item.itemName ? pickImage(item) : null
    if (!imageUrl) continue
    return {
      itemName: item.itemName!,
      price: item.itemPrice ?? 0,
      imageUrl,
      affiliateUrl: item.affiliateUrl ?? '',
      shopName: item.shopName ?? '',
    }
  }
  return null
}
