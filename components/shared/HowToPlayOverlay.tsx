'use client'

import { useState, useEffect } from 'react'

interface Step {
  emoji: string
  title: string
  description: string
}

interface HowToPlayOverlayProps {
  storageKey: string     // e.g. 'howtoplay_letters'
  worldColor: string
  steps: Step[]
}

export default function HowToPlayOverlay({ storageKey, worldColor, steps }: HowToPlayOverlayProps) {
  const [visible, setVisible] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey)) {
        setVisible(true)
      }
    } catch {
      // ignore
    }
  }, [storageKey])

  function dismiss() {
    try { localStorage.setItem(storageKey, '1') } catch { /* ignore */ }
    setVisible(false)
  }

  function next() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(s => s + 1)
    } else {
      dismiss()
    }
  }

  if (!visible) return null

  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
    >
      <div
        className="flex flex-col items-center gap-5 rounded-3xl bg-white px-6 py-8 text-center shadow-2xl border border-black/5"
        style={{ maxWidth: '340px', width: '100%', animation: 'slide-up 0.3s ease' }}
      >
        {/* Lio + emoji */}
        <div className="flex items-center gap-3">
          <span className="text-4xl" style={{ animation: 'bounce-soft 1.5s infinite' }}>🦁</span>
          <span className="text-5xl" style={{ animation: 'float 2s ease-in-out infinite' }}>
            {step.emoji}
          </span>
        </div>

        {/* Step title */}
        <div>
          <h2
            className="font-fredoka text-xl font-semibold"
            style={{ color: worldColor }}
          >
            {step.title}
          </h2>
          <p className="font-nunito text-sm text-[var(--dark)] mt-2 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Dot indicators */}
        {steps.length > 1 && (
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === stepIndex ? '20px' : '7px',
                  height: '7px',
                  backgroundColor: i === stepIndex ? worldColor : 'rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={next}
          className="w-full rounded-full py-3.5 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
          style={{
            touchAction: 'manipulation',
            background: `linear-gradient(90deg, ${worldColor}, ${worldColor}cc)`,
            minHeight: '52px',
          }}
        >
          {isLast ? "🚀 Let's go!" : 'Next →'}
        </button>

        {/* Skip */}
        <button
          onClick={dismiss}
          className="font-nunito text-xs text-[var(--gray)] underline"
          style={{ touchAction: 'manipulation' }}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
