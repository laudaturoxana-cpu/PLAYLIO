'use client'

import { useEffect, useCallback, useState } from 'react'
import { getLettersBySeries, SERIES_INFO, type SeriesId } from '@/lib/learning/phonetics'
import { useAdaptiveGame, countMastered } from '@/lib/learning/useAdaptiveGame'
import { syncPendingToSupabase } from '@/lib/learning/offlineSync'
import { createClient } from '@/lib/supabase/client'
import LioGuide from '@/components/learning/LioGuide'
import LetterDisplay from '@/components/learning/LetterDisplay'
import ChoiceButton from '@/components/learning/ChoiceButton'
import FeedbackOverlay from '@/components/learning/FeedbackOverlay'
import GameHUD from '@/components/learning/GameHUD'
import type { LetterData } from '@/lib/learning/phonetics'

interface LetterGameProps {
  userId: string
  initialCoins: number
  series: SeriesId
}

// Number of questions per session (attention window for ages 3-5 = 5 minutes)
const QUESTIONS_PER_SESSION = 10

export default function LetterGame({ userId, initialCoins, series }: LetterGameProps) {
  const targetLetters = getLettersBySeries(series)
  const seriesInfo = SERIES_INFO[series]

  const {
    currentQuestion,
    allProgress,
    feedback,
    pendingCoins,
    totalCoinsThisSession,
    questionsAnswered,
    lioMessage,
    lioSituation,
    showAnswerHighlight,
    isLoading,
    answer,
    nextQuestion,
  } = useAdaptiveGame(userId, targetLetters)

  const [chosenLetter, setChosenLetter] = useState<LetterData | null>(null)
  const [sessionDone, setSessionDone] = useState(false)

  // Sync coins with Supabase on exit / session end
  const syncCoins = useCallback(async (coins: number) => {
    if (coins <= 0) return
    try {
      const supabase = createClient()
      await supabase.rpc('add_coins', {
        p_user_id: userId,
        p_amount: coins,
        p_reason: 'letters_game',
        p_world: 'learning',
      })
    } catch {
      // silent — will sync on reconnect
    }
  }, [userId])

  // Sync at session end
  useEffect(() => {
    if (sessionDone) {
      syncCoins(totalCoinsThisSession)
      syncPendingToSupabase(userId)
    }
  }, [sessionDone, totalCoinsThisSession, syncCoins, userId])

  // Sync on unmount (exit from game)
  useEffect(() => {
    return () => {
      syncPendingToSupabase(userId)
    }
  }, [userId])

  function handleAnswer(letter: LetterData) {
    setChosenLetter(letter)
    answer(letter)
  }

  function handleFeedbackDone() {
    setChosenLetter(null)
    if (questionsAnswered >= QUESTIONS_PER_SESSION) {
      setSessionDone(true)
      return
    }
    nextQuestion()
  }

  const masteredCount = countMastered(targetLetters, allProgress)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl" style={{ animation: 'bounce-soft 1s infinite' }}>📚</span>
          <p className="font-nunito text-sm text-[var(--gray)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (sessionDone) {
    return <SessionSummary
      totalCoins={totalCoinsThisSession}
      masteredCount={masteredCount}
      totalLetters={targetLetters.length}
      seriesInfo={seriesInfo}
      onContinue={() => {
        setSessionDone(false)
        nextQuestion()
      }}
    />
  }

  if (!currentQuestion) return null

  const { targetLetter, choices, level, hintEnabled } = currentQuestion

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-4 max-w-sm mx-auto"
      style={{
        background: 'linear-gradient(180deg, rgba(79,195,247,0.06) 0%, rgba(255,213,79,0.04) 100%)',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* HUD */}
      <GameHUD
        questionsAnswered={questionsAnswered}
        totalQuestions={QUESTIONS_PER_SESSION}
        coinsThisSession={totalCoinsThisSession}
        masteredCount={masteredCount}
        totalLetters={targetLetters.length}
      />

      {/* Level indicator */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map(lvl => (
          <div
            key={lvl}
            className="rounded-full transition-all"
            style={{
              width: lvl === level ? '10px' : '6px',
              height: lvl === level ? '10px' : '6px',
              backgroundColor:
                lvl < level
                  ? 'var(--mint-dark)'
                  : lvl === level
                  ? seriesInfo.color
                  : 'var(--gray-light, #e0e0e0)',
            }}
            aria-label={`Level ${lvl}${lvl === level ? ' active' : ''}`}
          />
        ))}
        <span className="font-nunito text-xs text-[var(--gray)] ml-1">
          Level {level}
        </span>
      </div>

      {/* Target letter + image */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <LetterDisplay
          letter={targetLetter}
          showLetter={level <= 2}
          animate
        />
      </div>

      {/* Choice grid */}
      <div
        className={`grid gap-3 mb-4 ${
          choices.length === 2
            ? 'grid-cols-2'
            : choices.length === 3
            ? 'grid-cols-3'
            : 'grid-cols-2'
        }`}
      >
        {choices.map(choice => {
          const wasChosen = chosenLetter?.letter === choice.letter
          const isCorrect = choice.letter === targetLetter.letter
          const showHint =
            hintEnabled &&
            feedback === 'wrong' &&
            isCorrect

          return (
            <ChoiceButton
              key={choice.letter}
              letter={choice}
              onChoose={handleAnswer}
              isHighlighted={showAnswerHighlight === choice.letter}
              isDisabled={feedback !== null}
              showHint={showHint}
              wasChosen={wasChosen}
              wasCorrect={wasChosen ? isCorrect : undefined}
            />
          )
        })}
      </div>

      {/* Lio Guide */}
      <LioGuide
        message={lioMessage}
        situation={lioSituation}
        className="mb-4"
      />

      {/* Feedback overlay */}
      <FeedbackOverlay
        feedback={feedback}
        coins={pendingCoins}
        onDone={handleFeedbackDone}
        autoAdvanceMs={feedback === 'wrong' ? 900 : 1000}
      />
    </div>
  )
}

