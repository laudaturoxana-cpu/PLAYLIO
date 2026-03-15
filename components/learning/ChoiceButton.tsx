'use client'

import { useRef } from 'react'
import type { LetterData } from '@/lib/learning/phonetics'

interface ChoiceButtonProps {
  letter: LetterData
  onChoose: (letter: LetterData) => void
  isHighlighted?: boolean  // level 1 + wrong 3: highlighted green
  isDisabled?: boolean
  showHint?: boolean       // level 2: blinking border on wrong
  wasChosen?: boolean
  wasCorrect?: boolean
}

export default function ChoiceButton({
  letter,
  onChoose,
  isHighlighted = false,
  isDisabled = false,
  showHint = false,
  wasChosen = false,
  wasCorrect,
}: ChoiceButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  function handleInteraction(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    if (isDisabled) return
    onChoose(letter)
  }

  let borderColor = 'rgba(0,0,0,0.08)'
  let bgColor = 'white'
  let scale = ''

  if (isHighlighted) {
    borderColor = 'var(--mint-dark)'
    bgColor = 'rgba(var(--mint-dark-rgb, 56,142,60), 0.08)'
  }
  if (showHint) {
    borderColor = 'var(--sun)'
  }
  if (wasChosen) {
    if (wasCorrect) {
      borderColor = 'var(--mint-dark)'
      bgColor = 'rgba(56,142,60,0.12)'
      scale = 'scale-110'
    } else {
      borderColor = 'var(--coral)'
      bgColor = 'rgba(255,112,67,0.08)'
    }
  }

  return (
    <button
      ref={buttonRef}
      // Native touch events — NO click with 300ms delay
      onTouchEnd={handleInteraction}
      onClick={handleInteraction}
      disabled={isDisabled}
      aria-label={`Letter ${letter.letter} — ${letter.word}`}
      aria-pressed={wasChosen}
      className={`
        relative flex flex-col items-center justify-center gap-1
        rounded-3xl border-2 bg-white
        transition-all duration-150
        active:scale-95
        ${scale}
        ${showHint ? 'animate-pulse' : ''}
        ${isDisabled ? 'cursor-default opacity-80' : 'cursor-pointer hover:-translate-y-1'}
      `}
      style={{
        // Touch target MINIMUM 60×60px (not 44px — children have imprecise fingers)
        minWidth: '80px',
        minHeight: '80px',
        width: '100%',
        aspectRatio: '1 / 1',
        borderColor,
        backgroundColor: bgColor,
        touchAction: 'manipulation', // prevents double-tap zoom
        WebkitTapHighlightColor: 'transparent',
        boxShadow: isHighlighted
          ? '0 0 0 3px var(--mint-dark)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
      }}
    >
      {/* Concrete object emoji (Piaget: never the abstract symbol in isolation) */}
      <span className="text-3xl leading-none" aria-hidden="true">
        {letter.emoji}
      </span>
      {/* Letter */}
      <span
        className="font-fredoka text-2xl font-semibold leading-none"
        style={{ color: letter.color }}
      >
        {letter.letter}
      </span>
      {/* Word */}
      <span className="font-nunito text-xs text-[var(--gray)] leading-none">
        {letter.word}
      </span>

      {/* Correct/wrong indicator */}
      {wasChosen && (
        <span
          className="absolute -top-2 -right-2 text-lg"
          style={{ animation: 'pop 0.3s ease' }}
          aria-hidden="true"
        >
          {wasCorrect ? '✅' : '❌'}
        </span>
      )}
    </button>
  )
}
