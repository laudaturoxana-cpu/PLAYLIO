// Correct phonetic order based on child psychology
// First series: S, A, T, P, I, N — most frequent + visually distinct
// Second series: E, R, O, D
// Third series: C, M, L, B (B and D taught far apart — all 5-year-olds confuse them)

export interface LetterData {
  letter: string          // uppercase letter
  lowercase: string       // lowercase letter
  sound: string           // phonetic sound (e.g. "sss", "aaa")
  emoji: string           // representative emoji
  word: string            // English word
  color: string           // associated color (CSS var)
  series: 1 | 2 | 3       // phonetic series
  orderInSeries: number   // order within series
}

export const PHONETIC_LETTERS: LetterData[] = [
  // Series 1
  { letter: 'S', lowercase: 's', sound: 'sss', emoji: '🌞', word: 'Sun',      color: 'var(--sun)',      series: 1, orderInSeries: 1 },
  { letter: 'A', lowercase: 'a', sound: 'aaa', emoji: '🍎', word: 'Apple',    color: 'var(--sky)',      series: 1, orderInSeries: 2 },
  { letter: 'T', lowercase: 't', sound: 'ttt', emoji: '🐢', word: 'Turtle',   color: 'var(--mint-dark)',series: 1, orderInSeries: 3 },
  { letter: 'P', lowercase: 'p', sound: 'ppp', emoji: '🐧', word: 'Penguin',  color: 'var(--coral)',    series: 1, orderInSeries: 4 },
  { letter: 'I', lowercase: 'i', sound: 'iii', emoji: '🍦', word: 'Ice cream',color: 'var(--purple)',   series: 1, orderInSeries: 5 },
  { letter: 'N', lowercase: 'n', sound: 'nnn', emoji: '🌙', word: 'Night',    color: 'var(--sky-dark)', series: 1, orderInSeries: 6 },
  // Series 2
  { letter: 'E', lowercase: 'e', sound: 'eee', emoji: '🐘', word: 'Elephant', color: 'var(--mint)',     series: 2, orderInSeries: 1 },
  { letter: 'R', lowercase: 'r', sound: 'rrr', emoji: '🌈', word: 'Rainbow',  color: 'var(--coral-dark)',series: 2, orderInSeries: 2 },
  { letter: 'O', lowercase: 'o', sound: 'ooo', emoji: '🦉', word: 'Owl',      color: 'var(--sun-dark)', series: 2, orderInSeries: 3 },
  { letter: 'D', lowercase: 'd', sound: 'ddd', emoji: '🐬', word: 'Dolphin',  color: 'var(--teal)',     series: 2, orderInSeries: 4 },
  // Series 3 (B and D in different series — kids confuse them!)
  { letter: 'C', lowercase: 'c', sound: 'ccc', emoji: '🐱', word: 'Cat',      color: 'var(--sky)',      series: 3, orderInSeries: 1 },
  { letter: 'M', lowercase: 'm', sound: 'mmm', emoji: '🐒', word: 'Monkey',   color: 'var(--coral)',    series: 3, orderInSeries: 2 },
  { letter: 'L', lowercase: 'l', sound: 'lll', emoji: '🦁', word: 'Lion',     color: 'var(--sun)',      series: 3, orderInSeries: 3 },
  { letter: 'B', lowercase: 'b', sound: 'bbb', emoji: '🐝', word: 'Bee',      color: 'var(--purple)',   series: 3, orderInSeries: 4 },
]

export const LETTER_MAP = new Map<string, LetterData>(
  PHONETIC_LETTERS.map(l => [l.letter, l])
)

export function getLettersBySeries(series: 1 | 2 | 3): LetterData[] {
  return PHONETIC_LETTERS.filter(l => l.series === series)
}

export function getUnlockedLetters(masteredCount: number): LetterData[] {
  // Unlock 2 letters at a time, in phonetic order
  return PHONETIC_LETTERS.slice(0, Math.max(2, masteredCount + 2))
}

// For CHALLENGE level: confusable pairs
export const CONFUSABLE_PAIRS: [string, string][] = [
  ['B', 'D'],  // most common
  ['P', 'T'],
  ['S', 'A'],
  ['I', 'L'],
]

export function getConfusablePair(letter: string): string | null {
  for (const [a, b] of CONFUSABLE_PAIRS) {
    if (a === letter) return b
    if (b === letter) return a
  }
  return null
}

export type SeriesId = 1 | 2 | 3

export const SERIES_INFO: Record<SeriesId, { title: string; emoji: string; color: string }> = {
  1: { title: 'First Adventure', emoji: '🌟', color: 'var(--sky)' },
  2: { title: 'Magic Path',      emoji: '✨', color: 'var(--mint-dark)' },
  3: { title: 'Letter Hero',     emoji: '🏆', color: 'var(--coral)' },
}
