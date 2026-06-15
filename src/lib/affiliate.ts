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
  url: string // アフィリエイトリンク（Amazon/楽天/もしも 等）
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
// AmazonアソシエイトID
const AMAZON_ASSOCIATE_TAG = 'nomibedia-22'

// 楽天市場の検索結果へのアフィリエイトリンクを生成
function rakutenSearch(keyword: string): string {
  const url = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(url)}`
}

// Amazonの検索結果へのアフィリエイトリンクを生成
function amazonSearch(keyword: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_ASSOCIATE_TAG}`
}

// ① サイドバー「飲み会おすすめグッズ」用の厳選商品（カテゴリごとに楽天→Amazonの順）
export const recommendedGoods: AffiliateGood[] = [
  { id: 'supplement-rakuten', name: '二日酔い対策サプリを探す', url: rakutenSearch('二日酔い サプリメント'), tag: '🍺 楽天市場で探す' },
  { id: 'supplement-amazon', name: '二日酔い対策サプリを探す', url: amazonSearch('二日酔い サプリメント'), tag: '🍺 Amazonで探す' },
  { id: 'cardgame-rakuten', name: 'パーティーカードゲームを探す', url: rakutenSearch('カードゲーム パーティー 大人'), tag: '🃏 楽天市場で探す' },
  { id: 'cardgame-amazon', name: 'パーティーカードゲームを探す', url: amazonSearch('カードゲーム パーティー 大人'), tag: '🃏 Amazonで探す' },
  { id: 'boardgame-rakuten', name: '飲み会向けボードゲームを探す', url: rakutenSearch('ボードゲーム 飲み会'), tag: '🎲 楽天市場で探す' },
  { id: 'boardgame-amazon', name: '飲み会向けボードゲームを探す', url: amazonSearch('ボードゲーム 飲み会'), tag: '🎲 Amazonで探す' },
  { id: 'goods-rakuten', name: '飲み会グッズ・おもしろアイテムを探す', url: rakutenSearch('飲み会グッズ パーティー'), tag: '🥤 楽天市場で探す' },
  { id: 'goods-amazon', name: '飲み会グッズ・おもしろアイテムを探す', url: amazonSearch('飲み会グッズ パーティー'), tag: '🥤 Amazonで探す' },
]

// ② 二日酔い対策バナー（A8.net）
// 例: { href: 'https://px.a8.net/svt/ejp?a8mat=...', text: '飲んだ後の強い味方｜ウコンの力', imgSrc: 'https://www25.a8.net/...' },
export const hangoverAds: HangoverAd[] = []

// ① 「必要なもの(required_items)」自動リンク化のキーワード辞書
// 例: { keyword: 'サイコロ', url: 'https://...' }, { keyword: 'トランプ', url: 'https://...' },
export const itemKeywordLinks: ItemKeywordLink[] = []

// 各UIの表示可否（リンクが入ったら true になる）
export const hasGoods = recommendedGoods.length > 0
export const hasHangoverAds = hangoverAds.length > 0
export const hasItemLinks = itemKeywordLinks.length > 0

// いずれかのアフィリエイト要素が有効か（ポリシー表記の出し分け等に利用可）
export const affiliateEnabled = hasGoods || hasHangoverAds || hasItemLinks

// アフィリンク共通の rel 属性
export const AFFILIATE_REL = 'sponsored nofollow noopener noreferrer'
