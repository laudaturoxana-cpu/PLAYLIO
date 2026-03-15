'use client'

interface JumpControlsProps {
  onLeftStart: () => void
  onLeftEnd: () => void
  onRightStart: () => void
  onRightEnd: () => void
  onJump: () => void
}

export default function JumpControls({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
}: JumpControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 mt-3 select-none">
      {/* Stânga */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onLeftStart() }}
        onTouchEnd={(e) => { e.preventDefault(); onLeftEnd() }}
        onMouseDown={onLeftStart}
        onMouseUp={onLeftEnd}
        onMouseLeave={onLeftEnd}
        className="flex items-center justify-center rounded-2xl bg-white/90 border border-black/08 shadow-sm active:bg-[var(--sky)]/20 transition-colors"
        style={{
          width: 'clamp(64px, 10vw, 96px)',
          height: 'clamp(64px, 10vw, 96px)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
          userSelect: 'none',
        }}
        aria-label="Move left"
      >
        ◀
      </button>

      {/* Salt — mare, în centru */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onJump() }}
        onClick={onJump}
        className="flex items-center justify-center rounded-full bg-[var(--sky)] shadow-md active:scale-90 transition-transform"
        style={{
          width: 'clamp(80px, 13vw, 120px)',
          height: 'clamp(80px, 13vw, 120px)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          userSelect: 'none',
          boxShadow: '0 4px 16px rgba(79,195,247,0.5)',
        }}
        aria-label="Jump"
      >
        🦘
      </button>

      {/* Dreapta */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onRightStart() }}
        onTouchEnd={(e) => { e.preventDefault(); onRightEnd() }}
        onMouseDown={onRightStart}
        onMouseUp={onRightEnd}
        onMouseLeave={onRightEnd}
        className="flex items-center justify-center rounded-2xl bg-white/90 border border-black/08 shadow-sm active:bg-[var(--sky)]/20 transition-colors"
        style={{
          width: 'clamp(64px, 10vw, 96px)',
          height: 'clamp(64px, 10vw, 96px)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
          userSelect: 'none',
        }}
        aria-label="Move right"
      >
        ▶
      </button>
    </div>
  )
}
