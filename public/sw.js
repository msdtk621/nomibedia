// ノミベディア 管理者向けプッシュ通知 Service Worker

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// プッシュ受信 → 通知表示＋アプリアイコンに赤バッジ
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'ノミベディア', body: event.data ? event.data.text() : '新しい通知があります' }
  }

  const title = data.title || 'ノミベディア'
  const body = data.body || '新しい通知があります'
  const count = typeof data.count === 'number' ? data.count : 1
  const url = data.url || '/admin'

  event.waitUntil(
    (async () => {
      // バナー通知
      await self.registration.showNotification(title, {
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: { url },
        tag: 'nomibedia-admin',
        renotify: true,
      })
      // ホーム画面アイコンの赤バッジ
      if (self.navigator && 'setAppBadge' in self.navigator) {
        try { await self.navigator.setAppBadge(count) } catch {}
      }
    })()
  )
})

// 通知タップ → 管理画面を開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data && event.notification.data.url) || '/admin'
  event.waitUntil(
    (async () => {
      // バッジをクリア
      if (self.navigator && 'clearAppBadge' in self.navigator) {
        try { await self.navigator.clearAppBadge() } catch {}
      }
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of allClients) {
        if (client.url.includes('/admin') && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
    })()
  )
})
