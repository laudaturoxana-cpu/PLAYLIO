'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { getLettersBySeries, SERIES_INFO, type SeriesId } from '@/lib/learning/phonetics'
import { useAdaptiveGame, countMastered } from '@/lib/learning/useAdaptiveGame'
import { syncPendingToSupabase } from '@/lib/learning/offlineSync'
import { createClient } from '@/lib/supabase/client'
import LioGuide from '@/components/learning/LioGuide'
import LioTeacher from '@/components/learning/LioTeacher'
import LetterDisplay from '@/components/learning/LetterDisplay'
import ChoiceButton from '@/components/learning/ChoiceButton'
import FeedbackOverlay from '@/components/learning/FeedbackOverlay'
import GameHUD from '@/components/learning/GameHUD'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import { useSound } from '@/lib/sound/useSound'
import { useLio } from '@/lib/ai/useLio'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { LetterData } from '@/lib/learning/phonetics'

const LETTERS_TUTORIAL = [
  {
    emoji: '👀',
    title: 'Look at the picture!',
    description: 'Lio shows you a picture. Listen to the word and find the first letter!',
  },
  {
    emoji: '🔤',
    title: 'Tap the right letter!',
    description: 'Tap the letter that starts the word. You earn a coin for every correct answer! 🪙',
  },
  {
    emoji: '⭐',
    title: 'Master letters to level up!',
    description: 'Get a letter right many times and it becomes yours forever! Collect them all!',
  },
]

interface LetterGameProps {
  userId: string
  initialCoins: number
  series: SeriesId
  childName: string
  childAge: number
}

// Number of questions per session (attention window for ages 3-5 = 5 minutes)
const QUESTIONS_PER_SESSION = 10

