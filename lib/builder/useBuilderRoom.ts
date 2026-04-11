'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Block } from './items'
import { createClient } from '@/lib/supabase/client'

export interface PlacedBlock {
  uid: string
  blockId: string
  col: number
  row: number
}

export interface SceneState {
  placedBlocks: PlacedBlock[]
}

const GRID_COLS = 14
const GRID_ROWS = 9
const AUTO_SAVE_INTERVAL = 10_000

function makeUid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function loadFromLocalStorage(userId: string, sceneId: string): SceneState | null {
  try {
    const raw = localStorage.getItem(`builder_scene_${userId}_${sceneId}`)
    return raw ? (JSON.parse(raw) as SceneState) : null
  } catch {
    return null
  }
}

function saveToLocalStorage(userId: string, sceneId: string, state: SceneState) {
  try {
    localStorage.setItem(`builder_scene_${userId}_${sceneId}`, JSON.stringify(state))
  } catch {
    // silent — storage full
  }
}

export function useBuilderScene(userId: string, sceneId: string) {
  const [scene, setScene] = useState<SceneState>({ placedBlocks: [] })
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [lioComment, setLioComment] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [blockCount, setBlockCount] = useState(0)

  const sceneRef = useRef(scene)
  sceneRef.current = scene

  // Load din localStorage (offline-first)
  useEffect(() => {
    const saved = loadFromLocalStorage(userId, sceneId)
    if (saved) {
      setScene(saved)
      setBlockCount(saved.placedBlocks.length)
    }
    setIsLoaded(true)
  }, [userId, sceneId])

  // Auto-save la fiecare 10s
  useEffect(() => {
    if (!isLoaded) return
    const timer = setInterval(() => {
      saveToLocalStorage(userId, sceneId, sceneRef.current)
    }, AUTO_SAVE_INTERVAL)
    return () => clearInterval(timer)
  }, [userId, sceneId, isLoaded])

  const syncToSupabase = useCallback(async () => {
    if (!isDirty) return
    try {
      const supabase = createClient()
      const { data: existing } = await supabase
        .from('builder_state')
        .select('room_data')
        .eq('user_id', userId)
        .single()

      const existingScenes = (existing?.room_data as Record<string, SceneState> | null) ?? {}
      const updatedScenes = { ...existingScenes, [sceneId]: sceneRef.current }

      await supabase.from('builder_state').upsert({
        user_id: userId,
        room_data: updatedScenes as unknown as import('@/lib/supabase/types').Json,
        unlocked_rooms: Object.keys(updatedScenes),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setIsDirty(false)
    } catch {
      // silent — va încerca din nou
    }
  }, [isDirty, userId, sceneId])

  // Verifică dacă celula e ocupată
  function isCellOccupied(col: number, row: number): boolean {
    return scene.placedBlocks.some(b => b.col === col && b.row === row)
  }

  // Plasează bloc
  const placeBlock = useCallback((block: Block, col: number, row: number): boolean => {
    if (col < 0 || col >= GRID_COLS) return false
    if (row < 0 || row >= GRID_ROWS) return false

    // Verifică ocupare
    const alreadyOccupied = sceneRef.current.placedBlocks.some(
      b => b.col === col && b.row === row
    )
    if (alreadyOccupied) return false

    const newBlock: PlacedBlock = { uid: makeUid(), blockId: block.id, col, row }
    setScene(prev => {
      const next = { placedBlocks: [...prev.placedBlocks, newBlock] }
      saveToLocalStorage(userId, sceneId, next)
      return next
    })
    setBlockCount(c => c + 1)
    setIsDirty(true)

    // Lio comentariu
    const comments = [
      `${block.name} arată perfect! 🌟`,
      `Bravo! Continui să construiești! ✨`,
      `Super alegere! 🎨`,
      `Minunat! Creația ta prinde viață! 🏗️`,
    ]
    const comment = comments[blockCount % comments.length]
    setLioComment(comment)
    setTimeout(() => setLioComment(null), 2500)

    return true
  }, [userId, sceneId, blockCount]) // eslint-disable-line react-hooks/exhaustive-deps

  // Șterge bloc (tap pe bloc existent fără selecție)
  const removeBlock = useCallback((uid: string) => {
    setScene(prev => {
      const next = { placedBlocks: prev.placedBlocks.filter(b => b.uid !== uid) }
      saveToLocalStorage(userId, sceneId, next)
      return next
    })
    setBlockCount(c => Math.max(0, c - 1))
    setIsDirty(true)
  }, [userId, sceneId])

  // Înlocuiește bloc (suprascrie aceeași celulă cu alt tip)
  const replaceBlock = useCallback((block: Block, col: number, row: number): boolean => {
    setScene(prev => {
      const filtered = prev.placedBlocks.filter(b => !(b.col === col && b.row === row))
      const newBlock: PlacedBlock = { uid: makeUid(), blockId: block.id, col, row }
      const next = { placedBlocks: [...filtered, newBlock] }
      saveToLocalStorage(userId, sceneId, next)
      return next
    })
    setIsDirty(true)
    return true
  }, [userId, sceneId])

  // Șterge tot (buton clear)
  const clearScene = useCallback(() => {
    const empty: SceneState = { placedBlocks: [] }
    setScene(empty)
    setBlockCount(0)
    saveToLocalStorage(userId, sceneId, empty)
    setIsDirty(true)
    setLioComment('Grilă curată! Să construiești ceva nou! 🏗️')
    setTimeout(() => setLioComment(null), 2500)
  }, [userId, sceneId])

  return {
    scene,
    selectedBlock,
    setSelectedBlock,
    lioComment,
    isLoaded,
    isDirty,
    blockCount,
    placeBlock,
    removeBlock,
    replaceBlock,
    clearScene,
    syncToSupabase,
    isCellOccupied,
    gridCols: GRID_COLS,
    gridRows: GRID_ROWS,
  }
}
