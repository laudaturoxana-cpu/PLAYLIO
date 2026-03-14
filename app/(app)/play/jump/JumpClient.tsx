'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { JUMP_LEVELS, type JumpLevel } from '@/lib/jump/levels'
import { useJumpGame } from '@/lib/jump/useJumpGame'
import { createClient } from '@/lib/supabase/client'
import JumpCanvas from '@/components/jump/JumpCanvas'
import JumpControls from '@/components/jump/JumpControls'

interface JumpClientProps {
  userId: string
  profileName: string
  initialCoins: number
  bestScores: Record<string, { score: number; stars: number }>
}

export default function JumpClient({ userId, profileName, initialCoins, bestScores }: JumpClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<JumpLevel | null>(null)

  if (!selectedLevel) {
    return (
      <LevelSelect
        profileName={profileName}
        bestScores={bestScores}
        onSelect={setSelectedLevel}
      />
    )
  }

  return (
    <JumpGame
      level={selectedLevel}
      userId={userId}
      initialCoins={initialCoins}
      bestScore={bestScores[selectedLevel.id]}
      onBack={() => setSelectedLevel(null)}
    />
  )
}

// ─── Level Select ─────────────────────────────────────────────────────────────

function LevelSelect({
  profileName,
  bestScores,
  onSelect,
}: {
  profileName: string
  bestScores: Record<string, { score: number; stars: number }>
  onSelect: (level: JumpLevel) => void
}) {
  return (
    <div className="min-h-screen px-4 py-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold" style={{ color: '#F57F17' }}>
            🎮 Lumea Jump
          </h1>
          <p className="font-nunito text-xs text-[var(--gray)]">Alege nivelul</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl" style={{ animation: 'float 2s ease-in-out infinite' }}>🎮</span>
        <p className="font-nunito text-sm text-[var(--dark)]">
          Bună, {profileName}! Sari peste obstacole și adună monede! 🪙
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {JUMP_LEVELS.map((level, idx) => {
          const best = bestScores[level.id]
          const prevDone = idx === 0 || (bestScores[JUMP_LEVELS[idx - 1].id]?.stars ?? 0) >= 1

          return (
            <button
              key={level.id}
              onClick={() => prevDone && onSelect(level)}
              disabled={!prevDone}
              className="flex items-center gap-4 rounded-3xl bg-white border border-black/5 shadow-sm p-4 text-left active:scale-95 transition-transform disabled:opacity-50"
              style={{ touchAction: 'manipulation' }}
            >
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl flex-shrink-0"
                style={{ background: level.bgGradient }}
              >
                {level.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-fredoka text-base font-semibold text-[var(--dark)]">
                  {level.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3].map(s => (
                    <span
                      key={s}
                      className="text-sm"
                      style={{
                        opacity: (best?.stars ?? 0) >= s ? 1 : 0.25,
                        filter: (best?.stars ?? 0) >= s ? 'none' : 'grayscale(1)',
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                  {best && (
                    <span className="font-nunito text-xs text-[var(--gray)] ml-1">
                      Record: {best.score} 🪙
                    </span>
                  )}
                </div>
              </div>
              {!prevDone && <span className="text-xl">🔒</span>}
              {prevDone && !best && <span className="font-nunito text-xs text-[var(--sky)]">Nou!</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Jump Game ────────────────────────────────────────────────────────────────

function JumpGame({
  level,
  userId,
  initialCoins,
  bestScore,
  onBack,
}: {
  level: JumpLevel
  userId: string
  initialCoins: number
  bestScore?: { score: number; stars: number }
  onBack: () => void
}) {
  const {
    char,
    collectedCoinIds,
    movingPlatforms,
    timeLeft,
    isRunning,
    isDead,
    isComplete,
    score,
    stars,
    startGame,
    setControl,
    jump,
  } = useJumpGame(level)

  const [savedResult, setSavedResult] = useState(false)

  // Keyboard support (desktop/tabletă cu tastatură)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  setControl('left', true)
      if (e.key === 'ArrowRight') setControl('right', true)
      if (e.key === ' ' || e.key === 'ArrowUp') jump()
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  setControl('left', false)
      if (e.key === 'ArrowRight') setControl('right', false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [setControl, jump])

  // Salvează scorul la final
  useEffect(() => {
    if ((isComplete || isDead) && !savedResult && score > 0) {
      setSavedResult(true)
      const supabase = createClient()
      supabase.from('jump_scores').insert({
        user_id: userId,
        level_id: level.id,
        score,
        stars,
        time_ms: (level.timeLimit - timeLeft) * 1000,
      }).then(() => {
        if (stars > 0) {
          supabase.rpc('add_coins', {
            p_user_id: userId,
            p_amount: score * 2,
            p_reason: `jump_${level.id}`,
            p_world: 'jump',
          })
        }
      })
    }
  }, [isComplete, isDead, savedResult, score, stars, userId, level, timeLeft])

  const isEnd = isComplete || isDead

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 max-w-sm mx-auto gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-fredoka text-base font-semibold" style={{ color: '#F57F17' }}>
            {level.emoji} {level.name}
          </p>
          {bestScore && (
            <p className="font-nunito text-xs text-[var(--gray)]">
              Record: {bestScore.score} 🪙 {'⭐'.repeat(bestScore.stars)}
            </p>
          )}
        </div>
        <div className="w-10" />
      </div>

      {/* Jocul */}
      {!isRunning && !isEnd ? (
        /* Start screen */
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <div
            className="w-full rounded-3xl flex items-center justify-center overflow-hidden"
            style={{ background: level.bgGradient, height: '220px' }}
          >
            <span className="text-7xl" style={{ animation: 'float 2s ease-in-out infinite' }}>
              {level.emoji}
            </span>
          </div>

          <div className="text-center">
            <p className="font-nunito text-sm text-[var(--gray)]">
              Adună cât mai multe monede în {level.timeLimit} secunde!
            </p>
            <p className="font-nunito text-xs text-[var(--gray)] mt-1">
              {level.starThresholds[0]} 🪙 = ⭐ · {level.starThresholds[1]} 🪙 = ⭐⭐ · {level.starThresholds[2]} 🪙 = ⭐⭐⭐
            </p>
          </div>

          <button
            onClick={startGame}
            className="rounded-full px-10 py-4 font-nunito text-lg font-semibold text-white shadow-lg active:scale-95 transition-transform"
            style={{
              touchAction: 'manipulation',
              background: 'linear-gradient(90deg, #F57F17, #FF8F00)',
              minWidth: '200px',
              minHeight: '60px',
            }}
          >
            🎮 Joacă!
          </button>
        </div>
      ) : isEnd ? (
        /* End screen */
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-8 shadow-lg border border-black/5 text-center w-full"
            style={{ animation: 'slide-up 0.4s ease' }}
          >
            <span
              className="text-6xl"
              style={{ animation: 'pop 0.5s ease' }}
            >
              {isDead ? '💫' : stars === 3 ? '🏆' : '🎮'}
            </span>
            <h2
              className="font-fredoka text-2xl font-semibold"
              style={{ color: '#F57F17' }}
            >
              {isDead ? 'Ai căzut!' : 'Timp expirat!'}
            </h2>

            {/* Stars */}
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <span
                  key={s}
                  className="text-3xl"
                  style={{
                    opacity: s <= stars ? 1 : 0.2,
                    filter: s <= stars ? 'none' : 'grayscale(1)',
                    animation: s <= stars ? `pop 0.3s ease ${s * 0.15}s both` : undefined,
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🪙</span>
                <span className="font-fredoka text-2xl font-semibold text-[var(--sun-dark)]">
                  {score}
                </span>
                <span className="font-nunito text-xs text-[var(--gray)]">monede</span>
              </div>
              {stars > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">💰</span>
                  <span className="font-fredoka text-2xl font-semibold text-[var(--mint-dark)]">
                    +{score * 2}
                  </span>
                  <span className="font-nunito text-xs text-[var(--gray)]">coins câștigate</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={startGame}
                className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
                style={{ touchAction: 'manipulation', background: 'linear-gradient(90deg, #F57F17, #FF8F00)' }}
              >
                🔄 Din nou
              </button>
              <button
                onClick={onBack}
                className="rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-nunito text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform"
                style={{ touchAction: 'manipulation' }}
              >
                ← Niveluri
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Joc activ */
        <>
          <JumpCanvas
            level={level}
            char={char}
            collectedCoinIds={collectedCoinIds}
            movingPlatforms={movingPlatforms}
            timeLeft={timeLeft}
            score={score}
            stars={stars}
            totalCoins={level.coins.length}
          />
          <JumpControls
            onLeftStart={() => setControl('left', true)}
            onLeftEnd={() => setControl('left', false)}
            onRightStart={() => setControl('right', true)}
            onRightEnd={() => setControl('right', false)}
            onJump={jump}
          />
        </>
      )}
    </div>
  )
}
