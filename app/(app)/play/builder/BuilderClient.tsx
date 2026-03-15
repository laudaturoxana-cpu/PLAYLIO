'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBuilderRoom } from '@/lib/builder/useBuilderRoom'
import { ITEM_MAP, ROOMS, type BuilderItem, type Room } from '@/lib/builder/items'
import RoomCanvas from '@/components/builder/RoomCanvas'
import ItemDrawer from '@/components/builder/ItemDrawer'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import BuilderLetterChallenge from '@/components/builder/BuilderLetterChallenge'
import { createClient } from '@/lib/supabase/client'

const BUILDER_TUTORIAL = [
  {
    emoji: '🏠',
    title: 'Choose a room!',
    description: 'You have 6 rooms to decorate: Bedroom, Kitchen, Bathroom, Living Room, Playroom and Garden!',
  },
  {
    emoji: '🛋️',
    title: 'Place furniture!',
    description: 'Pick an item from the drawer below, then tap the room to place it where you want!',
  },
  {
    emoji: '🪙',
    title: 'Unlock more rooms!',
    description: 'Earn coins by learning letters and exploring adventures, then unlock new rooms!',
  },
]

interface BuilderClientProps {
  userId: string
  profileName: string
  initialCoins: number
  ownedItemIds: string[]
  unlockedRoomIds: string[]
}

