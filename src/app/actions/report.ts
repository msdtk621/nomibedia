'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

const NOTIFY_EMAIL = 'kippo.pokky@gmail.com'

export async function reportGame(gameId: string, reason: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('reports').insert({ game_id: gameId, reason })

  // ゲーム情報を取得してメール本文に含める
  const { data: game } = await supabase
    .from('games')
    .select('title')
    .eq('id', gameId)
    .single()

  const gameTitle = game?.title ?? '(不明)'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://extraordinary-faloodeh-6680cf.netlify.app'
  const gameUrl = `${baseUrl}/games/${gameId}`

  // Resend経由でメール通知（APIキーがあれば送信）
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ノミベディア通報 <onboarding@resend.dev>',
          to: [NOTIFY_EMAIL],
          subject: `【通報】${gameTitle}`,
          html: `
            <h2>新しい通報がありました</h2>
            <p><strong>ゲーム:</strong> ${gameTitle}</p>
            <p><strong>理由:</strong> ${reason}</p>
            <p><strong>リンク:</strong> <a href="${gameUrl}">${gameUrl}</a></p>
          `,
        }),
      })
    } catch (e) {
      console.error('通報メール送信エラー:', e)
    }
  }
}
