'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { JumpLevel } from './levels'
import { calculateStars } from './levels'

// ─── Scene constants (exported for canvas) ───────────────────
export const SCENE_W = 360
export const SCENE_H = 480
export const GROUND_Y = 400      // Y of ground surface (feet rest here)
export const CHAR_H = 44
export const CHAR_W = 32
export const CHAR_SCREEN_X = 80  // fixed horizontal position of character

const GRAVITY    = 0.62
const JUMP_VEL   = -13.5
const JUMP_VEL_2 = -11.5   // double-jump is slightly weaker
const MAX_FALL   = 18

export interface JumpGameState {
  charY: number          // Y of character's feet (screen px)
  distance: number       // how far Lio has run (world px)
  hearts: number         // remaining lives
  invincible: boolean    // brief after a hit
  collectedCoinIds: Set<string>
  isRunning: boolean
  isDead: boolean
  isComplete: boolean
  score: number          // coins collected
  stars: number
}

export function useJumpGame(level: JumpLevel, maxHearts: number) {
  const [charY, setCharY]   = useState(GROUND_Y)
  const [distance, setDist] = useState(0)
  const [hearts, setHearts] = useState(maxHearts)
  const [invincible, setInvincible] = useState(false)
  const [collectedCoinIds, setCollected] = useState<Set<string>>(new Set())
  const [isRunning, setIsRunning] = useState(false)
  const [isDead, setIsDead]       = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Physics refs (avoid stale closures in rAF loop)
  const charYRef    = useRef(GROUND_Y)
  const vyRef       = useRef(0)
  const onGroundRef = useRef(true)
  const jumpsUsedRef = useRef(0)  // 0=on ground, 1=first jump, 2=double-jumped
  const distRef     = useRef(0)
  const heartsRef   = useRef(maxHearts)
  const invRef      = useRef(false)
  const collRef     = useRef<Set<string>>(new Set())
  const runRef      = useRef(false)
  const rafRef      = useRef<number | null>(null)

  const score = collectedCoinIds.size
  const stars = calculateStars(hearts, isComplete)

  // ─── Physics loop ───────────────────────────────────────────
  function physicsStep() {
    if (!runRef.current) return

    // 1. Auto-run forward
    distRef.current += level.runSpeed

    // 2. Check WIN
    if (distRef.current >= level.trackLength) {
      runRef.current = false
      setIsRunning(false)
      setIsComplete(true)
      setDist(distRef.current)
      return
    }

    // 3. Vertical physics
    vyRef.current = Math.min(vyRef.current + GRAVITY, MAX_FALL)
    charYRef.current = Math.min(charYRef.current + vyRef.current, GROUND_Y)

    if (charYRef.current >= GROUND_Y) {
      charYRef.current = GROUND_Y
      vyRef.current    = 0
      onGroundRef.current = true
      jumpsUsedRef.current = 0
    } else {
      onGroundRef.current = false
    }

    // 4. Obstacle collision (skip if invincible)
    if (!invRef.current) {
      outer: for (const obs of level.obstacles) {
        const screenX = obs.x - distRef.current
        if (screenX > SCENE_W + 10) continue      // not visible yet
        if (screenX + obs.width < -10) continue   // already passed

        // Character hitbox (forgiving: 6px margin each side)
        const cL = CHAR_SCREEN_X + 6
        const cR = CHAR_SCREEN_X + CHAR_W - 6
        const cT = charYRef.current - CHAR_H + 8
        const cB = charYRef.current - 2

        // Obstacle hitbox (forgiving: 4px margin)
        const oL = screenX + 4
        const oR = screenX + obs.width - 4
        const oT = GROUND_Y - obs.height + 4
        const oB = GROUND_Y

        if (cR > oL && cL < oR && cB > oT && cT < oB) {
          // HIT — lose a heart, go invincible
          const newH = heartsRef.current - 1
          heartsRef.current = newH
          setHearts(newH)
          invRef.current = true
          setInvincible(true)

          if (newH <= 0) {
            runRef.current = false
            setIsRunning(false)
            setIsDead(true)
            setDist(distRef.current)
            setCharY(charYRef.current)
            return
          }

          // Stumble bounce
          vyRef.current = -6

          // Clear invincibility after 1.5s
          setTimeout(() => {
            invRef.current = false
            setInvincible(false)
          }, 1500)
          break outer
        }
      }
    }

    // 5. Coin collection
    const charCX = CHAR_SCREEN_X + CHAR_W / 2
    const charCY = charYRef.current - CHAR_H / 2
    let changed = false
    const newSet = new Set(collRef.current)

    for (const coin of level.coins) {
      if (newSet.has(coin.id)) continue
      const cx = coin.x - distRef.current + 8
      const cy = GROUND_Y - coin.airY - 10
      const dx = charCX - cx
      const dy = charCY - cy
      if (dx * dx + dy * dy < 24 * 24) {
        newSet.add(coin.id)
        changed = true
      }
    }

    if (changed) {
      collRef.current = newSet
      setCollected(new Set(newSet))
    }

    // 6. Push state to React (triggers re-render / canvas update)
    setCharY(charYRef.current)
    setDist(distRef.current)

    rafRef.current = requestAnimationFrame(physicsStep)
  }

  // ─── Controls ───────────────────────────────────────────────
  const jump = useCallback(() => {
    if (!runRef.current) return
    if (jumpsUsedRef.current === 0) {
      // First jump (on ground)
      vyRef.current        = JUMP_VEL
      onGroundRef.current  = false
      jumpsUsedRef.current = 1
    } else if (jumpsUsedRef.current === 1) {
      // Double-jump (in the air, once only)
      vyRef.current        = JUMP_VEL_2
      jumpsUsedRef.current = 2
    }
  }, [])

  // ─── Start / Restart ─────────────────────────────────────────
  const startGame = useCallback(() => {
    // Reset refs
    charYRef.current     = GROUND_Y
    vyRef.current        = 0
    onGroundRef.current  = true
    jumpsUsedRef.current = 0
    distRef.current      = 0
    heartsRef.current    = maxHearts
    invRef.current       = false
    collRef.current      = new Set()
    runRef.current       = true

    // Reset state
    setCharY(GROUND_Y)
    setDist(0)
    setHearts(maxHearts)
    setInvincible(false)
    setCollected(new Set())
    setIsRunning(true)
    setIsDead(false)
    setIsComplete(false)

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(physicsStep)
  }, [level, maxHearts]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      runRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    charY,
    distance,
    hearts,
    maxHearts,
    invincible,
    collectedCoinIds,
    isRunning,
    isDead,
    isComplete,
    score,
    stars,
    startGame,
    jump,
  }
}
