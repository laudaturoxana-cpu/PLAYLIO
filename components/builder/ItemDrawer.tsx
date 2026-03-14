'use client'

import { useState } from 'react'
import { BUILDER_ITEMS, type BuilderItem, type ItemCategory } from '@/lib/builder/items'

interface ItemDrawerProps {
  coins: number
  selectedItem: BuilderItem | null
  onSelect: (item: BuilderItem | null) => void
  ownedItemIds: string[]
}

const CATEGORIES: { id: ItemCategory; label: string; emoji: string }[] = [
  { id: 'furniture',   label: 'Mobilier',   emoji: '🛏️' },
  { id: 'decoration',  label: 'Decorații',  emoji: '🌸' },
  { id: 'wallpaper',   label: 'Tapet',      emoji: '🖼️' },
]

export default function ItemDrawer({
  coins,
  selectedItem,
  onSelect,
  ownedItemIds,
}: ItemDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('furniture')

  const items = BUILDER_ITEMS.filter(i => i.category === activeCategory)

  function handleSelect(item: BuilderItem) {
    if (selectedItem?.id === item.id) {
      onSelect(null)
    } else {
      onSelect(item)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs categorii */}
      <div className="flex gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-nunito text-xs font-semibold transition-all active:scale-95"
            style={{
              touchAction: 'manipulation',
              backgroundColor: activeCategory === cat.id ? 'var(--sky)' : 'rgba(0,0,0,0.06)',
              color: activeCategory === cat.id ? 'white' : 'var(--gray)',
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid iteme */}
      <div className="grid grid-cols-4 gap-2">
        {items.map(item => {
          const owned = ownedItemIds.includes(item.id) || item.price === 0
          const canAfford = coins >= item.price
          const isSelected = selectedItem?.id === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              disabled={!canAfford && !owned}
              className="flex flex-col items-center gap-1 rounded-2xl p-2 transition-all active:scale-95"
              style={{
                touchAction: 'manipulation',
                backgroundColor: isSelected
                  ? 'var(--sky)'
                  : 'rgba(0,0,0,0.04)',
                border: isSelected
                  ? '2px solid var(--sky)'
                  : item.isRare
                  ? '2px solid var(--sun)'
                  : '2px solid transparent',
                opacity: !canAfford && !owned ? 0.45 : 1,
                minHeight: '64px',
              }}
              aria-label={`${item.name}${item.price > 0 ? ` — ${item.price} monede` : ' — gratuit'}`}
              aria-pressed={isSelected}
            >
              <span
                className="leading-none"
                style={{
                  fontSize: '1.6rem',
                  filter: item.isRare ? 'drop-shadow(0 0 4px gold)' : 'none',
                }}
              >
                {item.emoji}
              </span>
              <span
                className="font-nunito text-[9px] text-center leading-tight"
                style={{ color: isSelected ? 'white' : 'var(--gray)' }}
              >
                {item.name}
              </span>
              {item.price > 0 && (
                <div className="flex items-center gap-0.5">
                  <span className="text-[9px]">🪙</span>
                  <span
                    className="font-fredoka text-[10px] font-semibold"
                    style={{ color: isSelected ? 'white' : canAfford ? 'var(--sun-dark)' : 'var(--coral)' }}
                  >
                    {item.price}
                  </span>
                </div>
              )}
              {item.isRare && (
                <span className="font-nunito text-[8px] font-bold text-[var(--sun-dark)]">✨ Rar</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
