'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ITEM_MAP, DEFAULT_WALLPAPER, type BuilderItem } from './items'
import { createClient } from '@/lib/supabase/client'

export interface PlacedItem {
  uid: string
  itemId: string
  col: number
  row: number
}

export interface RoomState {
  wallpaperId: string
  placedItems: PlacedItem[]
}

const GRID_COLS = 6
const GRID_ROWS = 4
const AUTO_SAVE_INTERVAL = 10_000

function makeUid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function loadFromLocalStorage(userId: string, roomId: string): RoomState | null {
  try {
    const raw = localStorage.getItem(`builder_room_${userId}_${roomId}`)
    return raw ? (JSON.parse(raw) as RoomState) : null
  } catch {
    return null
  }
}

function saveToLocalStorage(userId: string, roomId: string, state: RoomState) {
  try {
    localStorage.setItem(`builder_room_${userId}_${roomId}`, JSON.stringify(state))
  } catch {
    // silent
  }
}

export function useBuilderRoom(userId: string, roomId: string, initialCoins: number) {
  const [room, setRoom] = useState<RoomState>({
    wallpaperId: DEFAULT_WALLPAPER,
    placedItems: [],
  })
  const [coins, setCoins] = useState(initialCoins)
  const [selectedItem, setSelectedItem] = useState<BuilderItem | null>(null)
  const [lioComment, setLioComment] = useState<string | null>(null)
  const [isFirstDecoration, setIsFirstDecoration] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const roomRef = useRef(room)
  roomRef.current = room

  useEffect(() => {
    const saved = loadFromLocalStorage(userId, roomId)
    if (saved) {
      setRoom(saved)
      if (saved.placedItems.length > 0) setIsFirstDecoration(false)
    }
    setIsLoaded(true)
  }, [userId, roomId])

  useEffect(() => {
    if (!isLoaded) return
    const timer = setInterval(() => {
      saveToLocalStorage(userId, roomId, roomRef.current)
    }, AUTO_SAVE_INTERVAL)
    return () => clearInterval(timer)
  }, [userId, roomId, isLoaded])

  const syncToSupabase = useCallback(async () => {
    if (!isDirty) return
    try {
      const supabase = createClient()
      // Read existing rooms_data first
      const { data: existing } = await supabase
        .from('builder_state')
        .select('room_data')
        .eq('user_id', userId)
        .single()

      const existingRooms = (existing?.room_data as Record<string, RoomState> | null) ?? {}
      const updatedRooms = {
        ...existingRooms,
        [roomId]: roomRef.current,
      }

      await supabase.from('builder_state').upsert({
        user_id: userId,
        room_data: updatedRooms as unknown as import('@/lib/supabase/types').Json,
        unlocked_rooms: Object.keys(updatedRooms),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setIsDirty(false)
    } catch {
      // silent
    }
  }, [isDirty, userId, roomId])

  function canPlace(item: BuilderItem, col: number, row: number): boolean {
    if (col + item.width > GRID_COLS) return false
    if (row + item.height > GRID_ROWS) return false
    for (const placed of room.placedItems) {
      const pi = ITEM_MAP.get(placed.itemId)
      if (!pi) continue
      const colOverlap = col < placed.col + pi.width && col + item.width > placed.col
      const rowOverlap = row < placed.row + pi.height && row + item.height > placed.row
      if (colOverlap && rowOverlap) return false
    }
    return true
  }

  const placeItem = useCallback((item: BuilderItem, col: number, row: number) => {
    if (!canPlace(item, col, row)) return false
    if (coins < item.price) return false

    const newPlaced: PlacedItem = { uid: makeUid(), itemId: item.id, col, row }
    setRoom(prev => {
      const next = { ...prev, placedItems: [...prev.placedItems, newPlaced] }
      saveToLocalStorage(userId, roomId, next)
      return next
    })
    if (item.price > 0) setCoins(c => c - item.price)
    setIsDirty(true)

    if (isFirstDecoration) {
      setIsFirstDecoration(false)
      setLioComment(`WOW! ${item.name} looks amazing here! 🏠✨`)
      setTimeout(() => setLioComment(null), 3500)
    } else {
      const comments = [
        `${item.name} looks perfect there! 🌟`,
        `Wonderful! Your room is getting more beautiful! ✨`,
        `Great job! You're a talented decorator! 🎨`,
      ]
      setLioComment(comments[Math.floor(Math.random() * comments.length)])
      setTimeout(() => setLioComment(null), 2500)
    }

    return true
  }, [room, coins, userId, roomId, isFirstDecoration]) // eslint-disable-line react-hooks/exhaustive-deps

  const removeItem = useCallback((uid: string) => {
    setRoom(prev => {
      const removed = prev.placedItems.find(p => p.uid === uid)
      if (!removed) return prev
      const item = ITEM_MAP.get(removed.itemId)
      if (item && item.price > 0) setCoins(c => c + Math.floor(item.price / 2))
      const next = { ...prev, placedItems: prev.placedItems.filter(p => p.uid !== uid) }
      saveToLocalStorage(userId, roomId, next)
      return next
    })
    setIsDirty(true)
  }, [userId, roomId])

  const changeWallpaper = useCallback((wallpaperId: string) => {
    const item = ITEM_MAP.get(wallpaperId)
    if (item && item.price > coins) return
    if (item && item.price > 0) setCoins(c => c - item.price)
    setRoom(prev => {
      const next = { ...prev, wallpaperId }
      saveToLocalStorage(userId, roomId, next)
      return next
    })
    setIsDirty(true)
    setLioComment('Room redecorated! Looks fantastic! 🌈')
    setTimeout(() => setLioComment(null), 2500)
  }, [coins, userId, roomId])

  return {
    room,
    coins,
    selectedItem,
    setSelectedItem,
    lioComment,
    isLoaded,
    isDirty,
    placeItem,
    removeItem,
    changeWallpaper,
    syncToSupabase,
    canPlace,
    gridCols: GRID_COLS,
    gridRows: GRID_ROWS,
  }
}
