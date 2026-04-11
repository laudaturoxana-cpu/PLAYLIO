'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Zone, MiniGame, QuizOption } from '@/lib/adventure/zones'
import { getAgeContent, getMiniGamesForAge, getOptionsCount, isZoneUnlocked } from '@/lib/adventure/zones'
import { createClient } from '@/lib/supabase/client'
import { useSound } from '@/lib/sound/useSound'
import { useLio } from '@/lib/ai/useLio'

// Stocăm în localStorage ce țări au fost vizitate
function markCountryVisited(countryId: string) {
  try {
    const raw = localStorage.getItem('adventure_visited') ?? '[]'
    const visited: string[] = JSON.parse(raw)
    if (!visited.includes(countryId)) {
      visited.push(countryId)
      localStorage.setItem('adventure_visited', JSON.stringify(visited))
    }
  } catch {
    // silent
  }
}

function saveStarsForCountry(countryId: string, stars: number) {
  try {
    localStorage.setItem(`adventure_stars_${countryId}`, String(stars))
  } catch {
    // silent
  }
}

export function loadSavedStars(zoneId: string): number {
  try {
    return parseInt(localStorage.getItem(`adventure_stars_${zoneId}`) ?? '0', 10)
  } catch {
    return 0
  }
}

interface ZoneGameProps {
  zone: Zone
  userId: string
  playerLevel: number
  completedQuestIds: string[]
  childName: string
  childAge: number
}

type GamePhase = 'intro' | 'quiz' | 'feedback' | 'summary'

