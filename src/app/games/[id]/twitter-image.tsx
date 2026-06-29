// X(Twitter)カードのOG画像は opengraph-image と同じ生成器を使う
export { default, alt, size, contentType } from './opengraph-image'

// route segment config は再エクスポート不可のため、ここで直接定義してキャッシュさせる
export const revalidate = 86400
