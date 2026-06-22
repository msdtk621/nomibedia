// Google AdSense 設定（中央管理）
// ─────────────────────────────────────────────────────────────
// ・広告ユニットの slot ID は AdSense管理画面で「広告ユニット」を作成して取得し、
//   .env に NEXT_PUBLIC_ADSENSE_SLOT_* としてセットする。
// ・未設定の枠は <AdUnit> が自動で非表示にする（空枠やレイアウト崩れは出ない＝アフィリ枠と同じ方針）。
// ・スクリプト本体（adsbygoogle.js）は layout.tsx で読み込み済み。

export const ADSENSE_CLIENT = 'ca-pub-8713761965517511'

// 配置ごとの広告ユニット slot ID（AdSense管理画面で発行 → 環境変数へ）
export const adSlots = {
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? '', // ゲーム詳細の記事内
  feed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED ?? '', // 一覧フィード内
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '', // サイドバー
} as const

export type AdSlot = keyof typeof adSlots

// 各枠が有効か（slot ID が入っていれば true）
export const hasAd = (slot: AdSlot) => adSlots[slot].length > 0
