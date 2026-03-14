'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(reg => {
        // Ascultă mesaje de sync de la SW
        navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
          if (event.data?.type === 'SYNC_LEARNING') {
            // Importul dinamic nu blochează LCP
            import('@/lib/learning/offlineSync').then(({ syncPendingToSupabase }) => {
              const userId = localStorage.getItem('playlio_user_id')
              if (userId) syncPendingToSupabase(userId)
            })
          }
        })
      })
      .catch(() => {
        // Service worker registration eșuat silențios
      })
  }, [])

  return null
}
