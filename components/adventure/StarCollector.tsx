'use client'

import type { FloatingItem } from '@/lib/adventure/useAdventureGame'

interface StarCollectorProps {
  floatingItems: FloatingItem[]
  onCollect: (id: string) => void
  bgGradient: string
  secretVisible: boolean
  secretEmoji: string
  onSecretCollect: () => void
  onCloudTap: () => void
  zoneEmoji: string
}

export default function StarCollector({
  floatingItems,
  onCollect,
  bgGradient,
  secretVisible,
  secretEmoji,
  onSecretCollect,
  onCloudTap,
  zoneEmoji,
}: StarCollectorProps) {
  const visible = floatingItems.filter(fi => !fi.collected && fi.visible)

  function handleItemTouch(e: React.TouchEvent | React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    onCollect(id)
  }

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        height: '320px',
        background: bgGradient,
        border: '2px solid rgba(0,0,0,0.06)',
      }}
      // Tap pe fundal = tap nor (tap_5x secret trigger)
      onTouchEnd={(e) => {
        // Dacă a atins fundalul (nu un item)
        if ((e.target as HTMLElement).dataset.bg) onCloudTap()
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).dataset.bg) onCloudTap()
      }}
    >
      {/* Fundal decorativ cu emoji zonă */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[120px]">{zoneEmoji}</span>
      </div>

      {/* Marker invizibil pe fundal pentru detectarea tap-ului */}
      <div
        className="absolute inset-0"
        data-bg="true"
        aria-hidden="true"
      />

      {/* Obiectele floating */}
      {visible.map(fi => (
        <button
          key={fi.id}
          onTouchEnd={(e) => handleItemTouch(e, fi.id)}
          onClick={(e) => handleItemTouch(e, fi.id)}
          className="absolute flex flex-col items-center gap-0.5 cursor-pointer"
          style={{
            left: `${fi.x}%`,
            top: `${fi.y}%`,
            transform: `scale(${fi.scale}) rotate(${fi.rotation}deg)`,
            animation: 'float 2s ease-in-out infinite',
            animationDelay: `${Math.random() * 2}s`,
            // Touch target minim 60×60px
            minWidth: '64px',
            minHeight: '64px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          aria-label={`Colectează ${fi.item.label}`}
        >
          <span
            className="text-4xl leading-none"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          >
            {fi.item.emoji}
          </span>
          {fi.item.points > 1 && (
            <span
              className="font-nunito text-[10px] font-bold text-white rounded-full px-1"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              ×{fi.item.points}
            </span>
          )}
        </button>
      ))}

      {/* Secret easter egg */}
      {secretVisible && (
        <button
          onTouchEnd={(e) => { e.preventDefault(); onSecretCollect() }}
          onClick={onSecretCollect}
          className="absolute"
          style={{
            right: '10%',
            bottom: '15%',
            animation: 'fade-in 0.5s ease, float 1.5s ease-in-out infinite',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            minWidth: '64px',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}
          aria-label="Secret! Atinge-mă!"
        >
          <span
            className="text-4xl"
            style={{ filter: 'drop-shadow(0 0 8px gold)' }}
          >
            {secretEmoji}
          </span>
        </button>
      )}

      {/* Instrucțiune tap */}
      {visible.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="font-nunito text-sm text-[var(--gray)] opacity-70">
            Obiectele apar în curând... ✨
          </p>
        </div>
      )}
    </div>
  )
}
