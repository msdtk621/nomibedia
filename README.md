# ノミベディア

「定番からオリジナルまで、飲み会ゲームの百科事典」
飲み会ゲーム・パーティーゲームをユーザーが投稿・共有し、コメントやランキングで盛り上がれるCGMサイトです。

**本番URL: https://nomibedia.com**（個人開発・運用中）

## 主な機能

- 飲み会ゲーム・ボードゲームの投稿（ルール・人数・盛り上がり度）
- カテゴリ別の一覧・検索・ランキング
- コメント・お気に入り機能
- Webプッシュ通知（web-push / Service Worker）
- 管理画面（投稿の承認・モデレーション）
- SEO対応（sitemap / robots / OGP）・アフィリエイトによる収益化

## 技術スタック

| 領域 | 技術 |
|---|---|
| フレームワーク | Next.js 16（App Router / Server Actions）/ React 19 / TypeScript |
| スタイリング | Tailwind CSS v4 |
| データベース・認証 | Supabase（@supabase/ssr によるサーバーサイド認証） |
| 通知 | Web Push API（web-push） |
| ホスティング | Vercel（`master` ブランチ = 本番） |

## 設計のポイント

- App Router + Server Actions 中心の構成（`src/app/actions/`）
- 収益化リンクは `affiliate.ts` で一元管理し、貼り替え・差し替えを1箇所で完結
- 投稿 → 管理画面で承認 → 公開、のモデレーションフローを実装

## 開発

```bash
npm install
npm run dev
# http://localhost:3000
```

## 作者

個人開発: [msdtk621](https://github.com/msdtk621)
企画・設計・実装・デザイン・SEO・収益化まで一人で担当しています。
