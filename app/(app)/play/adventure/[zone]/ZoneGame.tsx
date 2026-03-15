'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Zone } from '@/lib/adventure/zones'
import { isZoneUnlocked } from '@/lib/adventure/zones'
import { useAdventureGame, loadSavedStars } from '@/lib/adventure/useAdventureGame'
import { createClient } from '@/lib/supabase/client'
import StarCollector from '@/components/adventure/StarCollector'
import QuestTracker from '@/components/adventure/QuestTracker'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import { useSound } from '@/lib/sound/useSound'
import { useLio } from '@/lib/ai/useLio'

const ADVENTURE_TUTORIAL = [
  {
    emoji: '🗺️',
    title: 'Explore the zone!',
    description: 'Tap the floating emojis to collect stars! Collect as many as you can before time runs out!',
  },
  {
    emoji: '⭐',
    title: 'Collect stars & coins!',
    description: 'Each emoji you tap gives you a star ⭐ and coins 🪙. Stars unlock quests and new zones!',
  },
  {
    emoji: '🔍',
    title: 'Find the secret!',
    description: 'There\'s a hidden secret in every zone. Look carefully — it might be behind a cloud!',
  },
]

interface ZoneGameProps {
  zone: Zone
  userId: string
  playerLevel: number
  completedQuestIds: string[]
  childName: string
  childAge: number
}

