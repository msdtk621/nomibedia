'use server'

import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { sendAdminPush } from '@/lib/push'

type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } }

// 端末の購読情報を保存（同じendpointなら上書き）
export async function savePushSubscription(sub: PushSub) {
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) return
  const admin = createAdminSupabaseClient()
  await admin.from('push_subscriptions').upsert(
    { endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    { onConflict: 'endpoint' }
  )
}

// 購読解除
export async function removePushSubscription(endpoint: string) {
  if (!endpoint) return
  const admin = createAdminSupabaseClient()
  await admin.from('push_subscriptions').delete().eq('endpoint', endpoint)
}

// テスト通知（ダッシュボードの「テスト送信」ボタン用）
export async function sendTestPush() {
  await sendAdminPush('ノミベディア（テスト）', '通知が正しく届いています🍺', '/admin')
}
