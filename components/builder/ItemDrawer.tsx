'use client'

import { useState } from 'react'
import { getBlocksByCategory, type Block, type BlockCategory } from '@/lib/builder/items'

interface BlockPaletteProps {
  childAge: number
  selectedBlock: Block | null
  onSelect: (block: Block | null) => void
}

const CATEGORIES: { id: BlockCategory; label: string; emoji: string }[] = [
  { id: 'ground',   label: 'Teren',    emoji: '🌍' },
  { id: 'water',    label: 'Apă',      emoji: '💧' },
  { id: 'plants',   label: 'Plante',   emoji: '🌿' },
  { id: 'building', label: 'Zidărie',  emoji: '🧱' },
  { id: 'sky',      label: 'Cer',      emoji: '☁️' },
  { id: 'magic',    label: 'Magic',    emoji: '✨' },
]

export default function BlockPalette({ childAge, selectedBlock, onSelect }: BlockPaletteProps) {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>('ground')

  const blocks = getBlocksByCategory(activeCategory, childAge)

  function handleSelect(block: Block) {
    onSelect(selectedBlock?.id === block.id ? null : block)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tab-uri categorii — scroll orizontal pe mobil */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex-shrink-0 flex items-center gap-1 rounded-full px-3 py-1.5 font-nunito text-xs font-semibold transition-all active:scale-95"
            style={{
              touchAction: 'manipulation',
              backgroundColor: activeCategory === cat.id ? '#29B6F6' : 'rgba(0,0,0,0.06)',
              color: activeCategory === cat.id ? 'white' : '#757575',
              minHeight: '32px',
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid de blocuri */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {blocks.map(block => {
          const isSelected = selectedBlock?.id === block.id
          return (
            <button
              key={block.id}
              onClick={() => handleSelect(block)}
              className="flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all active:scale-95"
              style={{
                touchAction: 'manipulation',
                border: isSelected
                  ? '2px solid #29B6F6'
                  : block.isRare
                  ? '2px solid #FFD600'
                  : '2px solid transparent',
                backgroundColor: isSelected ? 'rgba(41,182,246,0.12)' : 'rgba(0,0,0,0.03)',
                minHeight: '64px',
              }}
              aria-label={block.name}
              aria-pressed={isSelected}
            >
              {/* Mini previzualizare bloc */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '5px',
                  background: block.bgStyle,
                  border: `1.5px solid ${block.borderColor}`,
                  boxShadow: `inset 2px 2px 0 ${block.shadowLight}, inset -1px -1px 0 ${block.shadowDark}`,
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {block.isRare && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      fontSize: '8px',
                      lineHeight: 1,
                    }}
                  >
                    ✨
                  </span>
                )}
              </div>

              {/* Nume bloc */}
              <span
                className="font-nunito text-[9px] text-center leading-tight"
                style={{ color: isSelected ? '#0288D1' : '#757575' }}
              >
                {block.name}
              </span>
            </button>
          )
        })}

        {blocks.length === 0 && (
          <p className="col-span-full font-nunito text-xs text-center py-4" style={{ color: '#757575' }}>
            Niciun bloc disponibil în această categorie.
          </p>
        )}
      </div>

      {/* Info bloc selectat */}
      {selectedBlock && (
        <div
          className="flex items-center gap-3 rounded-2xl px-3 py-2"
          style={{
            backgroundColor: 'rgba(41,182,246,0.1)',
            border: '1px solid rgba(41,182,246,0.3)',
            animation: 'slide-up 0.2s ease',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: selectedBlock.bgStyle,
              border: `1.5px solid ${selectedBlock.borderColor}`,
              boxShadow: `inset 2px 2px 0 ${selectedBlock.shadowLight}, inset -1px -1px 0 ${selectedBlock.shadowDark}`,
              flexShrink: 0,
            }}
          />
          <p className="font-nunito text-xs font-semibold" style={{ color: '#0288D1' }}>
            Selectat: <span className="font-bold">{selectedBlock.name}</span> — tap pe grilă pentru a plasa
          </p>
          <button
            onClick={() => onSelect(null)}
            className="ml-auto font-bold text-sm"
            style={{ touchAction: 'manipulation', color: '#0288D1', minWidth: '28px', minHeight: '28px' }}
            aria-label="Deselectează"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
