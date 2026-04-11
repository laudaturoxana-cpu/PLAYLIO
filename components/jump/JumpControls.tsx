'use client'

// Auto-runner — un singur control: SARI!
// Canvas-ul în sine acceptă tap, dar oferim și un buton mare pentru copii mici

interface JumpControlsProps {
  onJump: () => void
  isRunning: boolean
}

export default function JumpControls({ onJump, isRunning }: JumpControlsProps) {
  if (!isRunning) return null

  return (
    <div className="flex items-center justify-center mt-3 select-none">
      <button
        onTouchStart={(e) => { e.preventDefault(); onJump() }}
        onClick={onJump}
        className="flex items-center justify-center gap-2 rounded-full font-nunito font-bold text-white shadow-lg active:scale-90 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #F57F17, #FF8F00)',
          width: 'clamp(140px, 40vw, 200px)',
          height: 'clamp(56px, 14vw, 72px)',
          fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          boxShadow: '0 6px 20px rgba(245,127,23,0.5)',
          userSelect: 'none',
          border: '3px solid rgba(255,255,255,0.3)',
        }}
        aria-label="Sari!"
      >
        <span style={{ fontSize: '1.6rem' }}>🦘</span>
        SARI!
      </button>
    </div>
  )
}
