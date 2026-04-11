'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { JUMP_LEVELS, CHARACTERS, getMaxHearts, type JumpLevel, type CharacterId } from '@/lib/jump/levels'
import { useJumpGame } from '@/lib/jump/useJumpGame'
import { createClient } from '@/lib/supabase/client'
import JumpCanvas from '@/components/jump/JumpCanvas'
import JumpControls from '@/components/jump/JumpControls'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import { useSound } from '@/lib/sound/useSound'

const TUTORIAL_STEPS = [
  { emoji: '🦁', title: 'Lio aleargă singur!',    description: 'Nu trebuie să îl miști. El aleargă automat spre destinație!' },
  { emoji: '🦘', title: 'Tap = SARI!',            description: 'Atinge ecranul sau apasă butonul SARI ca să sari peste obstacole.' },
  { emoji: '❤️',  title: 'Ai 3 inimi!',            description: 'Fiecare obstacol lovit îți ia o inimă. Ajunge cu inimi = mai multe stele!' },
  { emoji: '🧱',  title: 'Deblochezi blocuri!',    description: 'Fiecare nivel completat îți deschide un bloc nou în Builder World!' },
]

function loadCharsFromStorage(): CharacterId[] {
  try {
    const raw = localStorage.getItem('jump_chars')
    return raw ? JSON.parse(raw) : ['lio']
  } catch { return ['lio'] }
}

function loadSelectedChar(): CharacterId {
  try {
    return (localStorage.getItem('jump_selected_char') as CharacterId) ?? 'lio'
  } catch { return 'lio' }
}

function saveChar(id: CharacterId) {
  try { localStorage.setItem('jump_selected_char', id) } catch { /* silent */ }
}

function saveBuilderUnlock(blockId: string) {
  try {
    const raw = localStorage.getItem('builder_unlocked_blocks') ?? '[]'
    const list: string[] = JSON.parse(raw)
    if (!list.includes(blockId)) {
      list.push(blockId)
      localStorage.setItem('builder_unlocked_blocks', JSON.stringify(list))
    }
  } catch { /* silent */ }
}

interface JumpClientProps {
  userId: string
  profileName: string
  childAge: number
  initialCoins: number
  bestScores: Record<string, { score: number; stars: number }>
}

export default function JumpClient({ userId, profileName, childAge, initialCoins, bestScores }: JumpClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<JumpLevel | null>(null)
  const [selectedChar, setSelectedChar] = useState<CharacterId>('lio')
  const [unlockedChars, setUnlockedChars] = useState<CharacterId[]>(['lio'])

  useEffect(() => {
    setUnlockedChars(loadCharsFromStorage())
    setSelectedChar(loadSelectedChar())
  }, [])

  function handleSelectChar(id: CharacterId) {
    setSelectedChar(id)
    saveChar(id)
  }

  if (!selectedLevel) {
    return (
      <LevelSelect
        profileName={profileName}
        bestScores={bestScores}
        selectedChar={selectedChar}
        unlockedChars={unlockedChars}
        onSelectChar={handleSelectChar}
        onSelectLevel={setSelectedLevel}
      />
    )
  }

  return (
    <JumpGame
      level={selectedLevel}
      userId={userId}
      profileName={profileName}
      childAge={childAge}
      selectedChar={selectedChar}
      bestScore={bestScores[selectedLevel.id]}
      onBack={() => setSelectedLevel(null)}
      onCharUnlock={(charId) => {
        const next = [...unlockedChars, charId]
        setUnlockedChars(next)
        try { localStorage.setItem('jump_chars', JSON.stringify(next)) } catch { /* silent */ }
      }}
    />
  )
}

// ─── Level Select ─────────────────────────────────────────────