export default function BuilderClient({
  userId,
  profileName,
  initialCoins,
  ownedItemIds,
  unlockedRoomIds: initialUnlocked,
}: BuilderClientProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [coins, setCoins] = useState(initialCoins)
  const [unlockedRoomIds, setUnlockedRoomIds] = useState<string[]>(
    initialUnlocked.length > 0 ? initialUnlocked : ['bedroom']
  )
  const [unlocking, setUnlocking] = useState<string | null>(null)

  async function handleUnlockRoom(room: Room) {
    if (coins < room.requiredCoins) return
    setUnlocking(room.id)
    try {
      const supabase = createClient()
      await supabase.rpc('add_coins', {
        p_user_id: userId,
        p_amount: -room.requiredCoins,
        p_reason: `unlock_room_${room.id}`,
        p_world: 'builder',
      })
      const newUnlocked = [...unlockedRoomIds, room.id]
      setUnlockedRoomIds(newUnlocked)
      setCoins(c => c - room.requiredCoins)
      // Save unlocked rooms
      await supabase.from('builder_state').upsert({
        user_id: userId,
        room_data: {},
        unlocked_rooms: newUnlocked,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } catch {
      // silent
    }
    setUnlocking(null)
  }

  if (!selectedRoom) {
    return (
      <RoomSelector
        profileName={profileName}
        coins={coins}
        unlockedRoomIds={unlockedRoomIds}
        unlocking={unlocking}
        onSelectRoom={setSelectedRoom}
        onUnlockRoom={handleUnlockRoom}
      />
    )
  }

  return (
    <RoomBuilder
      room={selectedRoom}
      userId={userId}
      profileName={profileName}
      coins={coins}
      onCoinsChange={setCoins}
      ownedItemIds={ownedItemIds}
      onBack={() => setSelectedRoom(null)}
    />
  )
}

// ─── Room Selector ─────────────────────────────────────────────────────────────

function RoomSelector({
  profileName,
  coins,
  unlockedRoomIds,
  unlocking,
  onSelectRoom,
  onUnlockRoom,
}: {
  profileName: string
  coins: number
  unlockedRoomIds: string[]
  unlocking: string | null
  onSelectRoom: (room: Room) => void
  onUnlockRoom: (room: Room) => void
}) {
  return (
    <div className="min-h-screen px-4 py-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <HowToPlayOverlay
        storageKey="howtoplay_builder"
        worldColor="#29B6F6"
        steps={BUILDER_TUTORIAL}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation', color: 'var(--gray)' }}
          aria-label="Back"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold" style={{ color: '#29B6F6' }}>
            🏗️ Builder World
          </h1>
          <p className="font-nunito text-xs" style={{ color: 'var(--gray)' }}>
            {profileName}&apos;s House
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full px-3 py-1.5" style={{ backgroundColor: '#FFF8E1' }}>
          <span className="text-sm">🪙</span>
          <span className="font-fredoka text-sm font-semibold" style={{ color: '#F57F17' }}>{coins}</span>
        </div>
      </div>

      {/* Lio message */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0" style={{ animation: 'bounce-soft 1.5s infinite' }}>🦁</span>
        <p className="font-nunito text-sm" style={{ color: 'var(--dark)' }}>
          Hi, {profileName}! Choose a room to decorate! Each room has special furniture! 🏠
        </p>
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ROOMS.map(room => {
          const unlocked = unlockedRoomIds.includes(room.id)
          const canAfford = coins >= room.requiredCoins
          const isUnlocking = unlocking === room.id

          return (
            <button
              key={room.id}
              onClick={() => {
                if (unlocked) onSelectRoom(room)
                else if (canAfford) onUnlockRoom(room)
              }}
              disabled={(!unlocked && !canAfford) || isUnlocking}
              className="flex flex-col items-start rounded-3xl p-4 text-left transition-all active:scale-95 border"
              style={{
                touchAction: 'manipulation',
                background: unlocked ? room.bgGradient : 'white',
                borderColor: unlocked ? `${room.color}40` : 'rgba(0,0,0,0.06)',
                opacity: !unlocked && !canAfford ? 0.6 : 1,
                boxShadow: unlocked ? `0 2px 12px ${room.color}22` : 'none',
                minHeight: '110px',
              }}
              aria-label={`${room.name}${!unlocked ? ` — ${room.requiredCoins} coins to unlock` : ''}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-3xl">{room.emoji}</span>
                {!unlocked && (
                  <span
                    className="font-nunito text-[10px] font-semibold rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: canAfford ? `${room.color}22` : 'rgba(0,0,0,0.06)',
                      color: canAfford ? room.color : 'var(--gray)',
                    }}
                  >
                    {canAfford ? `🔓 ${room.requiredCoins}🪙` : `🔒 ${room.requiredCoins}🪙`}
                  </span>
                )}
                {unlocked && (
                  <span className="text-base">✅</span>
                )}
              </div>
              <p
                className="font-fredoka text-base font-semibold"
                style={{ color: unlocked ? room.color : 'var(--gray)' }}
              >
                {room.name}
              </p>
              <p className="font-nunito text-[10px]" style={{ color: 'var(--gray)' }}>
                {unlocked ? room.description : canAfford ? 'Tap to unlock!' : 'Earn more coins'}
              </p>
              {isUnlocking && (
                <span className="text-xs mt-1" style={{ color: room.color }}>Unlocking...</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="h-6" />
    </div>
  )
}

// ─── Room Builder ──────────────────────────────────────────────────────────────

function RoomBuilder({
  room,
  userId,
  profileName,
  coins: initialCoins,
  onCoinsChange,
  ownedItemIds,
  onBack,
}: {
  room: Room
  userId: string
  profileName: string
  coins: number
  onCoinsChange: (fn: (c: number) => number) => void
  ownedItemIds: string[]
  onBack: () => void
}) {
  const {
    room: roomState,
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
    gridCols,
    gridRows,
  } = useBuilderRoom(userId, room.id, initialCoins)

  // Challenge state
  const [pendingItem, setPendingItem] = useState<BuilderItem | null>(null)
  const [bonusCoins, setBonusCoins] = useState(0)

  function handleItemSelect(item: BuilderItem | null) {
    if (item && item.category !== 'wallpaper') {
      setPendingItem(item)
    } else {
      setSelectedItem(item)
    }
  }

  function handleChallengeCorrect() {
    if (!pendingItem) return
    setBonusCoins(b => b + 5)
    setSelectedItem(pendingItem)
    setPendingItem(null)
  }

  function handleChallengeSkip() {
    if (!pendingItem) return
    setSelectedItem(pendingItem)
    setPendingItem(null)
  }

  function handleCellTap(col: number, row: number) {
    if (!selectedItem) return
    if (selectedItem.category === 'wallpaper') {
      changeWallpaper(selectedItem.id)
      setSelectedItem(null)
      return
    }
    const success = placeItem(selectedItem, col, row)
    if (success) setSelectedItem(null)
  }

  function handleItemTap(uid: string) {
    if (selectedItem) return
    removeItem(uid)
  }

  async function handleSave() {
    await syncToSupabase()
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-5xl" style={{ animation: 'bounce-soft 1s infinite' }}>{room.emoji}</span>
      </div>
    )
  }

  const rareCount = roomState.placedItems.filter(p => ITEM_MAP.get(p.itemId)?.isRare).length

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 gap-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation', color: 'var(--gray)' }}
          aria-label="Back to rooms"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="font-fredoka text-lg font-semibold" style={{ color: room.color }}>
            {room.emoji} {profileName}&apos;s {room.name}
          </h1>
          {rareCount > 0 && (
            <p className="font-nunito text-xs" style={{ color: 'var(--sun-dark)' }}>
              ✨ {rareCount} rare items!
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-full px-2 py-1" style={{ backgroundColor: '#FFF8E1' }}>
            <span className="text-sm">🪙</span>
            <span className="font-fredoka text-sm font-semibold" style={{ color: '#F57F17' }}>
              {coins}
            </span>
          </div>
          {isDirty && (
            <button
              onClick={handleSave}
              className="font-nunito text-[10px] underline"
              style={{ touchAction: 'manipulation', color: 'var(--sky)' }}
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Letter challenge */}
      {pendingItem && (
        <BuilderLetterChallenge
          item={pendingItem}
          onCorrect={handleChallengeCorrect}
          onSkip={handleChallengeSkip}
        />
      )}

      {bonusCoins > 0 && (
        <div
          className="rounded-2xl px-4 py-2 text-center"
          style={{ backgroundColor: 'rgba(255,213,79,0.18)', animation: 'slide-up 0.3s ease' }}
        >
          <p className="font-nunito text-sm font-semibold" style={{ color: '#F57F17' }}>
            🎉 +{bonusCoins} bonus coins from challenges!
          </p>
        </div>
      )}

      {/* Lio comment */}
      {lioComment && (
        <div
          className="rounded-2xl px-4 py-2 text-center border"
          style={{
            backgroundColor: `${room.color}12`,
            borderColor: `${room.color}30`,
            animation: 'slide-up 0.3s ease',
          }}
        >
          <p className="font-nunito text-sm font-semibold" style={{ color: room.color }}>
            🦁 {lioComment}
          </p>
        </div>
      )}

      {/* Selected item indicator */}
      {selectedItem && (
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-2"
          style={{ backgroundColor: room.color, animation: 'slide-up 0.2s ease' }}
        >
          <p className="font-nunito text-sm font-semibold text-white">
            Tap the room to place {selectedItem.emoji}
          </p>
          <button
            onClick={() => setSelectedItem(null)}
            className="ml-2 text-white/80 font-bold text-lg"
            style={{ touchAction: 'manipulation', minWidth: '32px', minHeight: '32px' }}
            aria-label="Cancel"
          >
            ✕
          </button>
        </div>
      )}

      {/* Room canvas */}
      <RoomCanvas
        room={roomState}
        selectedItem={selectedItem}
        onCellTap={handleCellTap}
        onItemTap={handleItemTap}
        gridCols={gridCols}
        gridRows={gridRows}
      />

      {!selectedItem && roomState.placedItems.length > 0 && (
        <p className="font-nunito text-xs text-center" style={{ color: 'var(--gray)' }}>
          Tap an item in the room to remove it (50% coins refund)
        </p>
      )}

      {/* Item drawer */}
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-4">
        <ItemDrawer
          roomId={room.id}
          coins={coins}
          selectedItem={selectedItem}
          onSelect={(item: BuilderItem | null) => handleItemSelect(item)}
          ownedItemIds={ownedItemIds}
        />
      </div>

      <div className="h-4" />
    </div>
  )
}
