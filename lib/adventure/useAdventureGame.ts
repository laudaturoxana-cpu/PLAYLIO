'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Zone } from './zones'

// Tip local (compatibilitate)
interface ZoneItem {
  id: string
  emoji: string
  label: string
  points: number
}
import { getNearMissMessage } from './zones'

export interface FloatingItem {
  id: string            // itemId + unique suffix
  item: ZoneItem
  x: number             // % din lățimea ecranului
  y: number             // % din înălțimea zonei de joc
  scale: number
  rotation: number
  collected: boolean
  visible: boolean
}

export interface AdventureGameState {
  floatingItems: FloatingItem[]
  collectedStars: number
  totalStars: number
  coinsThisSession: number
  isRunning: boolean
  isComplete: boolean
  nearMissMessage: string | null
  secretVisible: boolean
  secretCollected: boolean
  timeLeft: number       // secunde (60s per zonă)
  idleSeconds: number    // pentru trigger secret idle_10s
  cloudTapCount: number  // pentru trigger tap_5x
}

interface UseAdventureGameOptions {
  zone: Zone
  savedStars: number     // progres anterior din localStorage
  onComplete: (stars: number, coins: number) => void
}

const GAME_DURATION = 60   // secunde
const SPAWN_INTERVAL = 1800 // ms între aparițiile noi
const MAX_VISIBLE = 6      // maxim obiecte vizibile simultan

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function generateFloatingItem(item: ZoneItem, index: number): FloatingItem {
  return {
    id: `${item.id}_${Date.now()}_${index}`,
    item,
    x: randomBetween(5, 85),
    y: randomBetween(10, 75),
    scale: randomBetween(0.9, 1.3),
    rotation: randomBetween(-15, 15),
    collected: false,
    visible: true,
  }
}

export function useAdventureGame({
  zone,
  savedStars,
  onComplete,
}: UseAdventureGameOptions) {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([])
  const [collectedStars, setCollectedStars] = useState(savedStars)
  const [coinsThisSession, setCoinsThisSession] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [nearMissMessage, setNearMissMessage] = useState<string | null>(null)
  const [secretVisible, setSecretVisible] = useState(false)
  const [secretCollected, setSecretCollected] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [idleSeconds, setIdleSeconds] = useState(0)
  const [cloudTapCount, setCloudTapCount] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const idleRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const collectedRef = useRef(savedStars)
  collectedRef.current = collectedStars

  // Auto-save la localStorage la fiecare schimbare de stele
  useEffect(() => {
    if (collectedStars > savedStars) {
      try {
        const key = `adventure_stars_${zone.id}`
        localStorage.setItem(key, String(collectedStars))
      } catch {
        // silențios
      }
    }
  }, [collectedStars, zone.id, savedStars])

  // Near-miss: mesaj Lio când progres parțial
  useEffect(() => {
    const msg = getNearMissMessage(collectedStars, zone.totalStars)
    setNearMissMessage(msg)
  }, [collectedStars, zone.totalStars])

  function spawnItems() {
    setFloatingItems(prev => {
      const visible = prev.filter(fi => !fi.collected && fi.visible)
      if (visible.length >= MAX_VISIBLE) return prev

      const toSpawn = Math.min(2, MAX_VISIBLE - visible.length)
      const newItems: FloatingItem[] = []
      for (let i = 0; i < toSpawn; i++) {
        const item = zone.items[Math.floor(Math.random() * zone.items.length)]
        newItems.push(generateFloatingItem(item, i))
      }
      return [...prev, ...newItems]
    })
  }

  const startGame = useCallback(() => {
    setIsRunning(true)
    setTimeLeft(GAME_DURATION)
    setFloatingItems([])

    // Spawn inițial
    const initial: FloatingItem[] = []
    for (let i = 0; i < 4; i++) {
      const item = zone.items[i % zone.items.length]
      initial.push(generateFloatingItem(item, i))
    }
    setFloatingItems(initial)

    // Timer countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopGame()
          return 0
        }
        return t - 1
      })
    }, 1000)

    // Spawn periodic
    spawnRef.current = setInterval(spawnItems, SPAWN_INTERVAL)

    // Idle counter (pentru secret idle_10s)
    if (zone.secret.trigger === 'idle_10s') {
      idleRef.current = setInterval(() => {
        setIdleSeconds(s => {
          const next = s + 1
          if (next >= 10) {
            setSecretVisible(true)
          }
          return next
        })
      }, 1000)
    }
  }, [zone])

  function stopGame() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (spawnRef.current) clearInterval(spawnRef.current)
    if (idleRef.current) clearInterval(idleRef.current)
    setIsRunning(false)
    setIsComplete(true)
    onComplete(collectedRef.current, 0)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (spawnRef.current) clearInterval(spawnRef.current)
      if (idleRef.current) clearInterval(idleRef.current)
    }
  }, [])

  const collectItem = useCallback((floatingId: string) => {
    // Reset idle counter la fiecare acțiune
    setIdleSeconds(0)

    setFloatingItems(prev =>
      prev.map(fi =>
        fi.id === floatingId ? { ...fi, collected: true, visible: false } : fi
      )
    )

    setFloatingItems(prev => {
      const fi = prev.find(f => f.id === floatingId)
      if (!fi) return prev

      const points = fi.item.points
      const coins = points * 2

      setCollectedStars(s => {
        const next = Math.min(s + points, zone.totalStars)
        if (next >= zone.totalStars) {
          // Completat!
          setTimeout(() => stopGame(), 500)
        }
        return next
      })
      setCoinsThisSession(c => c + coins)

      return prev
    })
  }, [zone.totalStars])

  const collectSecret = useCallback(() => {
    if (secretCollected) return
    setSecretCollected(true)
    setSecretVisible(false)
    setCoinsThisSession(c => c + zone.secret.rewardCoins)
  }, [secretCollected, zone.secret.rewardCoins])

  // Trigger tap_5x secret
  const handleCloudTap = useCallback(() => {
    if (zone.secret.trigger !== 'tap_5x') return
    const next = cloudTapCount + 1
    setCloudTapCount(next)
    if (next >= 5) {
      setSecretVisible(true)
    }
  }, [cloudTapCount, zone.secret.trigger])

  return {
    floatingItems,
    collectedStars,
    totalStars: zone.totalStars,
    coinsThisSession,
    isRunning,
    isComplete,
    nearMissMessage,
    secretVisible,
    secretCollected,
    timeLeft,
    idleSeconds,
    startGame,
    collectItem,
    collectSecret,
    handleCloudTap,
  }
}

// Carc progres salvat în localStorage pentru near-miss
export function loadSavedStars(zoneId: string): number {
  try {
    const val = localStorage.getItem(`adventure_stars_${zoneId}`)
    return val ? parseInt(val, 10) : 0
  } catch {
    return 0
  }
}