function LevelSelect({
  profileName,
  bestScores,
  selectedChar,
  unlockedChars,
  onSelectChar,
  onSelectLevel,
}: {
  profileName: string
  bestScores: Record<string, { score: number; stars: number }>
  selectedChar: CharacterId
  unlockedChars: CharacterId[]
  onSelectChar: (id: CharacterId) => void
  onSelectLevel: (l: JumpLevel) => void
}) {
  const worlds = [1, 2, 3] as const
  const WORLD_META: Record<1|2|3, { label: string; color: string }> = {
    1: { label: '🌲 Pădurea Magică',    color: '#388E3C' },
    2: { label: '☁️ Tărâmul Cerului',   color: '#0288D1' },
    3: { label: '🚀 Spațiul Cosmic',    color: '#4527A0' },
  }

  function isLevelUnlocked(level: JumpLevel): boolean {
    if (level.world === 1) {
      const idx = JUMP_LEVELS.filter(l => l.world === 1).indexOf(level)
      if (idx === 0) return true
      const prev = JUMP_LEVELS.filter(l => l.world === 1)[idx - 1]
      return (bestScores[prev.id]?.stars ?? 0) >= 1
    }
    if (level.world === 2) {
      // Need to complete W1 boss first
      const w1Boss = JUMP_LEVELS.find(l => l.world === 1 && l.isBoss)!
      if ((bestScores[w1Boss.id]?.stars ?? 0) < 1) return false
      const idx = JUMP_LEVELS.filter(l => l.world === 2).indexOf(level)
      if (idx === 0) return true
      const prev = JUMP_LEVELS.filter(l => l.world === 2)[idx - 1]
      return (bestScores[prev.id]?.stars ?? 0) >= 1
    }
    // World 3
    const w2Boss = JUMP_LEVELS.find(l => l.world === 2 && l.isBoss)!
    if ((bestScores[w2Boss.id]?.stars ?? 0) < 1) return false
    const idx = JUMP_LEVELS.filter(l => l.world === 3).indexOf(level)
    if (idx === 0) return true
    const prev = JUMP_LEVELS.filter(l => l.world === 3)[idx - 1]
    return (bestScores[prev.id]?.stars ?? 0) >= 1
  }

  return (
    <div className="game-container min-h-screen px-4 py-6">
      <HowToPlayOverlay storageKey="howtoplay_jump_v2" worldColor="#F57F17" steps={TUTORIAL_STEPS}/>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[#757575] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi"
        >←</Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold" style={{ color: '#F57F17' }}>
            🏃 Jump World
          </h1>
          <p className="font-nunito text-xs text-[#757575]">Sari cu Lio spre destinație!</p>
        </div>
        <div className="w-10"/>
      </div>

      {/* Lio mesaj */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0" style={{ animation: 'bounce-soft 1.5s infinite' }}>🦁</span>
        <p className="font-nunito text-sm text-[#212121]">
          Salut, {profileName}! Sari peste obstacole și ajunge la destinație!
          Completezi nivele = deblochezi blocuri pentru Builder World! 🧱
        </p>
      </div>

      {/* Character selector */}
      <div className="mb-5 rounded-3xl bg-white border border-black/5 shadow-sm p-4">
        <p className="font-nunito text-xs font-bold text-[#757575] mb-3 uppercase tracking-wide">
          Alege personajul tău
        </p>
        <div className="flex gap-3">
          {CHARACTERS.map(char => {
            const isUnlocked = unlockedChars.includes(char.id)
            const isSelected = selectedChar === char.id
            return (
              <button
                key={char.id}
                onClick={() => isUnlocked && onSelectChar(char.id)}
                disabled={!isUnlocked}
                className="flex flex-col items-center gap-1 rounded-2xl p-2 transition-all active:scale-95 flex-1"
                style={{
                  touchAction: 'manipulation',
                  backgroundColor: isSelected ? 'rgba(245,127,23,0.12)' : 'rgba(0,0,0,0.03)',
                  border: isSelected ? '2.5px solid #F57F17' : '2.5px solid transparent',
                  opacity: isUnlocked ? 1 : 0.45,
                  minHeight: '72px',
                }}
                aria-label={char.name}
                aria-pressed={isSelected}
              >
                <span style={{ fontSize: '1.8rem' }}>{char.emoji}</span>
                <span className="font-nunito text-[10px] font-semibold" style={{ color: isSelected ? '#F57F17' : '#757575' }}>
                  {isUnlocked ? char.name : '🔒'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Levels per world */}
      <div className="flex flex-col gap-5">
        {worlds.map(worldNum => {
          const levels = JUMP_LEVELS.filter(l => l.world === worldNum)
          const meta   = WORLD_META[worldNum]
          return (
            <div key={worldNum}>
              <p className="font-fredoka text-base font-semibold mb-2 px-1" style={{ color: meta.color }}>
                {meta.label}
              </p>
              <div className="flex flex-col gap-2.5">
                {levels.map(level => {
                  const best     = bestScores[level.id]
                  const unlocked = isLevelUnlocked(level)
                  return (
                    <button
                      key={level.id}
                      onClick={() => unlocked && onSelectLevel(level)}
                      disabled={!unlocked}
                      className="flex items-center gap-3 rounded-3xl bg-white border shadow-sm p-3.5 text-left active:scale-95 transition-transform disabled:opacity-50"
                      style={{
                        touchAction: 'manipulation',
                        borderColor: level.isBoss ? `${meta.color}55` : 'rgba(0,0,0,0.06)',
                        background: level.isBoss
                          ? `linear-gradient(135deg, white 60%, ${meta.color}08 100%)`
                          : 'white',
                      }}
                    >
                      {/* Level icon */}
                      <div
                        className="flex items-center justify-center w-13 h-13 rounded-2xl text-2xl flex-shrink-0"
                        style={{ background: level.bgGradient, width: 52, height: 52 }}
                      >
                        {level.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-fredoka text-base font-semibold text-[#212121] truncate">
                            {level.name}
                          </p>
                          {level.isBoss && (
                            <span className="font-nunito text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                              BOSS
                            </span>
                          )}
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map(s => (
                            <span key={s} className="text-sm"
                              style={{ opacity: (best?.stars ?? 0) >= s ? 1 : 0.2,
                                filter: (best?.stars ?? 0) >= s ? 'none' : 'grayscale(1)' }}>
                              ⭐
                            </span>
                          ))}
                          {best && (
                            <span className="font-nunito text-xs text-[#9E9E9E] ml-1">
                              {best.score} 🪙
                            </span>
                          )}
                        </div>

                        {/* Builder block teaser */}
                        {level.builderBlockUnlock && (
                          <p className="font-nunito text-[10px] text-[#F57F17] mt-0.5">
                            🧱 Deblochează: <strong>{level.builderBlockUnlock}</strong>
                          </p>
                        )}
                      </div>

                      {/* Destination */}
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <span style={{ fontSize: '1.4rem' }}>{level.destinationEmoji}</span>
                        {!unlocked && <span className="text-lg">🔒</span>}
                        {unlocked && !best && (
                          <span className="font-nunito text-[9px] font-bold rounded-full px-1.5"
                            style={{ backgroundColor: '#E8F5E9', color: '#388E3C' }}>Nou!</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-6"/>
    </div>
  )
}

// ─── Jump Game ────────────────────────────────────────────────

function JumpGame({
  level,
  userId,
  profileName,
  childAge,
  selectedChar,
  bestScore,
  onBack,
  onCharUnlock,
}: {
  level: JumpLevel
  userId: string
  profileName: string
  childAge: number
  selectedChar: CharacterId
  bestScore?: { score: number; stars: number }
  onBack: () => void
  onCharUnlock: (id: CharacterId) => void
}) {
  const maxHearts = getMaxHearts(childAge)
  const {
    charY, distance, hearts, invincible, collectedCoinIds,
    isRunning, isDead, isComplete, score, stars, startGame, jump,
  } = useJumpGame(level, maxHearts)

  const [savedResult, setSavedResult]       = useState(false)
  const [showBuilderUnlock, setShowBUnlock] = useState(false)
  const [showCharUnlock, setShowCharUnlock] = useState<string | null>(null)
  const { playCoin, playLevelUp } = useSound()

  // Coin sound
  const prevScore = useState(0)
  useEffect(() => {
    if (score > 0) playCoin()
  }, [score]) // eslint-disable-line react-hooks/exhaustive-deps

  // Win fanfare + unlock saves
  useEffect(() => {
    if (isComplete && stars > 0) {
      playLevelUp()
      // Builder block unlock
      if (level.builderBlockUnlock) {
        saveBuilderUnlock(level.builderBlockUnlock)
        setShowBUnlock(true)
      }
      // Character unlock on 3 stars
      if (stars === 3 && level.characterUnlock) {
        const chars = loadCharsFromStorage()
        if (!chars.includes(level.characterUnlock)) {
          const updated = [...chars, level.characterUnlock]
          try { localStorage.setItem('jump_chars', JSON.stringify(updated)) } catch { /* silent */ }
          onCharUnlock(level.characterUnlock)
          const cd = CHARACTERS.find(c => c.id === level.characterUnlock)
          if (cd) setShowCharUnlock(`${cd.emoji} ${cd.name} deblocat!`)
        }
      }
    }
  }, [isComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  // Save to Supabase
  useEffect(() => {
    if ((isComplete || isDead) && !savedResult && score > 0) {
      setSavedResult(true)
      const supabase = createClient()
      supabase.from('jump_scores').insert({
        user_id: userId,
        level_id: level.id,
        score,
        stars,
        time_ms: Math.round(distance / level.runSpeed * 16),
      }).then(() => {
        if (stars > 0) {
          supabase.rpc('add_coins', {
            p_user_id: userId,
            p_amount: score + stars * 5,
            p_reason: `jump_${level.id}`,
            p_world: 'jump',
          })
        }
      })
    }
  }, [isComplete, isDead]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  const isEnd = isComplete || isDead

  return (
    <div className="game-container min-h-screen flex flex-col px-4 py-4 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[#757575] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }} aria-label="Înapoi">←</button>
        <div className="text-center">
          <p className="font-fredoka text-base font-semibold" style={{ color: '#F57F17' }}>
            {level.emoji} {level.name}
          </p>
          <p className="font-nunito text-xs text-[#9E9E9E]">
            {level.destinationEmoji} {level.destinationName}
          </p>
        </div>
        <div className="w-10"/>
      </div>

      {/* ── START SCREEN ── */}
      {!isRunning && !isEnd && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          {/* Preview card */}
          <div
            className="w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-3 py-8"
            style={{ background: level.bgGradient, minHeight: 180 }}
          >
            <span style={{ fontSize: '5rem', animation: 'float 2s ease-in-out infinite' }}>
              {level.emoji}
            </span>
            <div className="flex items-center gap-2 rounded-full px-3 py-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '1rem' }}>{level.destinationEmoji}</span>
              <span className="font-nunito text-sm font-bold text-white">{level.destinationName}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full rounded-2xl bg-white border border-black/5 shadow-sm px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦘</span>
              <p className="font-nunito text-sm text-[#212121]">
                Tap oriunde sau apasă <strong>SARI</strong> pentru a sări
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">❤️</span>
              <p className="font-nunito text-sm text-[#212121]">
                Ai <strong>{maxHearts} inimi</strong> — cu cât mai multe rămân, cu atât mai multe stele!
              </p>
            </div>
            {level.builderBlockUnlock && (
              <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFE082' }}>
                <span className="text-lg">🧱</span>
                <p className="font-nunito text-xs font-semibold text-[#E65100]">
                  Completează pentru a debloca blocul <strong>{level.builderBlockUnlock}</strong>!
                </p>
              </div>
            )}
          </div>

          {bestScore && (
            <p className="font-nunito text-xs text-[#9E9E9E]">
              Recordul tău: {bestScore.score} 🪙 {'⭐'.repeat(bestScore.stars)}
            </p>
          )}

          <button onClick={startGame}
            className="rounded-full font-nunito text-lg font-semibold text-white shadow-lg active:scale-95 transition-transform"
            style={{
              touchAction: 'manipulation',
              background: 'linear-gradient(90deg, #F57F17, #FF8F00)',
              minWidth: 200, minHeight: 60, paddingInline: 32,
              boxShadow: '0 6px 20px rgba(245,127,23,0.5)',
            }}>
            🏃 Pornește!
          </button>
        </div>
      )}

      {/* ── END SCREEN ── */}
      {isEnd && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-8 shadow-lg border border-black/5 text-center w-full"
            style={{ animation: 'slide-up 0.4s ease' }}
          >
            <span className="text-6xl" style={{ animation: 'pop 0.5s ease' }}>
              {isDead ? '😵' : stars === 3 ? '🏆' : stars > 0 ? '🎉' : '😅'}
            </span>

            <h2 className="font-fredoka text-2xl font-semibold" style={{ color: '#F57F17' }}>
              {isDead
                ? 'Lio a căzut!'
                : `${level.destinationName} atinsă!`}
            </h2>

            {isComplete && (
              <p className="font-nunito text-sm text-[#757575]">
                {level.destinationEmoji} Ai ajuns la destinație!
              </p>
            )}

            {/* Stars */}
            <div className="flex gap-3">
              {[1, 2, 3].map(s => (
                <span key={s} className="text-4xl" style={{
                  opacity: s <= stars ? 1 : 0.18,
                  filter: s <= stars ? 'none' : 'grayscale(1)',
                  animation: s <= stars ? `pop 0.3s ease ${s * 0.15}s both` : undefined,
                }}>⭐</span>
              ))}
            </div>

            {/* Coins earned */}
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🪙</span>
                <span className="font-fredoka text-2xl font-semibold text-[#F57F17]">{score}</span>
                <span className="font-nunito text-xs text-[#9E9E9E]">monede</span>
              </div>
              {stars > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">💰</span>
                  <span className="font-fredoka text-2xl font-semibold text-[#388E3C]">
                    +{score + stars * 5}
                  </span>
                  <span className="font-nunito text-xs text-[#9E9E9E]">câștigate</span>
                </div>
              )}
            </div>

            {/* Builder block unlock reveal */}
            {showBuilderUnlock && level.builderBlockUnlock && (
              <div className="w-full rounded-2xl px-4 py-3 text-left"
                style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFF3E0)',
                  border: '2px solid #FFE082', animation: 'pop 0.4s ease' }}>
                <p className="font-nunito text-xs font-bold text-[#F57F17] mb-1">
                  🧱 Bloc nou deblocat în Builder World!
                </p>
                <p className="font-nunito text-base font-semibold text-[#E65100]">
                  ✅ Blocul <strong>{level.builderBlockUnlock}</strong> e acum disponibil!
                </p>
              </div>
            )}

            {/* Character unlock */}
            {showCharUnlock && (
              <div className="w-full rounded-2xl px-4 py-3 text-center"
                style={{ background: 'linear-gradient(135deg, #E8EAF6, #EDE7F6)',
                  border: '2px solid #9FA8DA', animation: 'pop 0.5s ease' }}>
                <p className="font-nunito text-sm font-bold text-[#5C6BC0]">
                  🎉 Personaj nou deblocat!
                </p>
                <p className="font-fredoka text-lg font-semibold text-[#3949AB]">
                  {showCharUnlock}
                </p>
              </div>
            )}

            {/* Hearts info */}
            {isComplete && (
              <p className="font-nunito text-xs text-[#9E9E9E]">
                Ai finalizat cu {hearts} ❤️ {hearts === maxHearts ? '— Perfect!' : ''}
              </p>
            )}

            <div className="flex flex-col gap-2.5 w-full">
              <button onClick={startGame}
                className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
                style={{ touchAction: 'manipulation',
                  background: 'linear-gradient(90deg, #F57F17, #FF8F00)' }}>
                🔄 Încearcă din nou
              </button>
              <button onClick={onBack}
                className="rounded-full border-2 py-3 font-nunito text-base font-semibold active:scale-95 transition-transform"
                style={{ touchAction: 'manipulation', borderColor: 'rgba(0,0,0,0.08)',
                  color: '#757575' }}>
                ← Nivele
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVE GAME ── */}
      {isRunning && (
        <>
          <JumpCanvas
            level={level}
            charY={charY}
            charId={selectedChar}
            distance={distance}
            hearts={hearts}
            maxHearts={maxHearts}
            invincible={invincible}
            collectedCoinIds={collectedCoinIds}
            score={score}
            onJump={jump}
          />
          <JumpControls onJump={jump} isRunning={isRunning}/>
        </>
      )}
    </div>
  )
}
