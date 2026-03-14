// Ordinea fonetică corectă din psihologia copilului
// Prima serie: S, A, T, P, I, N — cele mai frecvente + ușor de distins vizual
// A doua serie: E, R, O, D
// A treia serie: C, M, L, B (B și D se predau la distanță mare — le confundă toți copiii de 5 ani)

export interface LetterData {
  letter: string          // litera mare
  lowercase: string       // litera mică
  sound: string           // sunetul fonetic (ex: "sss", "aaa")
  emoji: string           // emoji reprezentativ
  word: string            // cuvânt în română
  wordEn: string          // cuvânt în engleză (fallback)
  color: string           // culoarea asociată (CSS var)
  series: 1 | 2 | 3       // seria fonetică
  orderInSeries: number   // ordinea în serie
}

export const PHONETIC_LETTERS: LetterData[] = [
  // Seria 1
  { letter: 'S', lowercase: 's', sound: 'sss', emoji: '🌞', word: 'Soare', wordEn: 'Sun', color: 'var(--sun)', series: 1, orderInSeries: 1 },
  { letter: 'A', lowercase: 'a', sound: 'aaa', emoji: '🦆', word: 'Apă', wordEn: 'Aqua', color: 'var(--sky)', series: 1, orderInSeries: 2 },
  { letter: 'T', lowercase: 't', sound: 'ttt', emoji: '🐢', word: 'Țestoasă', wordEn: 'Turtle', color: 'var(--mint-dark)', series: 1, orderInSeries: 3 },
  { letter: 'P', lowercase: 'p', sound: 'ppp', emoji: '🦋', word: 'Papagal', wordEn: 'Parrot', color: 'var(--coral)', series: 1, orderInSeries: 4 },
  { letter: 'I', lowercase: 'i', sound: 'iii', emoji: '🦔', word: 'Iepure', wordEn: 'Igloo', color: 'var(--purple)', series: 1, orderInSeries: 5 },
  { letter: 'N', lowercase: 'n', sound: 'nnn', emoji: '🌙', word: 'Noapte', wordEn: 'Night', color: 'var(--sky-dark)', series: 1, orderInSeries: 6 },
  // Seria 2
  { letter: 'E', lowercase: 'e', sound: 'eee', emoji: '🦔', word: 'Elefant', wordEn: 'Elephant', color: 'var(--mint)', series: 2, orderInSeries: 1 },
  { letter: 'R', lowercase: 'r', sound: 'rrr', emoji: '🌹', word: 'Roșie', wordEn: 'Rose', color: 'var(--coral-dark)', series: 2, orderInSeries: 2 },
  { letter: 'O', lowercase: 'o', sound: 'ooo', emoji: '🐑', word: 'Oaie', wordEn: 'Owl', color: 'var(--sun-dark)', series: 2, orderInSeries: 3 },
  { letter: 'D', lowercase: 'd', sound: 'ddd', emoji: '🐬', word: 'Delfin', wordEn: 'Dolphin', color: 'var(--teal)', series: 2, orderInSeries: 4 },
  // Seria 3 (B și D sunt în serii diferite — le confundă copiii!)
  { letter: 'C', lowercase: 'c', sound: 'ccc', emoji: '🐱', word: 'Câine', wordEn: 'Cat', color: 'var(--sky)', series: 3, orderInSeries: 1 },
  { letter: 'M', lowercase: 'm', sound: 'mmm', emoji: '🍎', word: 'Măr', wordEn: 'Moon', color: 'var(--coral)', series: 3, orderInSeries: 2 },
  { letter: 'L', lowercase: 'l', sound: 'lll', emoji: '🦁', word: 'Leu', wordEn: 'Lion', color: 'var(--sun)', series: 3, orderInSeries: 3 },
  { letter: 'B', lowercase: 'b', sound: 'bbb', emoji: '🦋', word: 'Broscuță', wordEn: 'Butterfly', color: 'var(--purple)', series: 3, orderInSeries: 4 },
]

export const LETTER_MAP = new Map<string, LetterData>(
  PHONETIC_LETTERS.map(l => [l.letter, l])
)

export function getLettersBySeries(series: 1 | 2 | 3): LetterData[] {
  return PHONETIC_LETTERS.filter(l => l.series === series)
}

export function getUnlockedLetters(masteredCount: number): LetterData[] {
  // Deblocăm câte 2 litere odată, în ordinea fonetică
  return PHONETIC_LETTERS.slice(0, Math.max(2, masteredCount + 2))
}

// Pentru CHALLENGE level: perechi confuzabile
export const CONFUSABLE_PAIRS: [string, string][] = [
  ['B', 'D'],  // cel mai comun
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
  1: { title: 'Prima aventură', emoji: '🌟', color: 'var(--sky)' },
  2: { title: 'Drumul magic', emoji: '✨', color: 'var(--mint-dark)' },
  3: { title: 'Eroul literelor', emoji: '🏆', color: 'var(--coral)' },
}
