'use client'

import type { LioSituation } from '@/lib/learning/adaptiveEngine'

interface LioGuideProps {
  message: string
  situation: LioSituation
  className?: string
}

const SITUATION_COLORS: Record<LioSituation, string> = {
  start: 'var(--sky)',
  correct: 'var(--mint-dark)',
  wrong_1: 'var(--sun)',
  wrong_2: 'var(--sun-dark)',
  wrong_3: 'var(--coral)',
  level_up: 'var(--purple)',
  mastered: 'var(--coral)',
}

export default function LioGuide({ message, situation, className = '' }: LioGuideProps) {
  const bubbleColor = SITUATION_COLORS[situation]
  const isExcited = situation === 'correct' || situation === 'level_up' || situation === 'mastered'
  const isSad = situation === 'wrong_3'

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      {/* Lio SVG */}
      <div
        className="flex-shrink-0"
        style={{
          animation: isExcited
            ? 'bounce-soft 0.6s ease infinite'
            : isSad
            ? 'shake 0.4s ease'
            : 'float 3s ease-in-out infinite',
        }}
      >
        <svg
          width="72"
          height="72"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* Corp */}
          <ellipse cx="50" cy="60" rx="28" ry="22" fill="var(--sky)" />
          {/* Cap */}
          <circle cx="50" cy="38" r="22" fill="var(--sky)" />
          {/* Urechi */}
          <ellipse cx="32" cy="20" rx="8" ry="10" fill="var(--sky)" />
          <ellipse cx="68" cy="20" rx="8" ry="10" fill="var(--sky)" />
          <ellipse cx="32" cy="20" rx="5" ry="7" fill="var(--coral)" opacity="0.7" />
          <ellipse cx="68" cy="20" rx="5" ry="7" fill="var(--coral)" opacity="0.7" />
          {/* Ochi */}
          <circle cx="43" cy="36" r="6" fill="white" />
          <circle cx="57" cy="36" r="6" fill="white" />
          <circle
            cx={isSad ? '43' : '44'}
            cy={isSad ? '37' : '36'}
            r="3.5"
            fill="#212121"
          />
          <circle
            cx={isSad ? '57' : '58'}
            cy={isSad ? '37' : '36'}
            r="3.5"
            fill="#212121"
          />
          {/* Pupile strălucitoare */}
          <circle cx="45" cy="35" r="1.2" fill="white" />
          <circle cx="59" cy="35" r="1.2" fill="white" />
          {/* Gură */}
          {isSad ? (
            <path d="M 43 48 Q 50 44 57 48" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 43 46 Q 50 52 57 46" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {/* Obraz roz */}
          <ellipse cx="37" cy="44" rx="5" ry="3" fill="var(--pink)" opacity="0.5" />
          <ellipse cx="63" cy="44" rx="5" ry="3" fill="var(--pink)" opacity="0.5" />
          {/* Stea la correct/mastered */}
          {(isExcited) && (
            <text x="72" y="22" fontSize="18" style={{ animation: 'pop 0.3s ease' }}>⭐</text>
          )}
        </svg>
      </div>

      {/* Bulă de dialog */}
      <div
        className="relative rounded-2xl rounded-bl-sm px-4 py-3 max-w-[200px] shadow-sm"
        style={{ backgroundColor: bubbleColor, color: 'white' }}
      >
        <p className="font-nunito text-sm font-semibold leading-snug">
          {message}
        </p>
        {/* Săgeată spre Lio */}
        <div
          className="absolute -left-2 bottom-3 w-0 h-0"
          style={{
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: `8px solid ${bubbleColor}`,
          }}
        />
      </div>
    </div>
  )
}
