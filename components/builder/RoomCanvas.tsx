'use client'

import { useState } from 'react'
import { BLOCK_MAP, type Block } from '@/lib/builder/items'
import type { PlacedBlock, SceneState } from '@/lib/builder/useBuilderRoom'
import type { BuildScene } from '@/lib/builder/items'

interface BlockCanvasProps {
  scene: SceneState
  buildScene: BuildScene
  selectedBlock: Block | null
  onCellTap: (col: number, row: number) => void
  onBlockTap: (uid: string) => void
  gridCols: number
  gridRows: number
}

export default function BlockCanvas({
  scene,
  buildScene,
  selectedBlock,
  onCellTap,
  onBlockTap,
  gridCols,
  gridRows,
}: BlockCanvasProps) {
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null)

  // Map rapid col,row → PlacedBlock
  const cellMap = new Map<string, PlacedBlock>()
  for (const pb of scene.placedBlocks) {
    cellMap.set(`${pb.col},${pb.row}`, pb)
  }

  function isHovered(col: number, row: number) {
    return hoveredCell?.col === col && hoveredCell?.row === row
  }

  function handlePointerEnter(col: number, row: number) {
    setHoveredCell({ col, row })
  }

  function handlePointerLeave() {
    setHoveredCell(null)
  }

  function handleTap(col: number, row: number) {
    const existing = cellMap.get(`${col},${row}`)
    if (selectedBlock) {
      // Plasare sau înlocuire
      onCellTap(col, row)
    } else if (existing) {
      // Fără selecție → șterge bloc existent
      onBlockTap(existing.uid)
    }
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg"
      style={{
        background: buildScene.skyGradient,
        aspectRatio: `${gridCols} / ${gridRows}`,
        border: '2px solid rgba(0,0,0,0.12)',
      }}
    >
      {/* Bara de sol (ground strip) */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '10%',
          background: buildScene.groundColor,
          borderTop: '2px solid rgba(0,0,0,0.15)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          padding: '3px',
          gap: '1px',
        }}
      >
        {Array.from({ length: gridRows }).map((_, row) =>
          Array.from({ length: gridCols }).map((_, col) => {
            const placed = cellMap.get(`${col},${row}`)
            const block = placed ? BLOCK_MAP.get(placed.blockId) : undefined
            const hovered = isHovered(col, row)
            const canPlace = selectedBlock && !placed

            return (
              <div
                key={`${col},${row}`}
                onMouseEnter={() => handlePointerEnter(col, row)}
                onMouseLeave={handlePointerLeave}
                onTouchStart={() => handlePointerEnter(col, row)}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleTap(col, row)
                  handlePointerLeave()
                }}
                onClick={() => handleTap(col, row)}
                style={{
                  position: 'relative',
                  borderRadius: '2px',
                  cursor: selectedBlock
                    ? (placed ? 'crosshair' : 'pointer')
                    : placed
                    ? 'pointer'
                    : 'default',
                  touchAction: 'manipulation',
                  transition: 'transform 0.08s ease',
                  transform: hovered && (selectedBlock || placed) ? 'scale(1.08)' : 'scale(1)',
                  zIndex: hovered ? 5 : 1,
                  // Block rendering
                  background: block
                    ? block.bgStyle
                    : hovered && canPlace
                    ? `${selectedBlock?.bgStyle ?? 'rgba(255,255,255,0.3)'}`
                    : 'transparent',
                  border: block
                    ? `1px solid ${block.borderColor}`
                    : hovered && canPlace
                    ? `1px dashed rgba(255,255,255,0.7)`
                    : hovered && placed
                    ? `1px dashed rgba(255,80,80,0.7)`
                    : '1px solid transparent',
                  boxShadow: block
                    ? `inset 2px 2px 0 ${block.shadowLight}, inset -1px -1px 0 ${block.shadowDark}`
                    : 'none',
                  opacity: hovered && canPlace ? 0.7 : 1,
                }}
                aria-label={block ? `Bloc ${block.name} la (${col},${row})` : `Celulă goală (${col},${row})`}
              >
                {/* Indicator bloc rar */}
                {block?.isRare && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '1px',
                      right: '1px',
                      fontSize: '6px',
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}
                  >
                    ✨
                  </span>
                )}
                {/* Preview bloc selectat hover */}
                {hovered && canPlace && selectedBlock && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      pointerEvents: 'none',
                      opacity: 0.8,
                    }}
                  >
                    +
                  </span>
                )}
                {/* X pe hover când e ocupat și vrei să ștergi */}
                {hovered && placed && !selectedBlock && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      color: 'rgba(255,80,80,0.9)',
                      fontWeight: 'bold',
                      pointerEvents: 'none',
                    }}
                  >
                    ✕
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Hint dacă grila e goală */}
      {scene.placedBlocks.length === 0 && !selectedBlock && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p
            className="font-nunito text-xs font-semibold text-center px-4 py-2 rounded-2xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.6)',
              color: '#555',
              backdropFilter: 'blur(4px)',
            }}
          >
            Selectează un bloc din paletă și construiește! 🏗️
          </p>
        </div>
      )}
    </div>
  )
}
