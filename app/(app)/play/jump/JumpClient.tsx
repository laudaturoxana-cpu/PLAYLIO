'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { JUMP_LEVELS, type JumpLevel } from '@/lib/jump/levels'
import { useJumpGame } from '@/lib/jump/useJumpGame'
import { createClient } from '@/lib/supabase/client'
import JumpCanvas from '@/components/jump/JumpCanvas'
import JumpControls from '@/components/jump/JumpControls'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import { useSound } from '@/lib/sound/useSound'

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

const WORLD_COLORS: Record<1 | 2 | 3, string> = {
  1: '#4CAF50',
  2: '#7B1FA2',
  3: '#1A237E',
}

const WORLD_EMOJIS: Record<1 | 2 | 3, string> = {
  1: '🌿',
  2: '🌈',
  3: '🚀',
}

function LevelSelect({
  profileName,
  bestScores,
  onSelect,
}: {
  profileName: string
  bestScores: Record<string, { score: number; stars: number }>
  onSelect: (level: JumpLevel) => void
}) {
  // Group levels by world
  const worlds = [1, 2, 3] as const
  const levelsByWorld = worlds.map(w => JUMP_LEVELS.filter(l => l.world === w))

  // Unlock logic helpers
  function getWorldFirstLevel(world: 1 | 2 | 3): JumpLevel | undefined {
    return levelsByWorld[world - 1][0]
  }

  function isWorldUnlocked(world: 1 | 2 | 3): boolean {
    if (world === 1) return true
    // World N unlocks when the first (non-boss) level of the previous world has ≥1 star
    const prevFirstLevel = getWorldFirstLevel((world - 1) as 1 | 2 | 3)
    if (!prevFirstLevel) return false
    return (bestScores[prevFirstLevel.id]?.stars ?? 0) >= 1
  }

  function isLevelUnlocked(level: JumpLevel, worldLevels: JumpLevel[]): boolean {
    const worldUnlocked = isWorldUnlocked(level.world)
    if (!worldUnlocked) return false

    const idxInWorld = worldLevels.indexOf(level)
    if (idxInWorld === 0) return true

    // Level 2 in world requires level 1 (first of world) has ≥1 star
    // Boss level requires level 2 of world has ≥1 star
    const prevLevel = worldLevels[idxInWorld - 1]
    return (bestScores[prevLevel.id]?.stars ?? 0) >= 1
  }

  return (
    <div className="game-container min-h-screen px-4 py-6">
      <HowToPlayOverlay
        storageKey="howtoplay_jump"
        worldColor="#F57F17"
        steps={[
          { emoji: '🎮', title: 'Jump!', description: 'Tap LEFT and RIGHT to move, tap JUMP to leap over obstacles and reach platforms!' },
          { emoji: '🪙', title: 'Collect coins!', description: 'Jump onto coins to collect them. The more coins you get, the more stars you earn!' },
          { emoji: '⭐', title: 'Earn stars!', description: 'Each level has a coin goal. Reach it to earn 1, 2 or 3 stars. Beat your best score!' },
        ]}
      />

      <div className="flex items-center justify-between mb-5">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Back"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold" style={{ color: '#F57F17' }}>
            🎮 Jump World
          </h1>
          <p className="font-nunito text-xs text-[var(--gray)]">Choose level</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl" style={{ animation: 'float 2s ease-in-out infinite' }}>🎮</span>
        <p className="font-nunito text-sm text-[var(--dark)]">
          Hi, {profileName}! Jump over obstacles and collect coins! 🪙
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {worlds.map(worldNum => {
          const worldLevels = levelsByWorld[worldNum - 1]
          const worldUnlocked = isWorldUnlocked(worldNum)
          const worldColor = WORLD_COLORS[worldNum]
          const worldEmoji = WORLD_EMOJIS[worldNum]
          const worldName = worldLevels[0]?.worldName ?? `World ${worldNum}`

          return (
            <div key={worldNum}>
              {/* World header */}
              <div
                className="flex items-center gap-2 mb-2 px-1"
                style={{ opacity: worldUnlocked ? 1 : 0.4 }}
              >
                <span className="text-lg">{worldEmoji}</span>
                <p
                  className="font-fredoka text-base font-semibold"
                  style={{ color: worldUnlocked ? worldColor : 'var(--gray)' }}
                >
                  {worldName}
                </p>
                {!worldUnlocked && <span className="text-base">🔒</span>}
              </div>

              {/* Levels in world */}
              <div className="flex flex-col gap-3">
                {worldLevels.map(level => {
                  const best = bestScores[level.id]
                  const unlocked = isLevelUnlocked(level, worldLevels)

                  return (
                    <button
                      key={level.id}
                      onClick={() => unlocked && onSelect(level)}
                      disabled={!unlocked}
                      className="flex items-center gap-4 rounded-3xl bg-white border shadow-sm p-4 text-left active:scale-95 transition-transform disabled:opacity-50"
                      style={{
                        touchAction: 'manipulation',
                        borderColor: level.isBoss ? `${worldColor}44` : 'rgba(0,0,0,0.05)',
                        background: level.isBoss
                          ? `linear-gradient(135deg, white 60%, ${worldColor}0a 100%)`
                          : 'white',
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl flex-shrink-0"
                        style={{ background: level.bgGradient }}
                      >
                        {level.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-fredoka text-base font-semibold text-[var(--dark)]">
                            {level.name}
                          </p>
                          {level.isBoss && (
                            <span
                              className="font-nunito text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${worldColor}22`, color: worldColor }}
                            >
                              BOSS
                            </span>
                          )}
                        </div>
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
                              Best: {best.score} 🪙
                            </span>
                          )}
                        </div>
                      </div>
                      {!unlocked && <span className="text-xl">🔒</span>}
                      {unlocked && !best && <span className="font-nunito text-xs text-[var(--sky)]">New!</span>}
                    </button>
                  )
                })}
              </div>
            </div>
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
  const [prevScore, setPrevScore] = useState(0)
  const { playCoin, playLevelUp } = useSound()

  // Play coin sound when score increases
  useEffect(() => {
    if (score > prevScore) {
      playCoin()
      setPrevScore(score)
    }
  }, [score]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play fanfare when game completes with stars
  useEffect(() => {
    if (isComplete && stars > 0) playLevelUp()
  }, [isComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard support (desktop/tablet with keyboard)
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

  // Save score at the end
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
    <div className="game-container min-h-screen flex flex-col px-4 py-4 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Back"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-fredoka text-base font-semibold" style={{ color: '#F57F17' }}>
            {level.emoji} {level.name}
          </p>
          {bestScore && (
            <p className="font-nunito text-xs text-[var(--gray)]">
              Best: {bestScore.score} 🪙 {'⭐'.repeat(bestScore.stars)}
            </p>
          )}
        </div>
        <div className="w-10" />
      </div>

      {/* Game */}
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
              Collect as many coins as you can in {level.timeLimit} seconds!
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
            🎮 Play!
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
              {isDead ? 'You fell!' : 'Time\'s up!'}
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
                <span className="font-nunito text-xs text-[var(--gray)]">coins</span>
              </div>
              {stars > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">💰</span>
                  <span className="font-fredoka text-2xl font-semibold text-[var(--mint-dark)]">
                    +{score * 2}
                  </span>
                  <span className="font-nunito text-xs text-[var(--gray)]">coins earned</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={startGame}
                className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
                style={{ touchAction: 'manipulation', background: 'linear-gradient(90deg, #F57F17, #FF8F00)' }}
              >
                🔄 Try again
              </button>
              <button
                onClick={onBack}
                className="rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-nunito text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform"
                style={{ touchAction: 'manipulation' }}
              >
                ← Levels
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active game */
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
