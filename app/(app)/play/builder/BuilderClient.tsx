'use client'

import Link from 'next/link'
import { useBuilderRoom } from '@/lib/builder/useBuilderRoom'
import { ITEM_MAP, type BuilderItem } from '@/lib/builder/items'
import RoomCanvas from '@/components/builder/RoomCanvas'
import ItemDrawer from '@/components/builder/ItemDrawer'

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
    if (selectedItem) return  // în modul de plasare, ignorăm tap pe iteme
    // Confirmă ștergere cu un click simplu (fără modal — copiii nu citesc)
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
    <div className="min-h-screen flex flex-col px-4 py-4 max-w-sm mx-auto gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-lg font-semibold text-[var(--sky-dark)]">
            🏗️ Camera lui {profileName}
          </h1>
          {rareCount > 0 && (
            <p className="font-nunito text-xs text-[var(--sun-dark)]">
              ✨ {rareCount} obiecte rare!
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
              Salvează
            </button>
          )}
        </div>
      </div>

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

      {/* Item selectat indicator */}
      {selectedItem && (
        <div
          className="flex items-center justify-between rounded-2xl bg-[var(--sky)] px-4 py-2"
          style={{ animation: 'slide-up 0.2s ease' }}
        >
          <p className="font-nunito text-sm font-semibold text-white">
            Atinge camera unde vrei să pui {selectedItem.emoji}
          </p>
          <button
            onClick={() => setSelectedItem(null)}
            className="ml-2 text-white/80 font-bold text-lg"
            style={{ touchAction: 'manipulation', minWidth: '32px', minHeight: '32px' }}
            aria-label="Anulează"
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

      {/* Hint remove */}
      {!selectedItem && room.placedItems.length > 0 && (
        <p className="font-nunito text-xs text-[var(--gray)] text-center">
          Atinge un obiect din cameră pentru a-l elimina (50% coins înapoi)
        </p>
      )}

      {/* Item drawer */}
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-4">
        <ItemDrawer
          coins={coins}
          selectedItem={selectedItem}
          onSelect={(item: BuilderItem | null) => setSelectedItem(item)}
          ownedItemIds={ownedItemIds}
        />
      </div>

      <div className="h-4" />
    </div>
  )
}
