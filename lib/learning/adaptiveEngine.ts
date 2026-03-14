import { PHONETIC_LETTERS, getConfusablePair, type LetterData } from './phonetics'

// Motor adaptiv — 5 niveluri (nu 3)
// NIVEL 1 — SCAFFOLDED: arată răspunsul 2s înainte, 2 opțiuni, Lio explică regula
// NIVEL 2 — GUIDED: 3 opțiuni, hint la greșeală (contur clipește 0.5s), Lio: "Aproape!"
// NIVEL 3 — INDEPENDENT: 4 opțiuni, fără hint (standard)
// NIVEL 4 — CHALLENGE: 4 opțiuni confuzibile (B/D, 6/9), timer blând, bonus coins rapid
// NIVEL 5 — MASTERY CHECK: test 5 întrebări la 2 săptămâni, diplomă vizuală, raport părinți

export type AdaptiveLevel = 1 | 2 | 3 | 4 | 5

export interface ItemProgress {
  itemId: string       // ex: "letter_S"
  attempts: number
  correct: number
  consecutiveCorrect: number
  consecutiveWrong: number
  level: AdaptiveLevel
  mastered: boolean
  lastSeen: number     // timestamp
}

export interface Question {
  targetLetter: LetterData
  choices: LetterData[]
  level: AdaptiveLevel
  showAnswerFirst: boolean   // nivel 1: arată răspunsul 2s înainte
  hintEnabled: boolean       // nivel 2: hint la greșeală
  timerSeconds: number | null // nivel 4: timer blând (30s)
  bonusCoins: number         // nivel 4: bonus pentru răspuns rapid
}

export interface LevelThresholds {
  toPromote: number    // consecutive correct answers to go up
  toDemote: number     // consecutive wrong answers to go down
}

const THRESHOLDS: Record<AdaptiveLevel, LevelThresholds> = {
  1: { toPromote: 3, toDemote: 0 },
  2: { toPromote: 3, toDemote: 3 },
  3: { toPromote: 4, toDemote: 3 },
  4: { toPromote: 5, toDemote: 3 },
  5: { toPromote: 5, toDemote: 3 },
}

export function getInitialProgress(itemId: string): ItemProgress {
  return {
    itemId,
    attempts: 0,
    correct: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    level: 1,
    mastered: false,
    lastSeen: 0,
  }
}

export function updateProgress(
  prev: ItemProgress,
  wasCorrect: boolean
): ItemProgress {
  const next: ItemProgress = {
    ...prev,
    attempts: prev.attempts + 1,
    correct: wasCorrect ? prev.correct + 1 : prev.correct,
    consecutiveCorrect: wasCorrect ? prev.consecutiveCorrect + 1 : 0,
    consecutiveWrong: wasCorrect ? 0 : prev.consecutiveWrong + 1,
    lastSeen: Date.now(),
  }

  const threshold = THRESHOLDS[prev.level]

  // Promovare nivel
  if (wasCorrect && next.consecutiveCorrect >= threshold.toPromote) {
    next.consecutiveCorrect = 0
    if (prev.level < 5) {
      next.level = (prev.level + 1) as AdaptiveLevel
    } else {
      next.mastered = true
    }
  }

  // Retrogradare nivel
  if (!wasCorrect && next.consecutiveWrong >= threshold.toDemote) {
    next.consecutiveWrong = 0
    if (prev.level > 1) {
      next.level = (prev.level - 1) as AdaptiveLevel
    }
  }

  return next
}

// Generează distractori (opțiuni greșite) în funcție de nivel
function getDistractors(target: LetterData, level: AdaptiveLevel, count: number): LetterData[] {
  const pool = PHONETIC_LETTERS.filter(l => l.letter !== target.letter)

  if (level === 4) {
    // La CHALLENGE: preferă perechi confuzabile
    const confusable = getConfusablePair(target.letter)
    const confusableLetter = confusable ? PHONETIC_LETTERS.find(l => l.letter === confusable) : null
    const rest = pool.filter(l => l.letter !== confusable)
    const shuffled = shuffleArray(rest)
    const picked: LetterData[] = []
    if (confusableLetter) picked.push(confusableLetter)
    for (const l of shuffled) {
      if (picked.length >= count) break
      picked.push(l)
    }
    return picked.slice(0, count)
  }

  // La alte niveluri: aleatoriu din pool
  return shuffleArray(pool).slice(0, count)
}

export function generateQuestion(
  target: LetterData,
  progress: ItemProgress
): Question {
  const level = progress.level
  let numChoices: number
  let showAnswerFirst = false
  let hintEnabled = false
  let timerSeconds: number | null = null
  let bonusCoins = 0

  switch (level) {
    case 1:
      numChoices = 2
      showAnswerFirst = true
      break
    case 2:
      numChoices = 3
      hintEnabled = true
      break
    case 3:
      numChoices = 4
      break
    case 4:
      numChoices = 4
      timerSeconds = 30
      bonusCoins = 5
      break
    case 5:
      numChoices = 4
      timerSeconds = 20
      bonusCoins = 10
      break
  }

  const distractors = getDistractors(target, level, numChoices - 1)
  const choices = shuffleArray([target, ...distractors])

  return {
    targetLetter: target,
    choices,
    level,
    showAnswerFirst,
    hintEnabled,
    timerSeconds,
    bonusCoins,
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Mesajele lui Lio per nivel și situație
export type LioSituation = 'start' | 'correct' | 'wrong_1' | 'wrong_2' | 'wrong_3' | 'level_up' | 'mastered'

export const LIO_MESSAGES: Record<LioSituation, string[]> = {
  start: [
    'Să găsim litera! 🎯',
    'Ești pregătit? Hai să începem! ⭐',
    'Această literă e super! Hai s-o găsim! 🌟',
  ],
  correct: [
    'Bravo! Ești fantastic! ⭐',
    'Corect! Ai ghicit din prima! 🎉',
    'Minunat! Mai una? 🌈',
    'Super! Ești un adevărat erou al literelor! 🏆',
    'Perfect! Stele pentru tine! ✨',
  ],
  wrong_1: [
    'Hmm, mai încearcă! 🤔',
    'Nu-i asta, uită-te cu atenție! 👀',
    'Aproape! Mai o dată! 💪',
  ],
  wrong_2: [
    'Aproape! Uită-te la imagine! 🖼️',
    'Hai, poți! Litera e chiar acolo! 🎯',
    'Nu-ți fă griji, uită-te bine! ❤️',
  ],
  wrong_3: [
    'Uite, litera corectă! Să o recunoaștem împreună! 📚',
    'Hai să o privim cu atenție! 🔍',
    'Aceasta e litera! Să o reținem! 💡',
  ],
  level_up: [
    'WOW! Ai trecut la nivelul următor! 🚀',
    'Ești din ce în ce mai bun! 🌟',
    'Un nou nivel! Ești un campion! 🏆',
  ],
  mastered: [
    'AI STĂPÂNIT ACEASTĂ LITERĂ! 🎓',
    'Felicitări! Litera e a ta! ⭐⭐⭐',
    'Expert total! Ești incredibil! 🦁',
  ],
}

export function getLioMessage(situation: LioSituation): string {
  const messages = LIO_MESSAGES[situation]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Calculează coins per răspuns
export function calculateCoins(
  level: AdaptiveLevel,
  isCorrect: boolean,
  timeBonus: boolean
): number {
  if (!isCorrect) return 0
  const base: Record<AdaptiveLevel, number> = { 1: 1, 2: 2, 3: 3, 4: 5, 5: 8 }
  return base[level] + (timeBonus ? 3 : 0)
}