export default function ZoneGame({
  zone,
  userId,
  playerLevel,
  completedQuestIds,
  childName,
  childAge,
}: ZoneGameProps) {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [miniGames, setMiniGames] = useState<MiniGame[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stars, setStars] = useState(() => loadSavedStars(zone.id))
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [funFact, setFunFact] = useState('')
  const [lioMessage, setLioMessage] = useState<string | null>(null)
  const [localCompleted, setLocalCompleted] = useState<string[]>(completedQuestIds)

  const { playCorrect, playWrong, playLevelUp } = useSound()
  const { ask: askLio } = useLio({ childName, age: childAge, world: 'adventure' })

  const ageContent = getAgeContent(zone, childAge)
  const optionsCount = getOptionsCount(childAge)
  const continent = zone.continentId ?? 'unknown'

  // Inițializare mini-jocuri
  useEffect(() => {
    const games = getMiniGamesForAge(zone, childAge)
    // Limităm opțiunile per vârstă
    const adapted = games.map(game => ({
      ...game,
      options: game.options.slice(0, optionsCount),
    }))
    setMiniGames(adapted)
  }, [zone.id, childAge]) // eslint-disable-line react-hooks/exhaustive-deps

  // Lio intro la pornire
  useEffect(() => {
    if (phase !== 'intro') return
    askLio('session_start', { context: `${zone.nameEn}, continent: ${continent}` })
      .then(msg => { if (msg) setLioMessage(msg) })
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentGame = miniGames[currentIndex] ?? null
  const totalQuestions = miniGames.length
  const isLastQuestion = currentIndex === totalQuestions - 1

  function handleAnswer(option: QuizOption) {
    if (phase !== 'quiz') return

    if (option.isCorrect) {
      playCorrect()
      const newStars = Math.min(stars + 1, zone.totalStars)
      setStars(newStars)
      setCoinsEarned(c => c + 10)
      saveStarsForCountry(zone.id, newStars)
      setFeedbackText(currentGame!.correctFeedback)
      setLastAnswerCorrect(true)
    } else {
      playWrong()
      setFeedbackText(currentGame!.wrongFeedback)
      setLastAnswerCorrect(false)
    }

    setFunFact(currentGame!.funFact)
    setPhase('feedback')
  }

  function handleNextQuestion() {
    if (isLastQuestion) {
      // Finalizare
      markCountryVisited(zone.id)
      playLevelUp()
      setPhase('summary')
      syncToSupabase()
    } else {
      setCurrentIndex(i => i + 1)
      setPhase('quiz')
      setLastAnswerCorrect(null)
    }
  }

  const syncToSupabase = useCallback(async () => {
    try {
      const supabase = createClient()
      if (coinsEarned > 0) {
        await supabase.rpc('add_coins', {
          p_user_id: userId,
          p_amount: coinsEarned,
          p_reason: `adventure_${zone.id}`,
          p_world: 'adventure',
        })
      }
      // Complete quests
      for (const quest of zone.quests) {
        if (!localCompleted.includes(quest.id) && stars >= quest.requiredStars) {
          try {
            await supabase.from('quest_completions').insert({
              user_id: userId,
              quest_id: quest.id,
            })
            setLocalCompleted(prev => [...prev, quest.id])
          } catch {
            // deja completat
          }
        }
      }
    } catch {
      // silent
    }
  }, [userId, zone, coinsEarned, stars, localCompleted])

  const unlocked = isZoneUnlocked(zone, playerLevel)

  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
        <span className="text-6xl">🔒</span>
        <h2 className="font-fredoka text-2xl font-semibold text-[#757575]">Continent blocat</h2>
        <p className="font-nunito text-sm text-[#757575]">
          Atinge nivel mai mare pentru a explora {zone.name}.
        </p>
        <Link
          href="/play/adventure"
          className="rounded-full bg-[#388E3C] px-6 py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          ← Înapoi la hartă
        </Link>
      </div>
    )
  }

  // ─── INTRO ────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div
        className="min-h-screen flex flex-col px-4 py-6"
        style={{ background: 'linear-gradient(to bottom, #E8F5E9 0%, #F1F8E9 100%)' }}
      >
        <div className="flex items-center mb-6">
          <Link
            href="/play/adventure"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[#757575] active:scale-95 transition-transform text-lg"
            style={{ touchAction: 'manipulation' }}
            aria-label="Înapoi"
          >
            ←
          </Link>
        </div>

        {/* Card țară */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg border border-black/5 text-center flex flex-col items-center gap-4"
            style={{ animation: 'slide-up 0.4s ease' }}
          >
            {/* Steag mare */}
            <span style={{ fontSize: '5rem' }}>{zone.flag}</span>

            <div>
              <h1 className="font-fredoka text-3xl font-semibold text-[#212121]">{zone.name}</h1>
              <p className="font-nunito text-sm text-[#757575] mt-1">
                {zone.capitalEmoji} {zone.capital}
              </p>
            </div>

            {/* Info rapide */}
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <span style={{ fontSize: '1.5rem' }}>{zone.animalEmoji}</span>
                <p className="font-nunito text-[10px] text-[#9E9E9E]">{zone.animal}</p>
              </div>
              <div className="text-center">
                <span style={{ fontSize: '1.5rem' }}>{zone.landmarkEmoji}</span>
                <p className="font-nunito text-[10px] text-[#9E9E9E]">{zone.landmark}</p>
              </div>
            </div>

            {/* Lio intro mesaj */}
            <div className="flex items-start gap-2 rounded-2xl bg-[#E8F5E9] px-4 py-3 w-full text-left">
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🦁</span>
              <p className="font-nunito text-sm text-[#2E7D32] leading-relaxed">
                {lioMessage ?? ageContent.lioIntro}
              </p>
            </div>

            {/* Stele anterioare */}
            {stars > 0 && (
              <p className="font-nunito text-xs text-[#757575]">
                Ai deja {stars} ⭐ de la vizita anterioară!
              </p>
            )}
          </div>

          {/* Buton start */}
          <button
            onClick={() => setPhase('quiz')}
            className="rounded-full px-10 py-4 font-nunito text-lg font-semibold text-white shadow-lg active:scale-95 transition-transform"
            style={{
              touchAction: 'manipulation',
              background: 'linear-gradient(90deg, #388E3C, #4CAF50)',
              minWidth: '200px',
              minHeight: '60px',
            }}
          >
            {stars > 0 ? '▶️ Continuă explorarea' : '🌍 Explorează!'}
          </button>
        </div>
      </div>
    )
  }

  // ─── SUMMARY ─────────────────────────────────────────────────
  if (phase === 'summary') {
    const newQuests = zone.quests.filter(
      q => !completedQuestIds.includes(q.id) && stars >= q.requiredStars
    )
    const builderUnlock = zone.builderBlockUnlock

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-6">
        <div
          className="flex flex-col items-center gap-5 rounded-3xl bg-white px-8 py-10 shadow-lg border border-black/5 text-center max-w-sm w-full"
          style={{ animation: 'slide-up 0.4s ease' }}
        >
          <span className="text-7xl" style={{ animation: 'pop 0.5s ease, bounce-soft 2s 0.5s ease infinite' }}>
            {zone.flag}
          </span>

          <div>
            <h2 className="font-fredoka text-2xl font-semibold text-[#388E3C]">
              {zone.name} explorată! 🎉
            </h2>
            <p className="font-nunito text-sm text-[#757575] mt-1">
              Ești un adevărat explorator al lumii!
            </p>
          </div>

          {/* Stele */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="text-3xl"
                style={{
                  opacity: i < stars ? 1 : 0.25,
                  filter: i < stars ? 'none' : 'grayscale(1)',
                  animation: i < stars ? `pop 0.3s ease ${i * 0.15}s both` : undefined,
                }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Monede */}
          {coinsEarned > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-3xl">🪙</span>
              <span className="font-fredoka text-3xl font-semibold text-[#F57F17]">
                +{coinsEarned}
              </span>
            </div>
          )}

          {/* Builder block deblocat */}
          {builderUnlock && (
            <div className="rounded-2xl bg-[#FFF8E1] border border-[#FFE082] px-4 py-3 w-full text-left">
              <p className="font-nunito text-xs font-bold text-[#F57F17] mb-1">
                🧱 Bloc nou deblocat în Builder World!
              </p>
              <p className="font-nunito text-sm text-[#E65100]">
                Blocul <strong>{builderUnlock}</strong> e acum disponibil!
              </p>
            </div>
          )}

          {/* Quest completat */}
          {newQuests.length > 0 && (
            <div className="w-full rounded-2xl bg-[#E8F5E9] p-3 text-left">
              <p className="font-nunito text-xs font-bold text-[#388E3C] mb-2">
                🎯 Quest completat:
              </p>
              {newQuests.map(q => (
                <p key={q.id} className="font-nunito text-sm text-[#212121]">✅ {q.title}</p>
              ))}
            </div>
          )}

          {/* Carte poștală album */}
          <div className="rounded-2xl bg-[#E3F2FD] px-4 py-3 text-center">
            <p className="font-nunito text-sm text-[#0288D1]">
              {zone.postcardEmoji} Carte poștală adăugată în albumul tău!
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                setCurrentIndex(0)
                setStars(0)
                setCoinsEarned(0)
                setPhase('intro')
              }}
              className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
              style={{
                touchAction: 'manipulation',
                background: 'linear-gradient(90deg, #388E3C, #4CAF50)',
              }}
            >
              🔄 Joacă din nou
            </button>
            <Link
              href="/play/adventure"
              className="rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-nunito text-base font-semibold text-[#757575] active:scale-95 transition-transform text-center"
              style={{ touchAction: 'manipulation' }}
            >
              🌍 Înapoi la hartă
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── QUIZ ─────────────────────────────────────────────────────
  if (!currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-4xl" style={{ animation: 'bounce-soft 1s infinite' }}>🌍</span>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-5 gap-4"
      style={{ background: 'linear-gradient(to bottom, #E8F5E9 0%, #F1F8E9 100%)', minHeight: '100dvh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/play/adventure"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 text-[#757575] active:scale-95 transition-transform text-sm font-bold border border-black/8"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi"
        >
          ←
        </Link>

        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.2rem' }}>{zone.flag}</span>
          <span className="font-fredoka text-sm font-semibold text-[#388E3C]">
            {zone.name}
          </span>
        </div>

        {/* Progress întrebări */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: i < currentIndex ? '#388E3C' : i === currentIndex ? '#4CAF50' : 'rgba(0,0,0,0.15)',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Feedback phase */}
      {phase === 'feedback' && (
        <FeedbackCard
          correct={lastAnswerCorrect!}
          feedbackText={feedbackText}
          funFact={funFact}
          countryFlag={zone.flag}
          onNext={handleNextQuestion}
          isLast={isLastQuestion}
        />
      )}

      {/* Quiz phase */}
      {phase === 'quiz' && (
        <QuizCard
          key={currentIndex}
          game={currentGame}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          countryFlag={zone.flag}
          childAge={childAge}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  )
}

// ─── Quiz Card ─────────────────────────────────────────────────────────────────

function QuizCard({
  game,
  questionNumber,
  totalQuestions,
  countryFlag,
  childAge,
  onAnswer,
}: {
  game: MiniGame
  questionNumber: number
  totalQuestions: number
  countryFlag: string
  childAge: number
  onAnswer: (option: QuizOption) => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)

  function handleTap(option: QuizOption) {
    if (chosen) return
    setChosen(option.text)
    onAnswer(option)
  }

  const gameTypeEmoji: Record<string, string> = {
    flag_quiz: '🏳️',
    capital_quiz: '🏛️',
    animal_match: '🦁',
    landmark_quiz: '🏔️',
    fact_quiz: '🌍',
  }

  return (
    <div className="flex-1 flex flex-col gap-4" style={{ animation: 'slide-up 0.3s ease' }}>
      {/* Tip quiz */}
      <div className="flex items-center gap-2">
        <span>{gameTypeEmoji[game.type] ?? '❓'}</span>
        <span className="font-nunito text-xs text-[#757575]">
          Întrebarea {questionNumber} din {totalQuestions}
        </span>
      </div>

      {/* Întrebare */}
      <div
        className="rounded-3xl bg-white p-5 shadow-sm border border-black/5"
      >
        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontSize: '2.5rem' }}>{countryFlag}</span>
          <p className="font-nunito text-base font-semibold text-[#212121] leading-snug">
            {game.question}
          </p>
        </div>

        {/* Opțiuni răspuns */}
        <div className="flex flex-col gap-2.5">
          {game.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleTap(option)}
              disabled={!!chosen}
              className="w-full text-left rounded-2xl px-4 py-3 font-nunito text-sm font-semibold transition-all active:scale-98"
              style={{
                touchAction: 'manipulation',
                minHeight: '54px',
                backgroundColor: chosen === option.text
                  ? option.isCorrect ? '#E8F5E9' : '#FFEBEE'
                  : 'rgba(0,0,0,0.04)',
                border: chosen === option.text
                  ? `2px solid ${option.isCorrect ? '#388E3C' : '#EF5350'}`
                  : '2px solid rgba(0,0,0,0.06)',
                color: chosen === option.text
                  ? option.isCorrect ? '#1B5E20' : '#B71C1C'
                  : '#212121',
              }}
              aria-label={option.text}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Feedback Card ─────────────────────────────────────────────────────────────

function FeedbackCard({
  correct,
  feedbackText,
  funFact,
  countryFlag,
  onNext,
  isLast,
}: {
  correct: boolean
  feedbackText: string
  funFact: string
  countryFlag: string
  onNext: () => void
  isLast: boolean
}) {
  return (
    <div
      className="flex-1 flex flex-col gap-4"
      style={{ animation: 'slide-up 0.3s ease' }}
    >
      {/* Feedback principal */}
      <div
        className="rounded-3xl p-5 text-center flex flex-col items-center gap-3"
        style={{
          backgroundColor: correct ? '#E8F5E9' : '#FFEBEE',
          border: `2px solid ${correct ? '#A5D6A7' : '#FFCDD2'}`,
        }}
      >
        <span className="text-5xl">{correct ? '🌟' : '💪'}</span>
        <p
          className="font-nunito text-base font-semibold leading-snug"
          style={{ color: correct ? '#1B5E20' : '#B71C1C' }}
        >
          {feedbackText}
        </p>
        {correct && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="font-fredoka text-2xl font-semibold text-[#F57F17]">+10</span>
          </div>
        )}
      </div>

      {/* Fun fact */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-black/5">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🔍</span>
          <div>
            <p className="font-nunito text-xs font-bold text-[#0288D1] mb-1">
              Știai că…
            </p>
            <p className="font-nunito text-sm text-[#212121] leading-relaxed">
              {funFact}
            </p>
          </div>
        </div>
      </div>

      {/* Buton continuare */}
      <button
        onClick={onNext}
        className="mt-auto rounded-full py-4 font-nunito text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
        style={{
          touchAction: 'manipulation',
          background: 'linear-gradient(90deg, #388E3C, #4CAF50)',
          minHeight: '56px',
        }}
      >
        {isLast ? '🏆 Finalizează explorarea' : '➡️ Întrebarea următoare'}
      </button>
    </div>
  )
}
