'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Block } from './items'
import { createClient } from '@/lib/supabase/client'

export interface VoxelBlock {
  uid: string
  blockId: string
  x: number
  y: number
  z: number
}

export interface VoxelState {
  blocks: VoxelBlock[]
}

const GRID_SIZE  = 20   // -10 to +9 on X and Z
const MAX_HEIGHT = 10   // 0 to 9 on Y
const MAX_BLOCKS = 500  // performance cap

function makeUid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function storageKey(userId: string, sceneId: string) {
  return `voxel_scene_${userId}_${sceneId}`
}

function loadLocal(userId: string, sceneId: string): VoxelState | null {
  try {
    const raw = localStorage.getItem(storageKey(userId, sceneId))
    return raw ? (JSON.parse(raw) as VoxelState) : null
  } catch { return null }
}

function saveLocal(userId: string, sceneId: string, state: VoxelState) {
  try {
    localStorage.setItem(storageKey(userId, sceneId), JSON.stringify(state))
  } catch { /* storage full */ }
}

export function useVoxelScene(userId: string, sceneId: string) {
  const [state, setState]         = useState<VoxelState>({ blocks: [] })
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [lioComment, setLioComment]       = useState<string | null>(null)
  const [isDirty, setIsDirty]     = useState(false)
  const [isLoaded, setIsLoaded]   = useState(false)

  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const saved = loadLocal(userId, sceneId)
    if (saved) setState(saved)
    setIsLoaded(true)
  }, [userId, sceneId])

  // Auto-save every 10s
  useEffect(() => {
    if (!isLoaded) return
    const timer = setInterval(() => {
      saveLocal(userId, sceneId, stateRef.current)
    }, 10_000)
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

      const prev = (existing?.room_data as Record<string, unknown> | null) ?? {}
      const updated = { ...prev, [`voxel_${sceneId}`]: stateRef.current }

      await supabase.from('builder_state').upsert({
        user_id: userId,
        room_data: updated as import('@/lib/supabase/types').Json,
        unlocked_rooms: Object.keys(updated),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setIsDirty(false)
    } catch { /* silent */ }
  }, [isDirty, userId, sceneId])

  function isOccupied(x: number, y: number, z: number): boolean {
    return stateRef.current.blocks.some(b => b.x === x && b.y === y && b.z === z)
  }

  const placeVoxel = useCallback((block: Block, x: number, y: number, z: number): boolean => {
    // Bounds check
    if (x < -GRID_SIZE/2 || x >= GRID_SIZE/2) return false
    if (y < 0 || y >= MAX_HEIGHT) return false
    if (z < -GRID_SIZE/2 || z >= GRID_SIZE/2) return false
    if (stateRef.current.blocks.length >= MAX_BLOCKS) return false
    if (isOccupied(x, y, z)) return false

    const newBlock: VoxelBlock = { uid: makeUid(), blockId: block.id, x, y, z }
    setState(prev => {
      const next = { blocks: [...prev.blocks, newBlock] }
      saveLocal(userId, sceneId, next)
      return next
    })
    setIsDirty(true)

    const comments = [
      `${block.name} arată perfect! 🌟`,
      'Bravo! Construcția prinde formă! ✨',
      'Super alegere! 🎨',
      'Minunat! Creezi ceva unic! 🏗️',
      'Lio adoră ce construiești! 🦁',
    ]
    setLioComment(comments[Math.floor(Math.random() * comments.length)])
    setTimeout(() => setLioComment(null), 2500)
    return true
  }, [userId, sceneId]) // eslint-disable-line react-hooks/exhaustive-deps

  const removeVoxel = useCallback((uid: string) => {
    setState(prev => {
      const next = { blocks: prev.blocks.filter(b => b.uid !== uid) }
      saveLocal(userId, sceneId, next)
      return next
    })
    setIsDirty(true)
  }, [userId, sceneId])

  const clearScene = useCallback(() => {
    const empty: VoxelState = { blocks: [] }
    setState(empty)
    saveLocal(userId, sceneId, empty)
    setIsDirty(true)
    setLioComment('Spațiu gol! Construiește ceva nou! 🏗️')
    setTimeout(() => setLioComment(null), 2500)
  }, [userId, sceneId])

  return {
    state,
    selectedBlock,
    setSelectedBlock,
    lioComment,
    isDirty,
    isLoaded,
    blockCount: state.blocks.length,
    maxBlocks: MAX_BLOCKS,
    placeVoxel,
    removeVoxel,
    clearScene,
    syncToSupabase,
    gridSize: GRID_SIZE,
    maxHeight: MAX_HEIGHT,
  }
}
