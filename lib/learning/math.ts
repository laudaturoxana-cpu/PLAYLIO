// Math World — question generation for ages 3-10

export type MathTopic = 'counting' | 'addition' | 'subtraction' | 'comparison' | 'shapes'

export interface MathQuestion {
  id: string
  topic: MathTopic
  question: string      // text of the question
  emoji: string         // visual aid
  choices: number[]     // answer choices
  correctAnswer: number
  level: number         // 1-5
  coinsReward: number
}

// Generate a unique id
function uid() {
  return Math.random().toString(36).slice(2, 9)
}

// Shuffle array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate wrong answers that are close but not equal
function generateWrongAnswers(correct: number, count: number, min = 0, max = 20): number[] {
  const wrongs = new Set<number>()
  let attempts = 0
  while (wrongs.size < count && attempts < 50) {
    attempts++
    const delta = Math.floor(Math.random() * 4) + 1
    const candidate = Math.random() > 0.5 ? correct + delta : correct - delta
    if (candidate !== correct && candidate >= min && candidate <= max) {
      wrongs.add(candidate)
    }
  }
  // fallback
  let fallback = 1
  while (wrongs.size < count) {
    if (fallback !== correct && fallback >= min && fallback <= max) wrongs.add(fallback)
    fallback++
  }
  return Array.from(wrongs).slice(0, count)
}

// COUNTING (age 3-5): how many emojis?
function makeCountingQuestion(age: number): MathQuestion {
  const maxNum = age <= 4 ? 5 : age <= 6 ? 10 : 15
  const correct = Math.floor(Math.random() * maxNum) + 1
  const emojis = ['🍎', '⭐', '🌸', '🐥', '🦋', '🍕', '🎈', '🪙', '🐸', '❤️']
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]
  const display = emoji.repeat(correct)
  const wrongs = generateWrongAnswers(correct, age <= 5 ? 1 : 2, 1, maxNum + 3)
  const choices = shuffle([correct, ...wrongs])

  return {
    id: uid(),
    topic: 'counting',
    question: `How many ${emoji} are there?`,
    emoji: display,
    choices,
    correctAnswer: correct,
    level: age <= 4 ? 1 : 2,
    coinsReward: 2,
  }
}

// ADDITION (age 5-8): a + b = ?
function makeAdditionQuestion(age: number): MathQuestion {
  const maxA = age <= 6 ? 5 : age <= 8 ? 10 : 15
  const maxB = age <= 6 ? 5 : age <= 8 ? 9 : 10
  const a = Math.floor(Math.random() * maxA) + 1
  const b = Math.floor(Math.random() * Math.min(maxB, maxA)) + 1
  const correct = a + b
  const wrongs = generateWrongAnswers(correct, 2, 0, maxA + maxB + 5)
  const choices = shuffle([correct, ...wrongs])
  const emojis = ['🍎', '⭐', '🌸', '🐥', '🦋']
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]

  return {
    id: uid(),
    topic: 'addition',
    question: `${a} + ${b} = ?`,
    emoji: `${emoji.repeat(a)}  +  ${emoji.repeat(b)}`,
    choices,
    correctAnswer: correct,
    level: age <= 6 ? 2 : 3,
    coinsReward: 3,
  }
}

// SUBTRACTION (age 6-9): a - b = ?
function makeSubtractionQuestion(age: number): MathQuestion {
  const maxNum = age <= 7 ? 10 : 20
  const a = Math.floor(Math.random() * maxNum) + 2
  const b = Math.floor(Math.random() * (a - 1)) + 1
  const correct = a - b
  const wrongs = generateWrongAnswers(correct, 2, 0, maxNum)
  const choices = shuffle([correct, ...wrongs])

  return {
    id: uid(),
    topic: 'subtraction',
    question: `${a} - ${b} = ?`,
    emoji: `${a} ➖ ${b}`,
    choices,
    correctAnswer: correct,
    level: 3,
    coinsReward: 4,
  }
}

// COMPARISON (age 4-6): which number is bigger?
function makeComparisonQuestion(): MathQuestion {
  const a = Math.floor(Math.random() * 18) + 1
  let b = Math.floor(Math.random() * 18) + 1
  while (b === a) b = Math.floor(Math.random() * 18) + 1
  const correct = Math.max(a, b)
  const choices = [a, b]

  return {
    id: uid(),
    topic: 'comparison',
    question: `Which number is BIGGER?`,
    emoji: `${a}  🆚  ${b}`,
    choices,
    correctAnswer: correct,
    level: 1,
    coinsReward: 2,
  }
}

export function generateMathQuestion(age: number): MathQuestion {
  // Select topic based on age
  if (age <= 4) {
    return makeCountingQuestion(age)
  } else if (age <= 5) {
    return Math.random() > 0.4 ? makeCountingQuestion(age) : makeComparisonQuestion()
  } else if (age <= 7) {
    const roll = Math.random()
    if (roll < 0.4) return makeCountingQuestion(age)
    if (roll < 0.7) return makeAdditionQuestion(age)
    return makeComparisonQuestion()
  } else {
    const roll = Math.random()
    if (roll < 0.4) return makeAdditionQuestion(age)
    if (roll < 0.7) return makeSubtractionQuestion(age)
    return makeCountingQuestion(age)
  }
}

export const MATH_TOPIC_COLORS: Record<MathTopic, string> = {
  counting:    '#FF7043',
  addition:    '#4CAF50',
  subtraction: '#F44336',
  comparison:  '#9C27B0',
  shapes:      '#2196F3',
}

export const MATH_TOPIC_EMOJIS: Record<MathTopic, string> = {
  counting:    '🔢',
  addition:    '➕',
  subtraction: '➖',
  comparison:  '🆚',
  shapes:      '🔷',
}