export default function ZoneGame({ zone, userId, playerLevel, completedQuestIds, childName, childAge }: ZoneGameProps) {
  const [savedStars] = useState(() => loadSavedStars(zone.id))
  const [localCompleted, setLocalCompleted] = useState<string[]>(completedQuestIds)
  const [showSummary, setShowSummary] = useState(false)
  const [secretFeedback, setSecretFeedback] = useState<string | null>(null)
  const { playStarCollect, playCoin, playLevelUp } = useSound()
  const { ask: askLio } = useLio({ childName, age: childAge, world: 'adventure' })
  const [lioMessage, setLioMessage] = useState<string | null>(null)

  const handleComplete = useCallback(async (stars: number, coins: number) => {
    setShowSummary(true)

    // Sync coins and completed quests with Supabase
    try {
      const supabase = createClient()
      const totalCoins = coins + checkNewlyCompletedQuests(stars)

      if (totalCoins > 0) {
        await supabase.rpc('add_coins', {
          p_user_id: userId,
          p_amount: totalCoins,
          p_reason: `adventure_${zone.id}`,
          p_world: 'adventure',
        })
      }

      // Complete new quests
      for (const quest of zone.quests) {
        if (!localCompleted.includes(quest.id) && stars >= quest.requiredStars) {
          try {
            await supabase.from('quest_completions').insert({
              user_id: userId,
              quest_id: quest.id,
            })
            setLocalCompleted(prev => [...prev, quest.id])
          } catch {
            // quest may have already been inserted
          }
        }
      }
    } catch {
      // silent
    }
  }, [userId, zone, localCompleted])

  function checkNewlyCompletedQuests(stars: number): number {
    let bonus = 0
    for (const quest of zone.quests) {
      if (!localCompleted.includes(quest.id) && stars >= quest.requiredStars) {
        bonus += quest.rewardCoins
      }
    }
    return bonus
  }

  const {
    floatingItems,
    collectedStars,
    totalStars,
    coinsThisSession,
    isRunning,
    isComplete,
    nearMissMessage,
    secretVisible,
    secretCollected,
    timeLeft,
    startGame,
    collectItem,
    collectSecret,
    handleCloudTap,
  } = useAdventureGame({ zone, savedStars, onComplete: handleComplete })

  // Lio AI messages on key events
  useEffect(() => {
    if (!isRunning) return
    askLio('session_start', { context: zone.name })
      .then(msg => { if (msg) { setLioMessage(msg); setTimeout(() => setLioMessage(null), 3000) } })
  }, [isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!secretCollected) return
    askLio('level_up', { context: `found secret in ${zone.name}` })
      .then(msg => { if (msg) { setLioMessage(msg); setTimeout(() => setLioMessage(null), 3000) } })
  }, [secretCollected]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isComplete) return
    askLio('session_end', { score: coinsThisSession, context: `${collectedStars} stars in ${zone.name}` })
      .then(msg => { if (msg) { setLioMessage(msg); setTimeout(() => setLioMessage(null), 4000) } })
  }, [isComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleCollectItem(id: string) {
    collectItem(id)
    playStarCollect()
    playCoin()
  }

  function handleSecretCollect() {
    collectSecret()
    playLevelUp()
    setSecretFeedback(`${zone.secret.rewardEmoji} Secret found! +${zone.secret.rewardCoins} 🪙`)
    setTimeout(() => setSecretFeedback(null), 3000)
  }

  const unlocked = isZoneUnlocked(zone, playerLevel)

  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
        <span className="text-6xl">🔒</span>
        <h2 className="font-fredoka text-2xl font-semibold text-[var(--gray)]">
          Zone locked
        </h2>
        <p className="font-nunito text-sm text-[var(--gray)]">
          You need level {zone.requiredLevel} to access {zone.name}.
        </p>
        <Link
          href="/play/adventure"
          className="rounded-full bg-[var(--mint-dark)] px-6 py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          ← Back to map
        </Link>
      </div>
    )
  }

  if (showSummary || isComplete) {
    const newQuests = zone.quests.filter(
      q => !completedQuestIds.includes(q.id) && collectedStars >= q.requiredStars
    )
    return (
      <ZoneSummary
        zone={zone}
        collectedStars={collectedStars}
        coinsEarned={coinsThisSession + newQuests.reduce((s, q) => s + q.rewardCoins, 0)}
        newlyCompletedQuests={newQuests.map(q => q.title)}
        onPlayAgain={() => {
          setShowSummary(false)
          startGame()
        }}
      />
    )
  }

  return (
    <div
      className="game-container min-h-screen flex flex-col px-4 py-4"
      style={{ background: zone.bgGradient, minHeight: '100dvh' }}
    >
      <HowToPlayOverlay
        storageKey="howtoplay_adventure"
        worldColor={zone.color}
        steps={ADVENTURE_TUTORIAL}
      />

      {/* HUD top */}
      <div className="flex items-center justify-between gap-3 mb-3 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm border border-black/5">
        <Link
          href="/play/adventure"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 text-[var(--gray)] active:scale-95 transition-transform text-sm font-bold"
          style={{ touchAction: 'manipulation', border: '1px solid rgba(0,0,0,0.08)' }}
          aria-label="Back"
        >
          ←
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg">{zone.emoji}</span>
          <span className="font-fredoka text-sm font-semibold" style={{ color: zone.color }}>
            {zone.name}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalStars }).map((_, i) => (
            <span
              key={i}
              className="text-sm transition-all"
              style={{
                opacity: i < collectedStars ? 1 : 0.3,
                transform: i < collectedStars ? 'scale(1.1)' : 'scale(1)',
                filter: i < collectedStars ? 'none' : 'grayscale(1)',
              }}
              aria-hidden="true"
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Timer (if running) */}
      {isRunning && (
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex-1 h-2 rounded-full overflow-hidden mr-3"
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(timeLeft / 60) * 100}%`,
                background: timeLeft > 20
                  ? `linear-gradient(90deg, ${zone.color}, ${zone.color}aa)`
                  : 'linear-gradient(90deg, var(--coral), var(--coral-dark))',
              }}
            />
          </div>
          <span
            className="font-fredoka text-base font-semibold flex-shrink-0"
            style={{ color: timeLeft > 20 ? zone.color : 'var(--coral)' }}
          >
            {timeLeft}s
          </span>
          <span className="ml-2 font-fredoka text-base font-semibold text-[var(--sun-dark)]">
            🪙 +{coinsThisSession}
          </span>
        </div>
      )}

      {/* Near-miss message */}
      {nearMissMessage && isRunning && (
        <div
          className="mb-2 text-center rounded-2xl bg-white/90 px-3 py-2 shadow-sm"
          style={{ animation: 'slide-up 0.3s ease' }}
        >
          <p
            className="font-nunito text-sm font-semibold"
            style={{ color: zone.color }}
          >
            {nearMissMessage}
          </p>
        </div>
      )}

      {/* Secret feedback */}
      {secretFeedback && (
        <div
          className="mb-2 text-center rounded-2xl px-4 py-2 bg-[var(--sun)]/20 border border-[var(--sun)]/30"
          style={{ animation: 'pop 0.4s ease' }}
        >
          <p className="font-nunito text-sm font-bold text-[var(--sun-dark)]">
            {secretFeedback}
          </p>
        </div>
      )}

      {/* Lio AI message */}
      {lioMessage && (
        <div
          className="mb-2 text-center rounded-2xl bg-white/90 px-3 py-2 shadow-sm border border-black/5"
          style={{ animation: 'slide-up 0.3s ease' }}
        >
          <p className="font-nunito text-sm font-semibold" style={{ color: zone.color }}>
            🦁 {lioMessage}
          </p>
        </div>
      )}

      {/* Collection area */}
      <div className="flex-1 flex flex-col gap-3">
        {!isRunning ? (
          /* Start screen */
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <span className="text-7xl" style={{ animation: 'float 2s ease-in-out infinite' }}>
              {zone.emoji}
            </span>
            <div className="text-center">
              <h2 className="font-fredoka text-2xl font-semibold" style={{ color: zone.color }}>
                {zone.name}
              </h2>
              <p className="font-nunito text-sm text-[var(--gray)] mt-1">
                {zone.description}
              </p>
              {savedStars > 0 && (
                <p className="font-nunito text-xs text-[var(--gray)] mt-2">
                  You already have {savedStars}/{totalStars} ⭐
                </p>
              )}
            </div>

            {/* Discreet secret hint */}
            <p className="font-nunito text-xs text-[var(--gray)] opacity-60 text-center px-6">
              💡 Psst... there's a hidden secret in this zone!
            </p>

            <button
              onClick={startGame}
              className="rounded-full px-10 py-4 font-nunito text-lg font-semibold text-white shadow-lg active:scale-95 transition-transform"
              style={{
                touchAction: 'manipulation',
                background: `linear-gradient(90deg, ${zone.color}, ${zone.color}cc)`,
                minWidth: '200px',
                minHeight: '60px',
              }}
            >
              {savedStars > 0 ? '▶️ Continue' : '🗺️ Explore!'}
            </button>
          </div>
        ) : (
          /* Active game */
          <>
            <StarCollector
              floatingItems={floatingItems}
              onCollect={handleCollectItem}
              bgGradient={zone.bgGradient}
              secretVisible={secretVisible && !secretCollected}
              secretEmoji={zone.secret.rewardEmoji}
              onSecretCollect={handleSecretCollect}
              onCloudTap={handleCloudTap}
              zoneEmoji={zone.emoji}
            />

            {/* Compact quest tracker */}
            <QuestTracker
              quests={zone.quests}
              collectedStars={collectedStars}
              completedQuestIds={localCompleted}
            />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Zone Summary ─────────────────────────────────────────────────────────────

interface ZoneSummaryProps {
  zone: Zone
  collectedStars: number
  coinsEarned: number
  newlyCompletedQuests: string[]
  onPlayAgain: () => void
}

function ZoneSummary({ zone, collectedStars, coinsEarned, newlyCompletedQuests, onPlayAgain }: ZoneSummaryProps) {
  const complete = collectedStars >= zone.totalStars

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center gap-5 rounded-3xl bg-white px-8 py-10 shadow-lg border border-black/5 text-center max-w-sm w-full"
        style={{ animation: 'slide-up 0.4s ease' }}
      >
        <span
          className="text-7xl"
          style={{ animation: 'pop 0.5s ease, bounce-soft 2s 0.5s ease infinite' }}
        >
          {complete ? '🏆' : zone.emoji}
        </span>

        <div>
          <h2
            className="font-fredoka text-2xl font-semibold"
            style={{ color: zone.color }}
          >
            {complete ? 'Zone complete!' : 'Great job!'}
          </h2>
          <p className="font-nunito text-sm text-[var(--gray)] mt-1">{zone.name}</p>
        </div>

        {/* Stars */}
        <div className="flex gap-1">
          {Array.from({ length: zone.totalStars }).map((_, i) => (
            <span
              key={i}
              className="text-2xl"
              style={{
                opacity: i < collectedStars ? 1 : 0.25,
                filter: i < collectedStars ? 'none' : 'grayscale(1)',
                animation: i < collectedStars ? `pop 0.3s ease ${i * 0.1}s both` : undefined,
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Coins */}
        {coinsEarned > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-3xl">🪙</span>
            <span className="font-fredoka text-3xl font-semibold text-[var(--sun-dark)]">
              +{coinsEarned}
            </span>
          </div>
        )}

        {/* Completed quests */}
        {newlyCompletedQuests.length > 0 && (
          <div className="w-full rounded-2xl bg-[var(--mint-dark)]/10 p-3 text-left">
            <p className="font-nunito text-xs font-bold text-[var(--mint-dark)] mb-2">
              🎯 Quests completed:
            </p>
            {newlyCompletedQuests.map(title => (
              <p key={title} className="font-nunito text-sm text-[var(--dark)]">
                ✅ {title}
              </p>
            ))}
          </div>
        )}

        {/* Collection album hint */}
        {complete && (
          <div className="rounded-2xl bg-[var(--sky)]/10 px-4 py-3 text-center">
            <p className="font-nunito text-sm text-[var(--sky-dark)]">
              {zone.postcardEmoji} Postcard added to your album!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onPlayAgain}
            className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
            style={{
              touchAction: 'manipulation',
              background: `linear-gradient(90deg, ${zone.color}, ${zone.color}cc)`,
            }}
          >
            {complete ? '🔄 Play again' : '▶️ Collect more'}
          </button>
          <Link
            href="/play/adventure"
            className="rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-nunito text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform text-center"
            style={{ touchAction: 'manipulation' }}
          >
            🗺️ Map
          </Link>
        </div>
      </div>
    </div>
  )
}