export default function LetterGame({ userId, initialCoins, series, childName, childAge }: LetterGameProps) {
  const targetLetters = getLettersBySeries(series)
  const seriesInfo = SERIES_INFO[series]
  const { playCorrect, playWrong, playLevelUp, playCoin } = useSound()
  const { lang } = useLanguage()
  const { ask: askLio, teach, hint, socratic } = useLio({ childName, age: childAge, world: 'letters', lang })
  const [aiLioMessage, setAiLioMessage] = useState<string | null>(null)
  const streakRef = useRef(0)

  // Per-letter wrong count — drives teach/hint/socratic escalation
  const wrongCountMap = useRef<Record<string, number>>({})
  const [teachMessage, setTeachMessage]       = useState<string | null>(null)
  const [teachLoading, setTeachLoading]       = useState(false)
  const [teachMode, setTeachMode]             = useState<'teach' | 'hint' | 'socratic'>('teach')
  const [showTeacher, setShowTeacher]         = useState(false)

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

  // Play sound when feedback arrives
  useEffect(() => {
    if (feedback === 'correct') { playCorrect(); playCoin() }
    else if (feedback === 'wrong') playWrong()
    else if (feedback === 'level_up' || feedback === 'mastered') playLevelUp()
  }, [feedback]) // eslint-disable-line react-hooks/exhaustive-deps

  // Ask Lio AI for personalized message on feedback
  useEffect(() => {
    if (!feedback || !currentQuestion) return
    const letter = currentQuestion.targetLetter.letter
    const word    = currentQuestion.targetLetter.wordRo ?? currentQuestion.targetLetter.word

    if (feedback === 'correct') {
      streakRef.current += 1
      wrongCountMap.current[letter] = 0 // reset wrong count on correct
      const evt = streakRef.current >= 3 ? 'streak' : 'correct'
      askLio(evt, {
        context: `litera ${letter} — cuvântul: ${word}`,
        streak: streakRef.current >= 3 ? streakRef.current : undefined,
      }).then(msg => { if (msg) { setAiLioMessage(msg); setTimeout(() => setAiLioMessage(null), 3000) } })

    } else if (feedback === 'wrong') {
      streakRef.current = 0
      const wrongCount = (wrongCountMap.current[letter] ?? 0) + 1
      wrongCountMap.current[letter] = wrongCount

      const chosenLtr = chosenLetter?.letter ?? '?'
      const teachOpts = {
        wrongAnswer:   `${chosenLtr} (pentru cuvântul ${chosenLetter?.wordRo ?? chosenLetter?.word ?? '?'})`,
        correctAnswer: `${letter} (${word})`,
        questionText:  `Găsește prima literă din cuvântul: ${word}`,
        attemptCount:  wrongCount,
        context:       `litera ${letter}, copilul a ales ${chosenLtr}`,
      }

      if (wrongCount === 1) {
        // First wrong: quick encouragement
        askLio('wrong', { context: `litera ${letter}` })
          .then(msg => { if (msg) { setAiLioMessage(msg); setTimeout(() => setAiLioMessage(null), 2500) } })
      } else if (wrongCount === 2) {
        // Second wrong: hint mode
        setTeachMode('hint')
        setTeachMessage(null)
        setTeachLoading(true)
        setShowTeacher(true)
        hint(teachOpts).then(msg => {
          setTeachLoading(false)
          if (msg) setTeachMessage(msg)
        })
      } else if (wrongCount === 3) {
        // Third wrong: socratic question
        setTeachMode('socratic')
        setTeachMessage(null)
        setTeachLoading(true)
        setShowTeacher(true)
        socratic(teachOpts).then(msg => {
          setTeachLoading(false)
          if (msg) setTeachMessage(msg)
        })
      } else {
        // 4th+ wrong: full teacher explanation
        setTeachMode('teach')
        setTeachMessage(null)
        setTeachLoading(true)
        setShowTeacher(true)
        teach(teachOpts).then(msg => {
          setTeachLoading(false)
          if (msg) setTeachMessage(msg)
        })
      }

    } else if (feedback === 'level_up' || feedback === 'mastered') {
      streakRef.current = 0
      wrongCountMap.current[letter] = 0
      setShowTeacher(false)
      setTeachMessage(null)
      askLio('level_up', { context: `a stăpânit litera ${letter}` })
        .then(msg => { if (msg) { setAiLioMessage(msg); setTimeout(() => setAiLioMessage(null), 3000) } })
    }
  }, [feedback]) // eslint-disable-line react-hooks/exhaustive-deps

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
      className="game-container min-h-screen flex flex-col px-4 py-5 gap-4"
      style={{
        background: 'linear-gradient(180deg, rgba(79,195,247,0.06) 0%, rgba(255,213,79,0.04) 100%)',
        backgroundColor: 'var(--white)',
      }}
    >
      <HowToPlayOverlay
        storageKey="howtoplay_letters"
        worldColor={seriesInfo.color}
        steps={LETTERS_TUTORIAL}
      />

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
        message={aiLioMessage ?? lioMessage}
        situation={lioSituation}
        className="mb-2"
      />

      {/* Lio Teacher — apare după greșeli repetate */}
      {showTeacher && (
        <LioTeacher
          message={teachMessage}
          isLoading={teachLoading}
          mode={teachMode}
          onDismiss={() => { setShowTeacher(false); setTeachMessage(null) }}
        />
      )}

      {/* Feedback overlay */}
      <FeedbackOverlay
        feedback={feedback}
        coins={pendingCoins}
        onDone={handleFeedbackDone}
        autoAdvanceMs={feedback === 'wrong' ? (showTeacher ? 4000 : 900) : 1000}
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
            <span className="font-nunito text-xs text-[var(--gray)]">monede câștigate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">⭐</span>
            <span className="font-fredoka text-2xl font-semibold text-[var(--mint-dark)]">
              {masteredCount}/{totalLetters}
            </span>
            <span className="font-nunito text-xs text-[var(--gray)]">litere stăpânite</span>
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
            Joacă mai mult! 🎮
          </button>
          <a
            href="/play/learning"
            className="rounded-full border-2 border-[var(--gray-light,#e0e0e0)] py-3 font-nunito text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform text-center"
            style={{ touchAction: 'manipulation' }}
          >
            Înapoi la hartă 🗺️
          </a>
        </div>
      </div>
    </div>
  )
}
