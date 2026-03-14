'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  type ItemProgress,
  type Question,
  type LioSituation,
  getInitialProgress,
  updateProgress,
  generateQuestion,
  getLioMessage,
  calculateCoins,
} from './adaptiveEngine'
import { type LetterData, PHONETIC_LETTERS } from './phonetics'
import {
  saveProgressOffline,
  loadAllProgressOffline,
  queueForSync,
  setupOnlineSync,
} from './offlineSync'

export type FeedbackType = 'correct' | 'wrong' | 'level_up' | 'mastered' | null

export interface GameState {
  currentQuestion: Question | null
  allProgress: Map<string, ItemProgress>
  consecutiveWrong: number         // regula 3 greșeli
  lioMessage: string
  lioSituation: LioSituation
  feedback: FeedbackType
  pendingCoins: number
  totalCoinsThisSession: number
  questionsAnswered: number
  isLoading: boolean
  showAnswerHighlight: string | null  // nivel 1: evidențiază răspunsul corect
}

export interface UseAdaptiveGameReturn extends GameState {
  answer: (chosenLetter: LetterData) => void
  nextQuestion: (targetLetter?: LetterData) => void
  clearFeedback: () => void
}

const AUTO_SAVE_INTERVAL = 10_000  // 10 secunde

export function useAdaptiveGame(
  userId: string,
  targetLetters: LetterData[]
): UseAdaptiveGameReturn {
  const [allProgress, setAllProgress] = useState<Map<string, ItemProgress>>(new Map())
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [lioMessage, setLioMessage] = useState(getLioMessage('start'))
  const [lioSituation, setLioSituation] = useState<LioSituation>('start')
  const [feedback, setFeedback] = useState<FeedbackType>(null)
  const [pendingCoins, setPendingCoins] = useState(0)
  const [totalCoinsThisSession, setTotalCoinsThisSession] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showAnswerHighlight, setShowAnswerHighlight] = useState<string | null>(null)

  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const allProgressRef = useRef(allProgress)
  allProgressRef.current = allProgress

  // Încarcă progresul din IndexedDB la mount
  useEffect(() => {
    async function load() {
      const offline = await loadAllProgressOffline()
      const map = new Map<string, ItemProgress>()
      for (const p of offline) map.set(p.itemId, p)
      setAllProgress(map)
      setIsLoading(false)
    }
    load()
  }, [])

  // Setup auto-sync la revenirea conexiunii
  useEffect(() => {
    const cleanup = setupOnlineSync(userId)
    return cleanup
  }, [userId])

  // Auto-save la fiecare 10s
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      const current = allProgressRef.current
      current.forEach((progress) => {
        saveProgressOffline(progress)
      })
    }, AUTO_SAVE_INTERVAL)
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current)
    }
  }, [])

  // Generează prima întrebare după ce s-a încărcat progresul
  useEffect(() => {
    if (!isLoading && currentQuestion === null && targetLetters.length > 0) {
      pickNextQuestion(allProgress)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  function getProgressForLetter(letter: LetterData, map: Map<string, ItemProgress>): ItemProgress {
    const id = `letter_${letter.letter}`
    return map.get(id) ?? getInitialProgress(id)
  }

  function pickNextQuestion(
    map: Map<string, ItemProgress>,
    forceTarget?: LetterData
  ) {
    if (targetLetters.length === 0) return

    let target: LetterData
    if (forceTarget) {
      target = forceTarget
    } else {
      // Prioritizează literele mai puțin stăpânite
      const sorted = [...targetLetters].sort((a, b) => {
        const pa = getProgressForLetter(a, map)
        const pb = getProgressForLetter(b, map)
        // Prioritate: mastered=false > mai puține attempts > nivel mai mic
        if (pa.mastered && !pb.mastered) return 1
        if (!pa.mastered && pb.mastered) return -1
        return pa.correct - pb.correct
      })
      target = sorted[0]
    }

    const progress = getProgressForLetter(target, map)
    const question = generateQuestion(target, progress)
    setCurrentQuestion(question)
    setLioMessage(getLioMessage('start'))
    setLioSituation('start')

    // Nivel 1: evidențiază răspunsul corect pentru 2 secunde
    if (question.showAnswerFirst) {
      setShowAnswerHighlight(target.letter)
      setTimeout(() => setShowAnswerHighlight(null), 2000)
    }
  }

  const answer = useCallback((chosenLetter: LetterData) => {
    if (!currentQuestion || feedback !== null) return

    const isCorrect = chosenLetter.letter === currentQuestion.targetLetter.letter
    const itemId = `letter_${currentQuestion.targetLetter.letter}`

    setAllProgress(prev => {
      const currentProg = prev.get(itemId) ?? getInitialProgress(itemId)
      const updated = updateProgress(currentProg, isCorrect)
      const next = new Map(prev)
      next.set(itemId, updated)

      // Salvează offline imediat
      saveProgressOffline(updated)
      // Pune în coada de sync
      queueForSync({
        userId,
        itemId,
        gameType: 'letters',
        wasCorrect: isCorrect,
        timestamp: Date.now(),
      })

      return next
    })

    setQuestionsAnswered(q => q + 1)

    if (isCorrect) {
      setConsecutiveWrong(0)
      const coins = calculateCoins(
        currentQuestion.level,
        true,
        false
      )
      setPendingCoins(coins)
      setTotalCoinsThisSession(t => t + coins)

      // Verifică dacă a trecut nivel sau a masterit
      const currentProg = allProgressRef.current.get(itemId) ?? getInitialProgress(itemId)
      const updated = updateProgress(currentProg, true)

      if (updated.mastered && !currentProg.mastered) {
        setFeedback('mastered')
        setLioSituation('mastered')
        setLioMessage(getLioMessage('mastered'))
      } else if (updated.level > currentProg.level) {
        setFeedback('level_up')
        setLioSituation('level_up')
        setLioMessage(getLioMessage('level_up'))
      } else {
        setFeedback('correct')
        setLioSituation('correct')
        setLioMessage(getLioMessage('correct'))
      }
    } else {
      const newWrong = consecutiveWrong + 1
      setConsecutiveWrong(newWrong)
      setFeedback('wrong')

      // Regula 3 greșeli
      if (newWrong >= 3) {
        setLioSituation('wrong_3')
        setLioMessage(getLioMessage('wrong_3'))
        // La greșeala 3: evidențiază răspunsul corect
        setShowAnswerHighlight(currentQuestion.targetLetter.letter)
        setTimeout(() => setShowAnswerHighlight(null), 2000)
      } else if (newWrong === 2) {
        setLioSituation('wrong_2')
        setLioMessage(getLioMessage('wrong_2'))
      } else {
        setLioSituation('wrong_1')
        setLioMessage(getLioMessage('wrong_1'))
      }
    }
  }, [currentQuestion, feedback, consecutiveWrong, userId])

  const nextQuestion = useCallback((targetLetter?: LetterData) => {
    setFeedback(null)
    setPendingCoins(0)
    setShowAnswerHighlight(null)
    setAllProgress(prev => {
      pickNextQuestion(prev, targetLetter)
      return prev
    })
  }, [targetLetters]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearFeedback = useCallback(() => {
    setFeedback(null)
    setPendingCoins(0)
  }, [])

  return {
    currentQuestion,
    allProgress,
    consecutiveWrong,
    lioMessage,
    lioSituation,
    feedback,
    pendingCoins,
    totalCoinsThisSession,
    questionsAnswered,
    isLoading,
    showAnswerHighlight,
    answer,
    nextQuestion,
    clearFeedback,
  }
}

// Calculează câte litere au fost masterite din un set
export function countMastered(
  letters: LetterData[],
  allProgress: Map<string, ItemProgress>
): number {
  return letters.filter(l => {
    const p = allProgress.get(`letter_${l.letter}`)
    return p?.mastered === true
  }).length
}

// Calculează nivelul mediu al unui set de litere
export function averageLevel(
  letters: LetterData[],
  allProgress: Map<string, ItemProgress>
): number {
  if (letters.length === 0) return 1
  const total = letters.reduce((sum, l) => {
    const p = allProgress.get(`letter_${l.letter}`)
    return sum + (p?.level ?? 1)
  }, 0)
  return Math.round(total / letters.length)
}

export { PHONETIC_LETTERS }
