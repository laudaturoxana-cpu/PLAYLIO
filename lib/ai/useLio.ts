'use client'

import { useCallback, useRef } from 'react'
import type { LioRequestBody } from '@/app/api/lio/route'

interface UseLioOptions {
  childName: string
  age: number
  world: LioRequestBody['world']
}

export function useLio({ childName, age, world }: UseLioOptions) {
  // Debounce: don't spam API — one request at a time
  const inFlight = useRef(false)

  const ask = useCallback(
    async (
      event: LioRequestBody['event'],
      opts?: { context?: string; streak?: number; score?: number }
    ): Promise<string> => {
      if (inFlight.current) return ''
      inFlight.current = true

      try {
        const res = await fetch('/api/lio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childName,
            age,
            world,
            event,
            ...opts,
          } satisfies LioRequestBody),
        })
        const data = await res.json()
        return (data.message as string) ?? ''
      } catch {
        return ''
      } finally {
        inFlight.current = false
      }
    },
    [childName, age, world]
  )

  return { ask }
}
