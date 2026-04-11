'use client'

import { useState, useEffect } from 'react'
import { useSound } from '@/lib/sound/useSound'

// Tip minim necesar pentru challenge
interface ChallengeItem {
  id: string
  name: string
  nameEn: string
  icon: string
}

interface BuilderLetterChallengeProps {
  item: ChallengeItem
  onCorrect: () => void   // proceed to place item (with bonus)
  onSkip: () => void      // skip challenge, place anyway
}

// Generate 2 wrong letters that are visually distinct from the correct one
function getWrongLetters(correct: string): string[] {
  const pool = 'ABCDEFGHIJKLMNOPRSTW'.split('').filter(l => l !== correct)
  // shuffle and take 2
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 2)
}

export default function BuilderLetterChallenge({ item, onCorrect, onSkip }: BuilderLetterChallengeProps) {
  const correctLetter = item.name[0].toUpperCase()
  const [choices, setChoices] = useState<string[]>([])
  const [chosen, setChosen] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const { playCorrect, playWrong } = useSound()

  useEffect(() => {
    const wrong = getWrongLetters(correctLetter)
    const all = [correctLetter, ...wrong].sort(() => Math.random() - 0.5)
    setChoices(all)
    setChosen(null)
    setDone(false)
  }, [item.id, correctLetter])

  function handleChoice(letter: string) {
    if (done) return
    setChosen(letter)
    setDone(true)

    if (letter === correctLetter) {
      playCorrect()
      setTimeout(onCorrect, 900)
    } else {
      playWrong()
      // Show correct answer for 1.5s, then proceed anyway (never block kids)
      setTimeout(onSkip, 1800)
    }
  }

  return (
    <div
      className="rounded-3xl border border-black/6 bg-white p-4 shadow-sm"
      style={{ animation: 'slide-up 0.25s ease' }}
    >
      {/* Lio question */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl flex-shrink-0" style={{ animation: 'bounce-soft 1.5s infinite' }}>🦁</span>
        <div>
          <p className="font-nunito text-sm font-bold" style={{ color: 'var(--sky-dark, #0288D1)' }}>
            Quick challenge! +5 bonus coins 🪙
          </p>
          <p className="font-nunito text-sm" style={{ color: 'var(--dark)' }}>
            What letter does{' '}
            <span className="font-bold">{item.icon} {item.name}</span>{' '}
            start with?
          </p>
        </div>
      </div>

      {/* Letter choices */}
      <div className="flex gap-2 justify-center">
        {choices.map(letter => {
          const isCorrect = letter === correctLetter
          const wasChosen = chosen === letter

          let bg = '#f5f5f5'
          let color = '#333'
          let border = '2px solid transparent'

          if (done && wasChosen && isCorrect) {
            bg = '#E8F5E9'; color = '#388E3C'; border = '2px solid #388E3C'
          } else if (done && wasChosen && !isCorrect) {
            bg = '#FFEBEE'; color = '#C62828'; border = '2px solid #EF5350'
          } else if (done && isCorrect) {
            bg = '#E8F5E9'; color = '#388E3C'; border = '2px solid #388E3C'
          }

          return (
            <button
              key={letter}
              onClick={() => handleChoice(letter)}
              disabled={done}
              className="flex items-center justify-center font-fredoka font-semibold rounded-2xl active:scale-95 transition-all"
              style={{
                touchAction: 'manipulation',
                width: '60px',
                height: '60px',
                fontSize: '1.5rem',
                backgroundColor: bg,
                color,
                border,
              }}
              aria-label={`Letter ${letter}`}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Skip */}
      {!done && (
        <button
          onClick={onSkip}
          className="w-full mt-3 font-nunito text-xs underline"
          style={{ touchAction: 'manipulation', color: 'var(--gray)' }}
        >
          Skip
        </button>
      )}
    </div>
  )
}
