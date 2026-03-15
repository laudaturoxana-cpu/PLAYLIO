'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBuilderRoom } from '@/lib/builder/useBuilderRoom'
import { ITEM_MAP, type BuilderItem } from '@/lib/builder/items'
import RoomCanvas from '@/components/builder/RoomCanvas'
import ItemDrawer from '@/components/builder/ItemDrawer'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import BuilderLetterChallenge from '@/components/builder/BuilderLetterChallenge'

const BUILDER_TUTORIAL = [
  {
    emoji: '🛋️',
    title: 'Decorate your room!',
    description: 'Pick an item from the drawer below, then tap the room to place it where you want!',
  },
  {
    emoji: '🪙',
    title: 'Spend your coins!',
    description: 'Each item costs coins. You earn coins by learning letters and exploring adventures!',
  },
  {
    emoji: '✨',
    title: 'Find rare items!',
    description: 'Some items have a golden ✨ Rare badge — they\'re special! Can you collect them all?',
  },
]

interface BuilderClientProps {
  userId: string
  profileName: string
  initialCoins: number
  ownedItemIds: string[]
}

export default function BuilderClient({
  userId,
  profileName,
  initialCoins,
  ownedItemIds,
}: BuilderClientProps) {
  const {
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
    gridCols,
    gridRows,
  } = useBuilderRoom(userId, initialCoins)

  // Challenge state: show letter quiz when selecting a furniture/decoration item
  const [pendingItem, setPendingItem] = useState<BuilderItem | null>(null)
  const [bonusCoins, setBonusCoins] = useState(0)

  function handleItemSelect(item: BuilderItem | null) {
    if (item && item.category !== 'wallpaper') {
      setPendingItem(item)   // show challenge first
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
    if (selectedItem) return  // in placement mode, ignore taps on items
    // Confirm removal with a single click (no modal — children don't read)
    removeItem(uid)
  }

  async function handleSave() {
    await syncToSupabase()
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-5xl" style={{ animation: 'bounce-soft 1s infinite' }}>🏗️</span>
      </div>
    )
  }

  const rareCount = room.placedItems.filter(p => ITEM_MAP.get(p.itemId)?.isRare).length

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 gap-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <HowToPlayOverlay
        storageKey="howtoplay_builder"
        worldColor="#29B6F6"
        steps={BUILDER_TUTORIAL}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Back"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-lg font-semibold text-[var(--sky-dark)]">
            🏗️ {profileName}'s Room
          </h1>
          {rareCount > 0 && (
            <p className="font-nunito text-xs text-[var(--sun-dark)]">
              ✨ {rareCount} rare items!
            </p>
          )}
        </div>
        {/* Coins + Save */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-[var(--sun-light,#FFF8E1)]">
            <span className="text-sm">🪙</span>
            <span className="font-fredoka text-sm font-semibold text-[var(--sun-dark)]">
              {coins}
            </span>
          </div>
          {isDirty && (
            <button
              onClick={handleSave}
              className="font-nunito text-[10px] text-[var(--sky)] underline"
              style={{ touchAction: 'manipulation' }}
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Letter challenge — shown before placing item */}
      {pendingItem && (
        <BuilderLetterChallenge
          item={pendingItem}
          onCorrect={handleChallengeCorrect}
          onSkip={handleChallengeSkip}
        />
      )}

      {/* Bonus coins earned banner */}
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
          className="rounded-2xl bg-[var(--sky)]/10 border border-[var(--sky)]/20 px-4 py-2 text-center"
          style={{ animation: 'slide-up 0.3s ease' }}
        >
          <p className="font-nunito text-sm font-semibold text-[var(--sky-dark)]">
            🦁 {lioComment}
          </p>
        </div>
      )}

      {/* Selected item indicator */}
      {selectedItem && (
        <div
          className="flex items-center justify-between rounded-2xl bg-[var(--sky)] px-4 py-2"
          style={{ animation: 'slide-up 0.2s ease' }}
        >
          <p className="font-nunito text-sm font-semibold text-white">
            Tap the room where you want to place {selectedItem.emoji}
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
        room={room}
        selectedItem={selectedItem}
        onCellTap={handleCellTap}
        onItemTap={handleItemTap}
        gridCols={gridCols}
        gridRows={gridRows}
      />

      {/* Remove hint */}
      {!selectedItem && room.placedItems.length > 0 && (
        <p className="font-nunito text-xs text-[var(--gray)] text-center">
          Tap an item in the room to remove it (50% coins refund)
        </p>
      )}

      {/* Item drawer */}
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-4">
        <ItemDrawer
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
