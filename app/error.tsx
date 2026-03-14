'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log eroarea fără a o afișa copilului
    console.error('[Playlio Error]', error.digest ?? 'unknown')
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: 'white' }}
    >
      {/* NICIODATĂ erori tehnice vizibile — conform arhitecturii */}
      <div className="flex flex-col items-center gap-5 max-w-sm">
        {/* Lio trist — 0.5s conform spec */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          aria-hidden="true"
          style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
        >
          <ellipse cx="50" cy="60" rx="28" ry="22" fill="var(--sky)" />
          <circle cx="50" cy="38" r="22" fill="var(--sky)" />
          <ellipse cx="32" cy="20" rx="8" ry="10" fill="var(--sky)" />
          <ellipse cx="68" cy="20" rx="8" ry="10" fill="var(--sky)" />
          <ellipse cx="32" cy="20" rx="5" ry="7" fill="var(--coral)" opacity="0.7" />
          <ellipse cx="68" cy="20" rx="5" ry="7" fill="var(--coral)" opacity="0.7" />
          <circle cx="43" cy="36" r="6" fill="white" />
          <circle cx="57" cy="36" r="6" fill="white" />
          <circle cx="43" cy="37" r="3.5" fill="#212121" />
          <circle cx="57" cy="37" r="3.5" fill="#212121" />
          <circle cx="44" cy="35.5" r="1.2" fill="white" />
          <circle cx="58" cy="35.5" r="1.2" fill="white" />
          {/* Gura tristă */}
          <path d="M 43 48 Q 50 44 57 48" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="37" cy="44" rx="5" ry="3" fill="var(--pink)" opacity="0.5" />
          <ellipse cx="63" cy="44" rx="5" ry="3" fill="var(--pink)" opacity="0.5" />
        </svg>

        <div>
          <h2 className="font-fredoka text-2xl font-semibold text-[var(--dark)] mb-2">
            Hmm, something went wrong...
          </h2>
          <p className="font-nunito text-base text-[var(--gray)]">
            Don&apos;t worry! Lio will fix it. Try again!
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full py-3 px-6 font-nunito text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
            style={{
              touchAction: 'manipulation',
              background: 'linear-gradient(90deg, var(--coral), var(--coral-dark))',
            }}
          >
            🔄 Try again
          </button>
          <a
            href="/worlds"
            className="font-nunito text-sm text-[var(--gray)] underline"
            style={{ touchAction: 'manipulation' }}
          >
            Back to worlds
          </a>
        </div>
      </div>
    </div>
  )
}
