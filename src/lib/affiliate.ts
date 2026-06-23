// アフィリエイト設定（中央管理）
// ─────────────────────────────────────────────────────────────
// ・リンク/IDが未設定（配列が空）の枠は、各コンポーネントが自動で非表示にする。
//   → リンクが揃うまで本番に空枠やダミーリンクが出ることはない。
// ・ステマ規制（2023.10〜）対応として、アフィリンク表示箇所には必ず「PR」表記を出す。
// ・アフィリンクには rel="sponsored nofollow noopener noreferrer" を付与する（SEO/規約対応）。
//
// 取得したリンクをこのファイルに貼るだけで該当UIが本番に出ます。

export type AffiliateGood = {
  id: string
  name: string
  searchKeyword?: string // 楽天API商品検索に使う語（未指定なら name を使用）。表示名と検索語を分離するための欄
  rakutenUrl?: string // 楽天市場の検索/商品アフィリンク（任意）
  amazonUrl?: string // Amazonの検索/商品アフィリンク（任意）
  imageUrl?: string // 商品画像URL（任意）
  price?: string // 表示用価格テキスト（任意・例: "¥780"）
  tag?: string // ラベル（任意・例: "サイコロ"）
}

export type HangoverAd = {
  href: string // A8.net等のアフィリンク
  text: string // テキストリンク用の文言
  imgSrc?: string // バナー画像URL（A8素材・任意）
  imgWidth?: number
  imgHeight?: number
}

export type ItemKeywordLink = {
  keyword: string // 「必要なもの」テキスト中に出たらリンク化するキーワード
  url: string // 物販検索/商品アフィリンク
}

// 楽天アフィリエイトID
const RAKUTEN_AFFILIATE_ID = '54c2f9c9.71a0e1e0.54c2f9ca.90f64422'
// AmazonアソシエイトID（StoreID）。未設定('')ならAmazonボタンは自動で非表示。
const AMAZON_ASSOCIATE_TAG = 'nomibedia-22'

// 楽天市場の検索結果へのアフィリエイトリンクを生成
export function rakutenSearch(keyword: string): string {
  const url = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(url)}`
}

// Amazonの検索結果へのアフィリエイトリンクを生成
export function amazonSearch(keyword: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_ASSOCIATE_TAG}`
}

// 各ショップのアフィリエイトが有効か（IDが入っていれば true）
export const hasRakuten = RAKUTEN_AFFILIATE_ID.length > 0
export const hasAmazon = AMAZON_ASSOCIATE_TAG.length > 0

// ① サイドバー「飲み会おすすめグッズ」用の厳選商品。
//    1商品につき楽天・Amazonの両方のリンクを持たせ、コンポーネント側で [楽天][Amazon] のボタンを並べる。
export const recommendedGoods: AffiliateGood[] = [
  { id: 'supplement', name: '二日酔い対策サプリ', searchKeyword: '二日酔い サプリメント', tag: '🍺 飲む前・飲んだ後に', rakutenUrl: rakutenSearch('二日酔い サプリメント'), amazonUrl: amazonSearch('二日酔い サプリメント') },
  { id: 'cardgame', name: 'パーティーカードゲーム', searchKeyword: 'カードゲーム パーティー 大人', tag: '🃏 盛り上がる定番', rakutenUrl: rakutenSearch('カードゲーム パーティー 大人'), amazonUrl: amazonSearch('カードゲーム パーティー 大人') },
  { id: 'boardgame', name: '飲み会向けボードゲーム', searchKeyword: 'ボードゲーム 飲み会', tag: '🎲 夜中まで楽しむ', rakutenUrl: rakutenSearch('ボードゲーム 飲み会'), amazonUrl: amazonSearch('ボードゲーム 飲み会') },
  { id: 'goods', name: '飲み会グッズ・おもしろアイテム', searchKeyword: '飲み会グッズ パーティー', tag: '🥤 コップ・罰ゲーム用', rakutenUrl: rakutenSearch('飲み会グッズ パーティー'), amazonUrl: amazonSearch('飲み会グッズ パーティー') },
]

// ② 二日酔い対策バナー（A8.net）
// 例: { href: 'https://px.a8.net/svt/ejp?a8mat=...', text: '飲んだ後の強い味方｜ウコンの力', imgSrc: 'https://www25.a8.net/...' },
export const hangoverAds: HangoverAd[] = []

// ① 「必要なもの(required_items)」自動リンク化のキーワード辞書
// 「必要なもの」を読む＝今まさに道具を探している瞬間なのでCVRが構造的に高い枠。
// 検索リンク（amazonSearch）で生成。個別商品リンクに差し替えればさらにCVR向上。
export const itemKeywordLinks: ItemKeywordLink[] = [
  { keyword: 'トランプ', url: amazonSearch('トランプ') },
  { keyword: 'サイコロ', url: amazonSearch('サイコロ 6面 大きい') },
  { keyword: 'ジェンガ', url: amazonSearch('ジェンガ') },
  { keyword: 'UNO', url: amazonSearch('UNO カードゲーム') },
  { keyword: 'ダーツ', url: amazonSearch('ダーツ セット 家庭用') },
  { keyword: 'ビンゴ', url: amazonSearch('ビンゴ ゲーム セット') },
  { keyword: 'ルーレット', url: amazonSearch('飲み会 ルーレット 罰ゲーム') },
  { keyword: 'タイマー', url: amazonSearch('キッチンタイマー') },
  { keyword: '早押しボタン', url: amazonSearch('早押しボタン クイズ') },
  { keyword: '罰ゲーム', url: amazonSearch('罰ゲーム グッズ パーティー') },
]

// 各UIの表示可否（リンクが入ったら true になる）
export const hasGoods = recommendedGoods.length > 0
export const hasHangoverAds = hangoverAds.length > 0
export const hasItemLinks = itemKeywordLinks.length > 0

// いずれかのアフィリエイト要素が有効か（ポリシー表記の出し分け等に利用可）
export const affiliateEnabled = hasGoods || hasHangoverAds || hasItemLinks

// アフィリンク共通の rel 属性
export const AFFILIATE_REL = 'sponsored nofollow noopener noreferrer'
