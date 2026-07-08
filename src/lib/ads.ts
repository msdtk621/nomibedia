// Google AdSense 設定（中央管理）
// ─────────────────────────────────────────────────────────────
// ・広告ユニットの slot ID は AdSense管理画面で「広告ユニット」を作成して取得し、
//   .env に NEXT_PUBLIC_ADSENSE_SLOT_* としてセットする。
// ・未設定の枠は <AdUnit> が自動で非表示にする（空枠やレイアウト崩れは出ない＝アフィリ枠と同じ方針）。
// ・スクリプト本体（adsbygoogle.js）は layout.tsx で読み込み済み。

export const ADSENSE_CLIENT = 'ca-pub-8713761965517511'

// 配置ごとの広告ユニット slot ID（AdSense管理画面の発行済みユニット 2026-06-29 作成）。
// slot ID は HTML に出る公開値のため、CLIENT 同様ここで中央管理する（環境変数で上書き可）。
export const adSlots = {
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? '6326256265', // ゲーム詳細の記事内 = nomibedia-article
  feed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED ?? '9543025083', // 一覧フィード内 = nomibedia-feed
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '3878232497', // サイドバー = nomibedia-sidebar
} as const

export type AdSlot = keyof typeof adSlots

// 各枠が有効か（slot ID が入っていれば true）
export const hasAd = (slot: AdSlot) => adSlots[slot].length > 0
