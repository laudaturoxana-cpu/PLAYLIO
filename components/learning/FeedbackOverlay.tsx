'use client'

import { useEffect } from 'react'
import type { FeedbackType } from '@/lib/learning/useAdaptiveGame'

interface FeedbackOverlayProps {
  feedback: FeedbackType
  coins: number
  onDone: () => void
  autoAdvanceMs?: number
}

const CONFETTI_CHARS = ['⭐', '🌟', '✨', '🎉', '🪙', '💫']

export default function FeedbackOverlay({
  feedback,
  coins,
  onDone,
  autoAdvanceMs = 1200,
}: FeedbackOverlayProps) {
  // Auto-advance after animation
  useEffect(() => {
    if (feedback === 'correct' || feedback === 'wrong') {
      const t = setTimeout(onDone, autoAdvanceMs)
      return () => clearTimeout(t)
    }
    // level_up and mastered: child presses the button
  }, [feedback, autoAdvanceMs, onDone])

  if (!feedback) return null

  if (feedback === 'wrong') {
    return (
      // Shake screen — visual feedback NOT negative text
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        style={{ animation: 'shake 0.4s ease' }}
      >
        <div
          className="rounded-full p-6"
          style={{
            background: 'rgba(255,112,67,0.12)',
            animation: 'pop 0.3s ease',
          }}
        >
          <span className="text-5xl">🤔</span>
        </div>
      </div>
    )
  }

  if (feedback === 'correct') {
    return (
      <div className="pointer-events-none fixed inset-0 z-50">
        {/* Confetti */}
        {CONFETTI_CHARS.map((char, i) => (
          <span
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${10 + i * 14}%`,
              top: '-10%',
              animation: `confetti-drop ${0.8 + i * 0.1}s ease forwards`,
              animationDelay: `${i * 0.06}s`,
            }}
          >
            {char}
          </span>
        ))}
        {/* Coins earn indicator */}
        {coins > 0 && (
          <div
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full px-4 py-2 bg-white shadow-lg"
            style={{ animation: 'coin-fly 0.8s ease forwards' }}
          >
            <span className="text-xl">🪙</span>
            <span className="font-fredoka text-xl font-semibold text-[var(--sun-dark)]">
              +{coins}
            </span>
          </div>
        )}
      </div>
    )
  }

  if (feedback === 'level_up') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.4)', animation: 'fade-in 0.2s ease' }}
        onClick={onDone}
      >
        <div
          className="flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-10 shadow-2xl text-center"
          style={{ animation: 'pop 0.4s ease', maxWidth: '280px' }}
        >
          <span className="text-6xl">🚀</span>
          <h2
            className="font-fredoka text-2xl font-semibold"
            style={{ color: 'var(--purple)' }}
          >
            Level up!
          </h2>
          <p className="font-nunito text-base text-[var(--gray)]">
            You're getting better and better!
          </p>
          {coins > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <span className="font-fredoka text-2xl font-semibold text-[var(--sun-dark)]">
                +{coins}
              </span>
            </div>
          )}
          <button
            className="mt-2 rounded-full px-8 py-3 font-nunito text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
            style={{ touchAction: 'manipulation', backgroundColor: 'var(--purple)' }}
            onClick={onDone}
          >
            Keep going! ⭐
          </button>
        </div>
      </div>
    )
  }

  if (feedback === 'mastered') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', animation: 'fade-in 0.2s ease' }}
        onClick={onDone}
      >
        {/* White flash → fade in animation (per transition spec) */}
        <div
          className="flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-10 shadow-2xl text-center"
          style={{ animation: 'pop 0.5s ease', maxWidth: '300px' }}
        >
          {/* Star explodes from center */}
          <div className="relative">
            <span className="text-7xl" style={{ animation: 'pop 0.5s ease' }}>🏆</span>
            {['⭐', '✨', '🌟', '💫', '⭐'].map((s, i) => (
              <span
                key={i}
                className="absolute text-lg"
                style={{
                  top: `${-20 + Math.sin(i * 72 * Math.PI / 180) * 40}px`,
                  left: `${50 + Math.cos(i * 72 * Math.PI / 180) * 40}px`,
                  animation: `confetti-drop 0.8s ease ${i * 0.1}s forwards`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <h2
            className="font-fredoka text-2xl font-semibold"
            style={{ color: 'var(--coral)' }}
          >
            You mastered this letter!
          </h2>
          <p className="font-nunito text-base text-[var(--gray)]">
            You're a true letter hero! 🦁
          </p>
          {coins > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <span className="font-fredoka text-2xl font-semibold text-[var(--sun-dark)]">
                +{coins}
              </span>
            </div>
          )}
          <button
            className="mt-2 rounded-full px-8 py-3 font-nunito text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
            style={{ touchAction: 'manipulation', backgroundColor: 'var(--coral)' }}
            onClick={onDone}
          >
            Next! 🚀
          </button>
        </div>
      </div>
    )
  }

  return null
}
