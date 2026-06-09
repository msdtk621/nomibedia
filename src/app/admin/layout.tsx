import type { Metadata } from 'next'

// 管理ページではマニフェストを無効化する。
// iOSでホーム画面に追加したとき、PWAのstart_url（"/"=トップ）が優先されて
// 合言葉付きURLが無視される問題を避けるため。manifestを外すと
// iOSは「現在開いているURL（?key=付き）」をそのままアイコンに保存する。
export const metadata: Metadata = {
  manifest: null,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
