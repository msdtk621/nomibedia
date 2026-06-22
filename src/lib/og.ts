// OG画像（next/og の ImageResponse）用の日本語フォントローダー。
// satori/resvg は ttf/otf しか扱えないため、Google Fonts から「使う文字だけ」を
// truetype形式でサブセット取得する（古いUAを送ると ttf が返る既知の手法）。
// text に描画する全文字を渡すことで、取得サイズを数KBに抑えられる。
export async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await fetch(url, {
    headers: {
      // 古いUAだと Google が truetype(ttf) を返す（satoriが扱える形式）
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
    },
  }).then((res) => res.text())

  const match = css.match(/src:\s*url\((.+?)\)\s*format\(['"]?(?:opentype|truetype)['"]?\)/)
  if (!match) throw new Error('フォントURLの抽出に失敗しました')

  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error('フォントの取得に失敗しました')
  return fontRes.arrayBuffer()
}