// ─── Session Summary ──────────────────────────────────────────────────────────

interface SessionSummaryProps {
  totalCoins: number
  masteredCount: number
  totalLetters: number
  seriesInfo: { title: string; emoji: string; color: string }
  onContinue: () => void
}

function SessionSummary({ totalCoins, masteredCount, totalLetters, seriesInfo, onContinue }: SessionSummaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center gap-5 rounded-3xl bg-white px-8 py-10 shadow-lg border border-black/5 text-center max-w-sm w-full"
        style={{ animation: 'slide-up 0.4s ease' }}
      >
        {/* Fanfare 2 seconds — animated emoji */}
        <span
          className="text-6xl"
          style={{ animation: 'pop 0.5s ease, bounce-soft 2s 0.5s ease infinite' }}
        >
          {seriesInfo.emoji}
        </span>

        <div>
          <h2 className="font-fredoka text-2xl font-semibold" style={{ color: seriesInfo.color }}>
            Session complete!
          </h2>
          <p className="font-nunito text-base text-[var(--gray)] mt-1">
            {seriesInfo.title}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 w-full justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🪙</span>
            <span className="font-fredoka text-2xl font-semibold text-[var(--sun-dark)]">
              +{totalCoins}
            </span>
            <span className="font-nunito text-xs text-[var(--gray)]">coins earned</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">⭐</span>
            <span className="font-fredoka text-2xl font-semibold text-[var(--mint-dark)]">
              {masteredCount}/{totalLetters}
            </span>
            <span className="font-nunito text-xs text-[var(--gray)]">letters mastered</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onContinue}
            className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
            style={{
              touchAction: 'manipulation',
              background: `linear-gradient(90deg, ${seriesInfo.color}, ${seriesInfo.color}cc)`,
            }}
          >
            Play more! 🎮
          </button>
          <a
            href="/play/learning"
            className="rounded-full border-2 border-[var(--gray-light,#e0e0e0)] py-3 font-nunito text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform text-center"
            style={{ touchAction: 'manipulation' }}
          >
            Back to map 🗺️
          </a>
        </div>
      </div>
    </div>
  )
}
