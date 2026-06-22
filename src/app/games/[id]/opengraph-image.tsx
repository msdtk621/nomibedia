import { ImageResponse } from 'next/og'
import { getGameMeta } from '@/lib/db'
import { loadGoogleFont } from '@/lib/og'

export const alt = '飲み会ゲーム | ノミベディア'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = (await getGameMeta(id)) as
    | { title: string; drink_level: number | null; player_count: string[] | null; category: { name: string } | { name: string }[] | null }
    | null

  const title = game?.title ?? '飲み会ゲーム'
  const cat = Array.isArray(game?.category) ? game?.category[0] : game?.category
  const categoryName = cat?.name ?? ''
  const drink = Math.max(0, Math.min(5, game?.drink_level ?? 0))
  const players = (game?.player_count ?? []).slice().sort((a, b) => parseInt(a) - parseInt(b))
  const playerText = players.length > 0 ? `${players.join('・')}人` : ''
  const drinkText = `酔い度 ${'★'.repeat(drink)}${'☆'.repeat(5 - drink)}`

  // 描画する全文字をサブセット対象として渡す
  const subset = `${title}${categoryName}${playerText}ノミベディア酔い度飲み会ゲームの百科事典人数定番からオリジナルまで★☆・〜0123456789`
  let fontData: ArrayBuffer | null = null
  try {
    fontData = await loadGoogleFont('Noto Sans JP', 700, subset)
  } catch {
    fontData = null
  }

  const titleSize = title.length > 22 ? 54 : title.length > 14 ? 68 : 84

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fffaf0',
          padding: '72px',
          fontFamily: fontData ? 'Noto Sans JP' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '14px', backgroundColor: '#fbbf24', borderRadius: '7px' }} />
          {categoryName ? (
            <div
              style={{
                display: 'flex',
                marginLeft: '24px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                fontSize: '30px',
                padding: '8px 24px',
                borderRadius: '9999px',
              }}
            >
              {categoryName}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            color: '#1f2937',
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '34px' }}>
          {drinkText}
          {playerText ? <span style={{ marginLeft: '40px' }}>人数 {playerText}</span> : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '28px' }}>
          <div style={{ display: 'flex', color: '#f59e0b', fontSize: '40px', fontWeight: 700 }}>ノミベディア</div>
          <div style={{ display: 'flex', color: '#9ca3af', fontSize: '26px', marginLeft: '20px' }}>
            飲み会ゲームの百科事典
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Sans JP', data: fontData, style: 'normal' as const, weight: 700 as const }]
        : [],
    }
  )
}
