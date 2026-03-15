'use client'

import type { LetterData } from '@/lib/learning/phonetics'

interface LetterDisplayProps {
  letter: LetterData
  showLetter?: boolean     // sometimes we hide the letter (audio mode)
  animate?: boolean
}

export default function LetterDisplay({
  letter,
  showLetter = true,
  animate = false,
}: LetterDisplayProps) {
  return (
    <div
      className="flex flex-col items-center gap-3"
      style={{
        animation: animate ? 'pop 0.4s ease' : undefined,
      }}
    >
      {/* Instruction (simple, large text) */}
      <p className="font-nunito text-base text-[var(--gray)] text-center">
        Find the letter for
      </p>

      {/* Large concrete object — Piaget: concrete thinking, not abstract */}
      <div
        className="flex items-center justify-center rounded-3xl"
        style={{
          width: '120px',
          height: '120px',
          background: `linear-gradient(135deg, ${letter.color}22, ${letter.color}44)`,
          border: `3px solid ${letter.color}66`,
          boxShadow: `0 8px 24px ${letter.color}33`,
        }}
      >
        <span className="text-6xl" role="img" aria-label={letter.word}>
          {letter.emoji}
        </span>
      </div>

      {/* The word — large and clear */}
      <p
        className="font-fredoka text-2xl font-semibold text-center"
        style={{ color: letter.color }}
      >
        {letter.word}
      </p>

      {/* Letter (if visible — level 1 or indicator) */}
      {showLetter && (
        <div className="flex gap-4 items-center">
          <span
            className="font-fredoka text-5xl font-semibold"
            style={{ color: letter.color }}
            aria-label={`Uppercase letter ${letter.letter}`}
          >
            {letter.letter}
          </span>
          <span
            className="font-fredoka text-4xl font-semibold opacity-70"
            style={{ color: letter.color }}
            aria-label={`Lowercase letter ${letter.lowercase}`}
          >
            {letter.lowercase}
          </span>
        </div>
      )}

      {/* Phonetic sound — displayed as simple text for young children */}
      <p className="font-nunito text-sm text-[var(--gray)] italic">
        „{letter.sound}..."
      </p>
    </div>
  )
}
