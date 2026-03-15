'use client'

import { useRef, useCallback } from 'react'

// Web Audio API — no external libraries, no audio files needed.
// All sounds are synthesized in real-time (works offline).

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  } catch {
    return null
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.4,
  startTime = ctx.currentTime,
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec)
  osc.start(startTime)
  osc.stop(startTime + durationSec)
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  function ctx(): AudioContext | null {
    if (!ctxRef.current) ctxRef.current = getAudioContext()
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  const playCorrect = useCallback(() => {
    const c = ctx()
    if (!c) return
    // Pleasant ascending two-note "ding ding"
    playTone(c, 523, 0.18, 'sine', 0.35)              // C5
    playTone(c, 784, 0.22, 'sine', 0.3, c.currentTime + 0.15)  // G5
  }, [])

  const playWrong = useCallback(() => {
    const c = ctx()
    if (!c) return
    // Low "bwong" — two descending notes
    playTone(c, 220, 0.18, 'triangle', 0.3)            // A3
    playTone(c, 165, 0.25, 'triangle', 0.25, c.currentTime + 0.14) // E3
  }, [])

  const playLevelUp = useCallback(() => {
    const c = ctx()
    if (!c) return
    // Ascending arpeggio C-E-G-C
    const notes = [261, 329, 392, 523]
    notes.forEach((freq, i) => {
      playTone(c, freq, 0.22, 'sine', 0.3, c.currentTime + i * 0.1)
    })
  }, [])

  const playCoin = useCallback(() => {
    const c = ctx()
    if (!c) return
    // Short bright "ting"
    playTone(c, 1046, 0.12, 'sine', 0.2)  // C6
  }, [])

  const playStarCollect = useCallback(() => {
    const c = ctx()
    if (!c) return
    playTone(c, 880, 0.08, 'sine', 0.25)             // A5
    playTone(c, 1318, 0.15, 'sine', 0.2, c.currentTime + 0.07) // E6
  }, [])

  return { playCorrect, playWrong, playLevelUp, playCoin, playStarCollect }
}
