import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { PHONETIC_LETTERS } from '@/lib/learning/phonetics'

export interface WeeklyReport {
  childId: string
  childName: string
  childAge: number | null
  weekStart: string    // ISO date
  weekEnd: string      // ISO date

  // Time played
  minutesThisWeek: number
  minutesLastWeek: number
  minutesDelta: number  // + = more, - = less

  // Letters
  newlyMasteredLetters: string[]        // e.g. ['S', 'A', 'T']
  totalMasteredLetters: string[]
  difficultLetters: string[]            // frequent errors
  difficultLetterNotes: Record<string, string>  // letter → pedagogical note

  // Activity
  adventureStarsThisWeek: number
  questsCompletedThisWeek: number
  jumpGamesThisWeek: number

  // Adaptive level
  averageAdaptiveLevel: number  // 1-5

  // Recommendations
  recommendations: string[]

  // Performance (simulated — in production real benchmark)
  percentileRank: number  // e.g. 78 → top 22%
}

// Pedagogical notes per difficult letter
const LETTER_NOTES: Record<string, string> = {
  'B': 'confuses it with D — normal at age 5. Practice: "B has belly in front, D has belly in back"',
  'D': 'confuses it with B — normal at age 5. Practice by tracing with finger on table',
  'P': 'confuses it with T — similar sound. Practice words: Parrot vs. Tiger',
  'N': 'nasal sound — hard to distinguish. Sing: "nnn"',
  'I': 'short sound — watch the duration. Examples: igloo, ice cream',
  'default': 'continue daily recognition exercises',
}

function getLetterNote(letter: string): string {
  return LETTER_NOTES[letter] ?? LETTER_NOTES['default']
}

function getWeekBounds(weeksAgo: number = 0): { start: Date; end: Date } {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const startOfThisWeek = new Date(now)
  startOfThisWeek.setDate(now.getDate() - dayOfWeek)
  startOfThisWeek.setHours(0, 0, 0, 0)

  const start = new Date(startOfThisWeek)
  start.setDate(start.getDate() - weeksAgo * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)

  return { start, end }
}

function estimateMinutesFromActivity(
  learningAnswers: number,
  quests: number,
  jumpGames: number
): number {
  // Estimate: 1 learning answer = ~12s, 1 quest = ~5min, 1 jump game = ~2min
  const learningMin = Math.round((learningAnswers * 12) / 60)
  const questMin = quests * 5
  const jumpMin = jumpGames * 2
  return learningMin + questMin + jumpMin
}

