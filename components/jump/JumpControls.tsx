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
          width: '72px',
          height: '72px',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontSize: '2rem',
          userSelect: 'none',
        }}
        aria-label="Mișcă stânga"
      >
        ◀
      </button>

      {/* Salt — mare, în centru */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onJump() }}
        onClick={onJump}
        className="flex items-center justify-center rounded-full bg-[var(--sky)] shadow-md active:scale-90 transition-transform"
        style={{
          width: '90px',
          height: '90px',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontSize: '2.5rem',
          userSelect: 'none',
          boxShadow: '0 4px 16px rgba(79,195,247,0.5)',
        }}
        aria-label="Sari"
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
          width: '72px',
          height: '72px',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontSize: '2rem',
          userSelect: 'none',
        }}
        aria-label="Mișcă dreapta"
      >
        ▶
      </button>
    </div>
  )
}
