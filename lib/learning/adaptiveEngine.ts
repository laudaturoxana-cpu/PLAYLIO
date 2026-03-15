import { PHONETIC_LETTERS, getConfusablePair, type LetterData } from './phonetics'

// Adaptive engine — 5 levels (not 3)
// LEVEL 1 — SCAFFOLDED: shows answer 2s first, 2 options, Lio explains the rule
// LEVEL 2 — GUIDED: 3 options, hint on wrong (border blinks 0.5s), Lio: "Almost!"
// LEVEL 3 — INDEPENDENT: 4 options, no hint (standard)
// LEVEL 4 — CHALLENGE: 4 confusable options (B/D, 6/9), gentle timer, fast bonus coins
// LEVEL 5 — MASTERY CHECK: 5-question test every 2 weeks, visual diploma, parent report

export type AdaptiveLevel = 1 | 2 | 3 | 4 | 5

export interface ItemProgress {
  itemId: string       // e.g. "letter_S"
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
  showAnswerFirst: boolean   // level 1: show answer 2s first
  hintEnabled: boolean       // level 2: hint on wrong
  timerSeconds: number | null // level 4: gentle timer (30s)
  bonusCoins: number         // level 4: bonus for fast answer
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

  // Level promotion
  if (wasCorrect && next.consecutiveCorrect >= threshold.toPromote) {
    next.consecutiveCorrect = 0
    if (prev.level < 5) {
      next.level = (prev.level + 1) as AdaptiveLevel
    } else {
      next.mastered = true
    }
  }

  // Level demotion
  if (!wasCorrect && next.consecutiveWrong >= threshold.toDemote) {
    next.consecutiveWrong = 0
    if (prev.level > 1) {
      next.level = (prev.level - 1) as AdaptiveLevel
    }
  }

  return next
}

// Generate distractors (wrong options) based on level
function getDistractors(target: LetterData, level: AdaptiveLevel, count: number): LetterData[] {
  const pool = PHONETIC_LETTERS.filter(l => l.letter !== target.letter)

  if (level === 4) {
    // At CHALLENGE: prefer confusable pairs
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

  // At other levels: random from pool
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

// Lio messages per level and situation
export type LioSituation = 'start' | 'correct' | 'wrong_1' | 'wrong_2' | 'wrong_3' | 'level_up' | 'mastered'

export const LIO_MESSAGES: Record<LioSituation, string[]> = {
  start: [
    'Find the letter! 🎯',
    'Are you ready? Let\'s go! ⭐',
    'This letter is super cool! Let\'s find it! 🌟',
  ],
  correct: [
    'Amazing! You\'re fantastic! ⭐',
    'Correct! You got it first try! 🎉',
    'Wonderful! One more? 🌈',
    'Super! You\'re a true letter hero! 🏆',
    'Perfect! Stars for you! ✨',
  ],
  wrong_1: [
    'Hmm, try again! 🤔',
    'Not that one — look carefully! 👀',
    'Almost! One more time! 💪',
  ],
  wrong_2: [
    'Almost! Look at the picture! 🖼️',
    'Come on, you can do it! The letter is right there! 🎯',
    'Don\'t worry, look closely! ❤️',
  ],
  wrong_3: [
    'Here\'s the right letter! Let\'s look at it together! 📚',
    'Let\'s look at it carefully! 🔍',
    'This is the letter! Let\'s remember it! 💡',
  ],
  level_up: [
    'WOW! You moved to the next level! 🚀',
    'You\'re getting better and better! 🌟',
    'A new level! You\'re a champion! 🏆',
  ],
  mastered: [
    'YOU MASTERED THIS LETTER! 🎓',
    'Congratulations! This letter is yours! ⭐⭐⭐',
    'Total expert! You\'re incredible! 🦁',
  ],
}

export function getLioMessage(situation: LioSituation): string {
  const messages = LIO_MESSAGES[situation]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Calculate coins per answer
export function calculateCoins(
  level: AdaptiveLevel,
  isCorrect: boolean,
  timeBonus: boolean
): number {
  if (!isCorrect) return 0
  const base: Record<AdaptiveLevel, number> = { 1: 1, 2: 2, 3: 3, 4: 5, 5: 8 }
  return base[level] + (timeBonus ? 3 : 0)
}
