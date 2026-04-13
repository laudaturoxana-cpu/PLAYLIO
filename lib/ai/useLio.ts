'use client'

import { useCallback, useRef } from 'react'
import type { LioRequestBody } from '@/app/api/lio/route'

interface UseLioOptions {
  childName: string
  age: number
  world: LioRequestBody['world']
}

export interface TeachOptions {
  wrongAnswer?: string
  correctAnswer?: string
  questionText?: string
  attemptCount?: number
  context?: string
}

export function useLio({ childName, age, world }: UseLioOptions) {
  const inFlight      = useRef(false)
  const teachInFlight = useRef(false)

  // ─── Quick message (<12 words, cheerleader) ─────────────────
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
            childName, age, world, event,
            mode: 'quick',
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

  // ─── Teacher message (2-3 sentences, explains why + logic) ──
  const teach = useCallback(
    async (opts: TeachOptions): Promise<string> => {
      if (teachInFlight.current) return ''
      teachInFlight.current = true
      try {
        const res = await fetch('/api/lio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childName, age, world,
            event: 'wrong',
            mode: 'teach',
            ...opts,
          } satisfies LioRequestBody),
        })
        const data = await res.json()
        return (data.message as string) ?? ''
      } catch {
        return ''
      } finally {
        teachInFlight.current = false
      }
    },
    [childName, age, world]
  )

  // ─── Hint message (indirect clue) ────────────────────────────
  const hint = useCallback(
    async (opts: TeachOptions): Promise<string> => {
      try {
        const res = await fetch('/api/lio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childName, age, world,
            event: 'wrong',
            mode: 'hint',
            ...opts,
          } satisfies LioRequestBody),
        })
        const data = await res.json()
        return (data.message as string) ?? ''
      } catch {
        return ''
      }
    },
    [childName, age, world]
  )

  // ─── Socratic question (makes child think) ───────────────────
  const socratic = useCallback(
    async (opts: TeachOptions): Promise<string> => {
      try {
        const res = await fetch('/api/lio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childName, age, world,
            event: 'wrong',
            mode: 'socratic',
            ...opts,
          } satisfies LioRequestBody),
        })
        const data = await res.json()
        return (data.message as string) ?? ''
      } catch {
        return ''
      }
    },
    [childName, age, world]
  )

  return { ask, teach, hint, socratic }
}
