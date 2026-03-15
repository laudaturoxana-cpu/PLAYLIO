'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generateMathQuestion, MATH_TOPIC_COLORS, MATH_TOPIC_EMOJIS, type MathQuestion } from '@/lib/learning/math'
import { useSound } from '@/lib/sound/useSound'
import { useLio } from '@/lib/ai/useLio'
import { createClient } from '@/lib/supabase/client'

interface NumberGameProps {
  userId: string
  age: number
  profileName: string
}

const QUESTIONS_PER_SESSION = 10

export default function NumberGame({ userId, age, profileName }: NumberGameProps) {
  const [question, setQuestion] = useState<MathQuestion | null>(null)
  const [chosen, setChosen] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [totalCoins, setTotalCoins] = useState(0)
  const [streak, setStreak] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)
  const [lioMessage, setLioMessage] = useState<string | null>(null)
  const { playCorrect, playWrong, playLevelUp, playCoin } = useSound()
  const { ask: askLio } = useLio({ childName: profileName, age, world: 'numbers' })

  useEffect(() => {
    setQuestion(generateMathQuestion(age))
    // Welcome message on mount
    askLio('session_start').then(msg => { if (msg) setLioMessage(msg) })
  }, [age]) // eslint-disable-line react-hooks/exhaustive-deps

  const syncCoins = useCallback(async (coins: number) => {
    if (coins <= 0) return
    try {
      const supabase = createClient()
      await supabase.rpc('add_coins', {
        p_user_id: userId,
        p_amount: coins,
        p_reason: 'math_game',
        p_world: 'learning',
      })
    } catch {
      // silent
    }
  }, [userId])

  function handleAnswer(choice: number) {
    if (feedback !== null || !question) return
    setChosen(choice)

    const isCorrect = choice === question.correctAnswer
    const newStreak = isCorrect ? streak + 1 : 0

    if (isCorrect) {
      setFeedback('correct')
      playCorrect()
      playCoin()
      setStreak(newStreak)
      const earned = streak >= 2 ? question.coinsReward * 2 : question.coinsReward
      setTotalCoins(c => c + earned)

      // Ask Lio for AI message (streak or correct)
      const event = newStreak >= 3 ? 'streak' : 'correct'
      askLio(event, {
        context: `answered ${question.question}`,
        streak: newStreak,
      }).then(msg => { if (msg) setLioMessage(msg) })
    } else {
      setFeedback('wrong')
      playWrong()
      setStreak(0)

      askLio('wrong', {
        context: `tried ${question.question}, correct was ${question.correctAnswer}`,
      }).then(msg => { if (msg) setLioMessage(msg) })
    }

    setTimeout(() => {
      const next = questionsAnswered + 1
      setQuestionsAnswered(next)
      setChosen(null)
      setFeedback(null)

      if (next >= QUESTIONS_PER_SESSION) {
        askLio('session_end', { score: totalCoins }).then(msg => { if (msg) setLioMessage(msg) })
        setSessionDone(true)
        return
      }
      setQuestion(generateMathQuestion(age))
    }, feedback === 'wrong' ? 1200 : 900)
  }

  useEffect(() => {
    if (sessionDone) syncCoins(totalCoins)
  }, [sessionDone, totalCoins, syncCoins])

  if (sessionDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="flex flex-col items-center gap-5 rounded-3xl bg-white px-8 py-10 shadow-lg border border-black/5 text-center max-w-sm w-full"
          style={{ animation: 'slide-up 0.4s ease' }}
        >
          <span className="text-6xl" style={{ animation: 'pop 0.5s ease, bounce-soft 2s 0.5s infinite' }}>
            🔢
          </span>
          <div>
            <h2 className="font-fredoka text-2xl font-semibold" style={{ color: '#FF7043' }}>
              Math session done!
            </h2>
            <p className="font-nunito text-sm mt-1" style={{ color: 'var(--gray)' }}>
              You answered {QUESTIONS_PER_SESSION} questions!
            </p>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">🪙</span>
              <span className="font-fredoka text-2xl font-semibold" style={{ color: '#F57F17' }}>+{totalCoins}</span>
              <span className="font-nunito text-xs" style={{ color: 'var(--gray)' }}>coins earned</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">🔥</span>
              <span className="font-fredoka text-2xl font-semibold" style={{ color: '#F44336' }}>{streak}</span>
              <span className="font-nunito text-xs" style={{ color: 'var(--gray)' }}>best streak</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                setSessionDone(false)
                setQuestionsAnswered(0)
                setTotalCoins(0)
                setStreak(0)
                setQuestion(generateMathQuestion(age))
              }}
              className="rounded-full py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-md"
              style={{ touchAction: 'manipulation', background: 'linear-gradient(90deg, #FF7043, #FF5722)' }}
            >
              🔄 Play again!
            </button>
            <Link
              href="/play/learning"
              className="rounded-full border-2 py-3 font-nunito text-base font-semibold text-center active:scale-95 transition-transform"
              style={{ touchAction: 'manipulation', borderColor: 'rgba(0,0,0,0.1)', color: 'var(--gray)' }}
            >
              ← Back to Learning
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!question) return null

  const topicColor = MATH_TOPIC_COLORS[question.topic]
  const topicEmoji = MATH_TOPIC_EMOJIS[question.topic]

  return (
    <div
      className="game-container min-h-screen flex flex-col px-4 py-5 gap-4"
      style={{
        background: 'linear-gradient(180deg, rgba(255,112,67,0.05) 0%, rgba(255,213,79,0.04) 100%)',
      }}
    >
      {/* HUD */}
      <div className="flex items-center justify-between mb-3">
        <Link
          href="/play/learning"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation', color: 'var(--gray)' }}
          aria-label="Back"
        >
          ←
        </Link>
        <div className="text-center">
          <p className="font-fredoka text-base font-semibold" style={{ color: topicColor }}>
            {topicEmoji} Math World
          </p>
          <p className="font-nunito text-xs" style={{ color: 'var(--gray)' }}>
            {questionsAnswered}/{QUESTIONS_PER_SESSION} questions
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-full px-2 py-1" style={{ backgroundColor: '#FFF8E1' }}>
            <span className="text-xs">🪙</span>
            <span className="font-fredoka text-sm font-semibold" style={{ color: '#F57F17' }}>{totalCoins}</span>
          </div>
          {streak >= 2 && (
            <span className="font-nunito text-[10px] font-bold" style={{ color: '#F44336' }}>
              🔥 {streak} streak!
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(questionsAnswered / QUESTIONS_PER_SESSION) * 100}%`,
            background: `linear-gradient(90deg, ${topicColor}, ${topicColor}cc)`,
          }}
        />
      </div>

      {/* Lio guide — shows AI message if available, otherwise static hint */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm border border-black/5 mb-4">
        <span className="text-2xl flex-shrink-0" style={{ animation: 'bounce-soft 2s infinite' }}>🦁</span>
        <div>
          <p className="font-nunito text-sm font-bold" style={{ color: topicColor }}>
            {lioMessage ?? (
              <>
                {question.topic === 'counting' && 'Count carefully! 👀'}
                {question.topic === 'addition' && 'Add them together! ➕'}
                {question.topic === 'subtraction' && 'Subtract! Take away ➖'}
                {question.topic === 'comparison' && 'Which is bigger? 🤔'}
              </>
            )}
          </p>
          <p className="font-nunito text-sm" style={{ color: 'var(--dark)' }}>
            {question.question}
          </p>
        </div>
      </div>

      {/* Visual question display */}
      <div
        className="flex-1 flex flex-col items-center justify-center py-6 rounded-3xl mb-4"
        style={{
          background: `${topicColor}10`,
          border: `2px solid ${topicColor}22`,
          minHeight: '160px',
        }}
      >
        <p
          className="font-nunito text-center leading-relaxed px-4"
          style={{
            fontSize: question.topic === 'counting' ? 'clamp(1.5rem, 6vw, 2.5rem)' : 'clamp(2rem, 8vw, 3.5rem)',
            wordBreak: 'break-word',
            color: topicColor,
          }}
        >
          {question.emoji}
        </p>
        {question.topic !== 'counting' && (
          <p
            className="font-fredoka font-semibold mt-2"
            style={{ fontSize: 'clamp(1.2rem, 5vw, 2rem)', color: topicColor }}
          >
            {question.question}
          </p>
        )}
      </div>

      {/* Answer choices */}
      <div
        className={`grid gap-3 mb-4 ${
          question.choices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {question.choices.map((choice) => {
          const wasChosen = chosen === choice
          const isCorrect = choice === question.correctAnswer
          const showResult = feedback !== null && wasChosen

          let bg = 'white'
          let border = '2px solid rgba(0,0,0,0.08)'
          let textColor = 'var(--dark)'

          if (showResult && isCorrect) {
            bg = '#E8F5E9'; border = '2px solid #4CAF50'; textColor = '#2E7D32'
          } else if (showResult && !isCorrect) {
            bg = '#FFEBEE'; border = '2px solid #EF5350'; textColor = '#C62828'
          } else if (feedback && isCorrect) {
            bg = '#E8F5E9'; border = '2px solid #4CAF50'; textColor = '#2E7D32'
          }

          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={feedback !== null}
              className="rounded-3xl py-4 font-fredoka font-semibold shadow-sm active:scale-95 transition-all"
              style={{
                touchAction: 'manipulation',
                backgroundColor: bg,
                border,
                color: textColor,
                fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
                minHeight: '72px',
                animation: showResult && isCorrect ? 'pop 0.3s ease' : undefined,
              }}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className="rounded-2xl px-4 py-3 text-center mb-2"
          style={{
            backgroundColor: feedback === 'correct' ? '#E8F5E9' : '#FFEBEE',
            animation: 'slide-up 0.2s ease',
          }}
        >
          <p
            className="font-nunito font-bold text-sm"
            style={{ color: feedback === 'correct' ? '#2E7D32' : '#C62828' }}
          >
            {feedback === 'correct'
              ? streak >= 3 ? `🔥 ${streak} in a row! Amazing!` : '✅ Correct! Great job!'
              : `❌ Not quite! The answer is ${question.correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  )
}