export async function generateWeeklyReport(
  supabase: SupabaseClient<Database>,
  childId: string,
  childName: string,
  childAge: number | null
): Promise<WeeklyReport> {
  const thisWeek = getWeekBounds(0)
  const lastWeek = getWeekBounds(1)

  const thisWeekStart = thisWeek.start.toISOString()
  const thisWeekEnd = thisWeek.end.toISOString()
  const lastWeekStart = lastWeek.start.toISOString()
  const lastWeekEnd = lastWeek.end.toISOString()

  // Learning progress — all data
  const { data: allLearning } = await supabase
    .from('learning_progress')
    .select('item_id, attempts, correct, mastered, last_seen')
    .eq('user_id', childId)

  // Total mastered letters
  const totalMasteredLetters = (allLearning ?? [])
    .filter(r => r.mastered && r.item_id.startsWith('letter_'))
    .map(r => r.item_id.replace('letter_', ''))

  // Letters mastered this week (last_seen this week + mastered)
  const newlyMasteredLetters = (allLearning ?? [])
    .filter(r => {
      if (!r.mastered || !r.item_id.startsWith('letter_')) return false
      const seen = new Date(r.last_seen)
      return seen >= thisWeek.start && seen <= thisWeek.end
    })
    .map(r => r.item_id.replace('letter_', ''))

  // Difficult letters (correct rate < 50% + minimum 5 attempts)
  const difficultLetters = (allLearning ?? [])
    .filter(r => {
      if (!r.item_id.startsWith('letter_')) return false
      if (r.mastered) return false
      if (r.attempts < 5) return false
      return (r.correct / r.attempts) < 0.5
    })
    .map(r => r.item_id.replace('letter_', ''))
    .slice(0, 3) // maximum 3

  const difficultLetterNotes: Record<string, string> = {}
  for (const l of difficultLetters) {
    difficultLetterNotes[l] = getLetterNote(l)
  }

  // Average adaptive level
  const levelSum = (allLearning ?? []).reduce((s, r) => {
    // We don't have the level directly in Supabase, estimate from correct rate
    const rate = r.attempts > 0 ? r.correct / r.attempts : 0
    if (rate > 0.9) return s + 4
    if (rate > 0.75) return s + 3
    if (rate > 0.5) return s + 2
    return s + 1
  }, 0)
  const averageAdaptiveLevel = allLearning?.length
    ? Math.round(levelSum / allLearning.length)
    : 1

  // Quest completions this week
  const { data: questsThisWeek } = await supabase
    .from('quest_completions')
    .select('id')
    .eq('user_id', childId)
    .gte('completed_at', thisWeekStart)
    .lt('completed_at', thisWeekEnd)

  const questsCompletedThisWeek = questsThisWeek?.length ?? 0

  // Jump scores this week
  const { data: jumpThisWeek } = await supabase
    .from('jump_scores')
    .select('score, stars')
    .eq('user_id', childId)
    .gte('created_at', thisWeekStart)
    .lt('created_at', thisWeekEnd)

  const jumpGamesThisWeek = jumpThisWeek?.length ?? 0

  // Quest completions last week
  const { data: questsLastWeek } = await supabase
    .from('quest_completions')
    .select('id')
    .eq('user_id', childId)
    .gte('completed_at', lastWeekStart)
    .lt('completed_at', lastWeekEnd)

  const questsLastWeekCount = questsLastWeek?.length ?? 0

  // Jump scores last week
  const { data: jumpLastWeek } = await supabase
    .from('jump_scores')
    .select('score')
    .eq('user_id', childId)
    .gte('created_at', lastWeekStart)
    .lt('created_at', lastWeekEnd)

  // Learning answers this week (estimate from last_seen)
  const learningAnswersThisWeek = (allLearning ?? []).filter(r => {
    const seen = new Date(r.last_seen)
    return seen >= thisWeek.start && seen <= thisWeek.end
  }).reduce((s, r) => s + r.attempts, 0)

  const learningAnswersLastWeek = (allLearning ?? []).filter(r => {
    const seen = new Date(r.last_seen)
    return seen >= lastWeek.start && seen <= lastWeek.end
  }).reduce((s, r) => s + r.attempts, 0)

  const minutesThisWeek = estimateMinutesFromActivity(
    learningAnswersThisWeek, questsCompletedThisWeek, jumpGamesThisWeek
  )
  const minutesLastWeek = estimateMinutesFromActivity(
    learningAnswersLastWeek, questsLastWeekCount, jumpLastWeek?.length ?? 0
  )
  const minutesDelta = minutesThisWeek - minutesLastWeek

  // Adventure stars this week
  const adventureStarsThisWeek = questsCompletedThisWeek * 2  // approximation

  // Recommendations
  const recommendations: string[] = []

  if (difficultLetters.length > 0) {
    recommendations.push(
      `Practice letter ${difficultLetters[0]} at home: ${getLetterNote(difficultLetters[0])}`
    )
  }
  if (minutesThisWeek < 10) {
    recommendations.push('We recommend 10-15 minutes of Playlio per day for optimal progress')
  }
  if (newlyMasteredLetters.length > 0) {
    recommendations.push(
      `Congratulate them for the newly mastered letters: ${newlyMasteredLetters.join(', ')} 🎉`
    )
  }
  if (averageAdaptiveLevel >= 3) {
    recommendations.push('Great progress — your child is ready for more challenging letters')
  }
  if (recommendations.length === 0) {
    recommendations.push('Keep the daily routine going — consistency makes the difference!')
  }

  // Percentile (simulated — in production real benchmark)
  const basePercentile = 50
  const masteredBonus = totalMasteredLetters.length * 3
  const activityBonus = Math.min(minutesThisWeek * 2, 30)
  const percentileRank = Math.min(99, basePercentile + masteredBonus + activityBonus)

  return {
    childId,
    childName,
    childAge,
    weekStart: thisWeekStart,
    weekEnd: thisWeekEnd,
    minutesThisWeek,
    minutesLastWeek,
    minutesDelta,
    newlyMasteredLetters,
    totalMasteredLetters,
    difficultLetters,
    difficultLetterNotes,
    adventureStarsThisWeek,
    questsCompletedThisWeek,
    jumpGamesThisWeek,
    averageAdaptiveLevel,
    recommendations,
    percentileRank,
  }
}
