'use client'

import { useEffect, useState } from 'react'
import { savePushSubscription, removePushSubscription, sendTestPush } from '@/app/actions/push'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

type State = 'loading' | 'unsupported' | 'off' | 'on' | 'denied'

export default function PushToggle() {
  const [state, setState] = useState<State>('loading')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }
    navigator.serviceWorker.getRegistration().then(async reg => {
      const sub = reg ? await reg.pushManager.getSubscription() : null
      setState(sub ? 'on' : 'off')
    }).catch(() => setState('off'))
  }, [])

  const enable = async () => {
    setBusy(true); setMsg('')
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off')
        setBusy(false)
        return
      }
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!key) { setMsg('設定エラー（鍵がありません）'); setBusy(false); return }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
      })
      await savePushSubscription(JSON.parse(JSON.stringify(sub)))
      setState('on')
      setMsg('通知をオンにしました🔔')
    } catch (e) {
      setMsg('オンにできませんでした。もう一度お試しください。')
    }
    setBusy(false)
  }

  const disable = async () => {
    setBusy(true); setMsg('')
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = reg ? await reg.pushManager.getSubscription() : null
      if (sub) {
        await removePushSubscription(sub.endpoint)
        await sub.unsubscribe()
      }
      if ('clearAppBadge' in navigator) { try { await (navigator as Navigator & { clearAppBadge?: () => Promise<void> }).clearAppBadge?.() } catch {} }
      setState('off')
      setMsg('通知をオフにしました')
    } catch {
      setMsg('オフにできませんでした。')
    }
    setBusy(false)
  }

  const test = async () => {
    setBusy(true); setMsg('')
    try { await sendTestPush(); setMsg('テスト通知を送りました（数秒で届きます）') }
    catch { setMsg('テスト送信に失敗しました') }
    setBusy(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🔔</span>
        <span className="font-bold text-gray-900">プッシュ通知</span>
        {state === 'on' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">オン</span>}
      </div>

      {state === 'loading' && <p className="text-sm text-gray-400">確認中…</p>}

      {state === 'unsupported' && (
        <p className="text-sm text-gray-500">
          この環境では通知を使えません。<br />
          iPhoneの場合は、Safariから<b>ホーム画面に追加</b>したアプリで開いてください。
        </p>
      )}

      {state === 'denied' && (
        <p className="text-sm text-red-500">
          通知がブロックされています。iPhoneの「設定 → 通知 → ノミベディア」で許可してください。
        </p>
      )}

      {state === 'off' && (
        <>
          <p className="text-sm text-gray-500 mb-3">
            オンにすると、通報やボドゲリクエストが届いたときにこの端末へ通知＋アイコンに赤バッジが出ます。
          </p>
          <button
            onClick={enable}
            disabled={busy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? '設定中…' : '通知をオンにする'}
          </button>
        </>
      )}

      {state === 'on' && (
        <>
          <p className="text-sm text-gray-500 mb-3">この端末で通知を受け取れます。</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={test} disabled={busy} className="px-3 py-1.5 text-sm border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50">
              テスト送信
            </button>
            <button onClick={disable} disabled={busy} className="px-3 py-1.5 text-sm border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              通知をオフにする
            </button>
          </div>
        </>
      )}

      {msg && <p className="text-xs text-gray-500 mt-2">{msg}</p>}
    </div>
  )
}
