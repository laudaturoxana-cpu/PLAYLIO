'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { JumpLevel, Platform } from './levels'
import { calculateStars } from './levels'

// Scene dimensions (px) — fixed for consistent physics
export const SCENE_W = 360
export const SCENE_H = 480

// Character
const CHAR_W = 32
const CHAR_H = 36
const GRAVITY = 0.55
const JUMP_VEL = -13
const MOVE_SPEED = 4
const MAX_FALL = 18

interface Vec2 { x: number; y: number }

export interface CharState {
  pos: Vec2
  vel: Vec2
  onGround: boolean
  facing: 'left' | 'right'
  isJumping: boolean
}

export interface MovingPlatformState {
  x: number
  dir: 1 | -1
}

export interface GameState {
  char: CharState
  collectedCoinIds: Set<string>
  movingPlatforms: MovingPlatformState[]
  timeLeft: number
  isRunning: boolean
  isDead: boolean
  isComplete: boolean
  score: number    // coins collected
  stars: number
}

export interface Controls {
  left: boolean
  right: boolean
  jump: boolean
}

function platformToPixels(p: Platform): { x: number; y: number; w: number; h: number } {
  return {
    x: (p.x / 100) * SCENE_W,
    y: (p.y / 100) * SCENE_H,
    w: (p.width / 100) * SCENE_W,
    h: p.isGround ? 20 : 14,
  }
}

function coinToPixels(cx: number, cy: number): { x: number; y: number } {
  return {
    x: (cx / 100) * SCENE_W,
    y: (cy / 100) * SCENE_H,
  }
}

export function useJumpGame(level: JumpLevel) {
  const [char, setChar] = useState<CharState>({
    pos: { x: 40, y: SCENE_H - 120 },
    vel: { x: 0, y: 0 },
    onGround: false,
    facing: 'right',
    isJumping: false,
  })
  const [collectedCoinIds, setCollectedCoinIds] = useState<Set<string>>(new Set())
  const [movingPlatforms, setMovingPlatforms] = useState<MovingPlatformState[]>(
    level.platforms.map(p => ({ x: (p.x / 100) * SCENE_W, dir: 1 as 1 | -1 }))
  )
  const [timeLeft, setTimeLeft] = useState(level.timeLimit)
  const [isRunning, setIsRunning] = useState(false)
  const [isDead, setIsDead] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const controlsRef = useRef<Controls>({ left: false, right: false, jump: false })
  const rafRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const charRef = useRef(char)
  charRef.current = char
  const movingRef = useRef(movingPlatforms)
  movingRef.current = movingPlatforms
  const collectedRef = useRef(collectedCoinIds)
  collectedRef.current = collectedCoinIds
  const runningRef = useRef(false)

  const score = collectedCoinIds.size
  const stars = calculateStars(score, level.starThresholds)

  function getCurrentPlatforms(): { px: { x: number; y: number; w: number; h: number }; isGround: boolean }[] {
    return level.platforms.map((p, i) => {
      const px = platformToPixels(p)
      if (p.isMoving) {
        px.x = movingRef.current[i]?.x ?? px.x
      }
      return { px, isGround: !!p.isGround }
    })
  }

  function physicsStep() {
    const ctrl = controlsRef.current
    const c = charRef.current
    let { x, y } = c.pos
    let { x: vx, y: vy } = c.vel
    let onGround = false
    let facing = c.facing
    let isJumping = c.isJumping

    // Gravitație
    vy = Math.min(vy + GRAVITY, MAX_FALL)

    // Horizontal movement
    if (ctrl.left)  { vx = -MOVE_SPEED; facing = 'left' }
    else if (ctrl.right) { vx = MOVE_SPEED; facing = 'right' }
    else vx = 0

    x += vx
    y += vy

    // Platfome colidare
    const platforms = getCurrentPlatforms()
    for (const { px } of platforms) {
      // Top collision (aterizare)
      if (
        vx >= -MOVE_SPEED && vx <= MOVE_SPEED && // nu intrat din lateral
        x + CHAR_W > px.x &&
        x < px.x + px.w &&
        y + CHAR_H >= px.y &&
        y + CHAR_H <= px.y + px.h + MAX_FALL + 2 &&
        vy >= 0
      ) {
        y = px.y - CHAR_H
        vy = 0
        onGround = true
        isJumping = false
      }
    }

    // Salt
    if (ctrl.jump && onGround && !isJumping) {
      vy = JUMP_VEL
      isJumping = true
      onGround = false
      controlsRef.current.jump = false
    }

    // Bounds orizontale
    x = Math.max(0, Math.min(SCENE_W - CHAR_W, x))

    // Fell out of scene = mort
    if (y > SCENE_H + 50) {
      runningRef.current = false
      setIsDead(true)
      setIsRunning(false)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    // Coin collection
    const newCollected = new Set(collectedRef.current)
    for (const coin of level.coins) {
      if (newCollected.has(coin.id)) continue
      const cp = coinToPixels(coin.x, coin.y)
      if (
        x < cp.x + 16 && x + CHAR_W > cp.x &&
        y < cp.y + 16 && y + CHAR_H > cp.y
      ) {
        newCollected.add(coin.id)
      }
    }
    if (newCollected.size !== collectedRef.current.size) {
      setCollectedCoinIds(new Set(newCollected))
    }

    setChar({ pos: { x, y }, vel: { x: vx, y: vy }, onGround, facing, isJumping })

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(physicsStep)
    }
  }

  // Moving platforms
  function updateMovingPlatforms() {
    setMovingPlatforms(prev =>
      prev.map((state, i) => {
        const p = level.platforms[i]
        if (!p?.isMoving || !p.moveRange || !p.speed) return state
        const base = (p.x / 100) * SCENE_W
        const range = p.moveRange / 2
        let newX = state.x + p.speed * state.dir
        let dir = state.dir
        if (newX > base + range || newX < base - range) {
          dir = (dir * -1) as 1 | -1
          newX = state.x + p.speed * dir
        }
        return { x: newX, dir }
      })
    )
  }

  const startGame = useCallback(() => {
    setChar({
      pos: { x: 40, y: SCENE_H - 120 },
      vel: { x: 0, y: 0 },
      onGround: false,
      facing: 'right',
      isJumping: false,
    })
    setCollectedCoinIds(new Set())
    setMovingPlatforms(level.platforms.map(p => ({ x: (p.x / 100) * SCENE_W, dir: 1 })))
    setTimeLeft(level.timeLimit)
    setIsDead(false)
    setIsComplete(false)
    runningRef.current = true
    setIsRunning(true)

    rafRef.current = requestAnimationFrame(physicsStep)

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          runningRef.current = false
          setIsRunning(false)
          setIsComplete(true)
          if (rafRef.current) cancelAnimationFrame(rafRef.current)
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        updateMovingPlatforms()
        return t - 1
      })
    }, 1000)
  }, [level])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      runningRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const setControl = useCallback((key: keyof Controls, value: boolean) => {
    controlsRef.current[key] = value
  }, [])

  const jump = useCallback(() => {
    if (charRef.current.onGround) {
      controlsRef.current.jump = true
    }
  }, [])

  return {
    char,
    collectedCoinIds,
    movingPlatforms,
    timeLeft,
    isRunning,
    isDead,
    isComplete,
    score,
    stars,
    startGame,
    setControl,
    jump,
  }
}
