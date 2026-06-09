import webpush from 'web-push'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// サーバー専用のプッシュ送信ヘルパー（'use server'ではないのでクライアントからは呼べない）

function configured(): boolean {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !priv) return false
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@nomibedia.com', pub, priv)
  return true
}

type SubRow = { endpoint: string; p256dh: string; auth: string }

/**
 * 登録済みの全管理者デバイスにプッシュ通知を送る。
 * count（未対応の通報＋リクエストの合計）も一緒に送り、アイコンの赤バッジに反映する。
 */
export async function sendAdminPush(title: string, body: string, url = '/admin') {
  if (!configured()) return
  const admin = createAdminSupabaseClient()
  const [{ data: subs }, reportsCount, requestsCount] = await Promise.all([
    admin.from('push_subscriptions').select('endpoint, p256dh, auth'),
    admin.from('reports').select('id', { count: 'exact', head: true }),
    admin.from('board_game_requests').select('id', { count: 'exact', head: true }),
  ])
  const count = (reportsCount.count ?? 0) + (requestsCount.count ?? 0)
  const payload = JSON.stringify({ title, body, url, count })

  await Promise.all(
    (subs ?? []).map(async (s: SubRow) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)
      } catch (e: unknown) {
        const code = (e as { statusCode?: number })?.statusCode
        // 期限切れ・無効な購読は掃除する
        if (code === 404 || code === 410) {
          await admin.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
        }
      }
    })
  )
}
