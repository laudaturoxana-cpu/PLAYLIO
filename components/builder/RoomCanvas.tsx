'use client'

import { useState } from 'react'
import { ITEM_MAP, WALLPAPER_THEMES, DEFAULT_WALLPAPER } from '@/lib/builder/items'
import type { PlacedItem, RoomState } from '@/lib/builder/useBuilderRoom'
import type { BuilderItem } from '@/lib/builder/items'

interface RoomCanvasProps {
  room: RoomState
  selectedItem: BuilderItem | null
  onCellTap: (col: number, row: number) => void
  onItemTap: (uid: string) => void
  gridCols: number
  gridRows: number
}

export default function RoomCanvas({
  room,
  selectedItem,
  onCellTap,
  onItemTap,
  gridCols,
  gridRows,
}: RoomCanvasProps) {
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null)
  const theme = WALLPAPER_THEMES[room.wallpaperId] ?? WALLPAPER_THEMES[DEFAULT_WALLPAPER]
  const isDarkWall = room.wallpaperId === 'wall_stars' || room.wallpaperId === 'wall_galaxy'

  // Calculăm ocuparea grilei
  const occupiedMap = new Map<string, string>()  // "col,row" → uid
  for (const placed of room.placedItems) {
    const item = ITEM_MAP.get(placed.itemId)
    if (!item) continue
    for (let dc = 0; dc < item.width; dc++) {
      for (let dr = 0; dr < item.height; dr++) {
        occupiedMap.set(`${placed.col + dc},${placed.row + dr}`, placed.uid)
      }
    }
  }

  function isPlaceable(col: number, row: number): boolean {
    if (!selectedItem) return false
    if (col + selectedItem.width > gridCols) return false
    if (row + selectedItem.height > gridRows) return false
    for (let dc = 0; dc < selectedItem.width; dc++) {
      for (let dr = 0; dr < selectedItem.height; dr++) {
        if (occupiedMap.has(`${col + dc},${row + dr}`)) return false
      }
    }
    return true
  }

  function isHoveredCell(col: number, row: number): boolean {
    if (!hoveredCell || !selectedItem) return false
    const { col: hc, row: hr } = hoveredCell
    return (
      col >= hc && col < hc + selectedItem.width &&
      row >= hr && row < hr + selectedItem.height
    )
  }

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-md border border-black/08"
      style={{
        background: theme.bg,
        aspectRatio: '3/2',
      }}
    >
      {/* Floor line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 rounded-b-3xl opacity-30"
        style={{ background: theme.accent }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          padding: '8px',
          gap: '2px',
        }}
      >
        {Array.from({ length: gridRows }).map((_, row) =>
          Array.from({ length: gridCols }).map((_, col) => {
            const uid = occupiedMap.get(`${col},${row}`)
            const isOrigin = room.placedItems.find(p => p.col === col && p.row === row)
            const canPlace = isPlaceable(col, row)
            const isHovered = isHoveredCell(col, row)

            return (
              <div
                key={`${col},${row}`}
                className="relative rounded-lg transition-all"
                style={{
                  backgroundColor: isHovered && canPlace
                    ? `${theme.accent}44`
                    : isHovered && !canPlace
                    ? 'rgba(255,112,67,0.2)'
                    : selectedItem && !uid
                    ? 'rgba(255,255,255,0.08)'
                    : 'transparent',
                  border: isHovered
                    ? `2px dashed ${canPlace ? theme.accent : 'var(--coral)'}`
                    : '2px solid transparent',
                  cursor: selectedItem ? (canPlace ? 'pointer' : 'not-allowed') : uid ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                }}
                onMouseEnter={() => setHoveredCell({ col, row })}
                onMouseLeave={() => setHoveredCell(null)}
                onTouchStart={() => setHoveredCell({ col, row })}
                onTouchEnd={() => {
                  if (selectedItem) onCellTap(col, row)
                  else if (uid) onItemTap(uid)
                  setHoveredCell(null)
                }}
                onClick={() => {
                  if (selectedItem) onCellTap(col, row)
                  else if (uid) onItemTap(uid)
                }}
              >
                {/* Render item doar la origine */}
                {isOrigin && (() => {
                  const item = ITEM_MAP.get(isOrigin.itemId)
                  if (!item) return null
                  return (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        gridColumn: `span ${item.width}`,
                        gridRow: `span ${item.height}`,
                        animation: 'pop 0.3s ease',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className="leading-none"
                          style={{
                            fontSize: item.width >= 2 ? '2rem' : '1.5rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                          }}
                        >
                          {item.emoji}
                        </span>
                        {item.isRare && (
                          <span className="text-[8px] font-bold" style={{ color: theme.accent }}>✨</span>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )
          })
        )}
      </div>

      {/* Preview item la hover */}
      {hoveredCell && selectedItem && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.5, zIndex: 20 }}
        >
          <span style={{ fontSize: '3rem' }}>{selectedItem.emoji}</span>
        </div>
      )}

      {/* Hint dacă nu e item selectat */}
      {!selectedItem && room.placedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p
            className="font-nunito text-sm font-semibold opacity-60 text-center px-6"
            style={{ color: isDarkWall ? 'white' : 'var(--gray)' }}
          >
            Tap an item from the drawer below and place it in your room! 🏠
          </p>
        </div>
      )}
    </div>
  )
}
