'use client'

import Link from 'next/link'

interface GameHUDProps {
  questionsAnswered: number
  totalQuestions: number
  coinsThisSession: number
  masteredCount: number
  totalLetters: number
  onExit?: () => void
}

export default function GameHUD({
  questionsAnswered,
  totalQuestions,
  coinsThisSession,
  masteredCount,
  totalLetters,
  onExit,
}: GameHUDProps) {
  const progress = totalQuestions > 0
    ? Math.min(100, Math.round((questionsAnswered / totalQuestions) * 100))
    : 0

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-black/5">
      {/* Exit button */}
      <Link
        href="/play/learning"
        onClick={onExit}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gray-light,#f5f5f5)] text-[var(--gray)] active:scale-95 transition-transform"
        style={{ touchAction: 'manipulation', minWidth: '40px', minHeight: '40px' }}
        aria-label="Back to map"
      >
        ←
      </Link>

      {/* Short progress bar */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="font-nunito text-xs text-[var(--gray)]">
            {masteredCount}/{totalLetters} letters mastered
          </span>
          <span className="font-nunito text-xs text-[var(--gray)]">
            {questionsAnswered} answers
          </span>
        </div>
        <div
          className="h-2 rounded-full bg-[var(--gray-light,#f0f0f0)] overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(masteredCount / Math.max(totalLetters, 1)) * 100}%`,
              background: 'linear-gradient(90deg, var(--sky), var(--mint-dark))',
            }}
          />
        </div>
      </div>

      {/* Coins */}
      <div
        className="flex items-center gap-1 rounded-xl px-3 py-1.5 bg-[var(--sun-light,#FFF8E1)]"
        style={{ minWidth: '60px' }}
      >
        <span className="text-base" aria-hidden="true">🪙</span>
        <span className="font-fredoka text-base font-semibold text-[var(--sun-dark)]">
          +{coinsThisSession}
        </span>
      </div>
    </div>
  )
}
