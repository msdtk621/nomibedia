// public 配下の静的アセット（画像など）のパスに basePath を前置するヘルパー。
// Next.js は <img src> や CSS の参照に basePath を自動付与しないため手動で付ける。
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  if (!path.startsWith('/')) return path
  return `${BASE_PATH}${path}`
}
