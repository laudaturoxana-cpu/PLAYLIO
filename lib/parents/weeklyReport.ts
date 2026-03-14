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
  newlyMasteredLetters: string[]        // ex: ['S', 'A', 'T']
  totalMasteredLetters: string[]
  difficultLetters: string[]            // erori frecvente
  difficultLetterNotes: Record<string, string>  // lettera → notă pedagogică

  // Activity
  adventureStarsThisWeek: number
  questsCompletedThisWeek: number
  jumpGamesThisWeek: number

  // Adaptive level
  averageAdaptiveLevel: number  // 1-5

  // Recommendations
  recommendations: string[]

  // Performance (simulated — în producție real benchmark)
  percentileRank: number  // ex: 78 → top 22%
}

// Note pedagogice per literă dificilă
const LETTER_NOTES: Record<string, string> = {
  'B': 'o confundă cu D — fenomen normal la 5 ani. Exersați: "B are burtă în față, D are burtă în spate"',
  'D': 'o confundă cu B — fenomen normal la 5 ani. Exersați cu degetul pe masă',
  'P': 'o confundă cu T — sunet similar. Exersați cuvinte: Papagal vs. Tigru',
  'N': 'sunet nazal — dificil de distins. Cântați: "nnn"',
  'I': 'sunet scurt — atenție la durată. Exemple: iepure, inimă',
  'default': 'continuați exercițiile zilnice de recunoaștere',
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
  // Estimare: 1 răspuns learning = ~12s, 1 quest = ~5min, 1 jump game = ~2min
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

  // Learning progress — toate datele
  const { data: allLearning } = await supabase
    .from('learning_progress')
    .select('item_id, attempts, correct, mastered, last_seen')
    .eq('user_id', childId)

  // Litere masterite total
  const totalMasteredLetters = (allLearning ?? [])
    .filter(r => r.mastered && r.item_id.startsWith('letter_'))
    .map(r => r.item_id.replace('letter_', ''))

  // Litere masterite săptămâna asta (last_seen în această săptămână + mastered)
  const newlyMasteredLetters = (allLearning ?? [])
    .filter(r => {
      if (!r.mastered || !r.item_id.startsWith('letter_')) return false
      const seen = new Date(r.last_seen)
      return seen >= thisWeek.start && seen <= thisWeek.end
    })
    .map(r => r.item_id.replace('letter_', ''))

  // Litere cu dificultăți (rate de corectitudine < 50% + minim 5 tentative)
  const difficultLetters = (allLearning ?? [])
    .filter(r => {
      if (!r.item_id.startsWith('letter_')) return false
      if (r.mastered) return false
      if (r.attempts < 5) return false
      return (r.correct / r.attempts) < 0.5
    })
    .map(r => r.item_id.replace('letter_', ''))
    .slice(0, 3) // maxim 3

  const difficultLetterNotes: Record<string, string> = {}
  for (const l of difficultLetters) {
    difficultLetterNotes[l] = getLetterNote(l)
  }

  // Nivel adaptiv mediu
  const levelSum = (allLearning ?? []).reduce((s, r) => {
    // Nu avem nivelul direct în Supabase, estimăm din rata de corect
    const rate = r.attempts > 0 ? r.correct / r.attempts : 0
    if (rate > 0.9) return s + 4
    if (rate > 0.75) return s + 3
    if (rate > 0.5) return s + 2
    return s + 1
  }, 0)
  const averageAdaptiveLevel = allLearning?.length
    ? Math.round(levelSum / allLearning.length)
    : 1

  // Quest completions săptămâna asta
  const { data: questsThisWeek } = await supabase
    .from('quest_completions')
    .select('id')
    .eq('user_id', childId)
    .gte('completed_at', thisWeekStart)
    .lt('completed_at', thisWeekEnd)

  const questsCompletedThisWeek = questsThisWeek?.length ?? 0

  // Jump scores săptămâna asta
  const { data: jumpThisWeek } = await supabase
    .from('jump_scores')
    .select('score, stars')
    .eq('user_id', childId)
    .gte('created_at', thisWeekStart)
    .lt('created_at', thisWeekEnd)

  const jumpGamesThisWeek = jumpThisWeek?.length ?? 0

  // Quest completions săptămâna trecută
  const { data: questsLastWeek } = await supabase
    .from('quest_completions')
    .select('id')
    .eq('user_id', childId)
    .gte('completed_at', lastWeekStart)
    .lt('completed_at', lastWeekEnd)

  const questsLastWeekCount = questsLastWeek?.length ?? 0

  // Jump scores săptămâna trecută
  const { data: jumpLastWeek } = await supabase
    .from('jump_scores')
    .select('score')
    .eq('user_id', childId)
    .gte('created_at', lastWeekStart)
    .lt('created_at', lastWeekEnd)

  // Learning answers this week (estimare din last_seen)
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

  // Stars adventure this week
  const adventureStarsThisWeek = questsCompletedThisWeek * 2  // aproximare

  // Recommendations
  const recommendations: string[] = []

  if (difficultLetters.length > 0) {
    recommendations.push(
      `Exersați acasă litera ${difficultLetters[0]}: ${getLetterNote(difficultLetters[0])}`
    )
  }
  if (minutesThisWeek < 10) {
    recommendations.push('Recomandăm 10-15 minute de Playlio pe zi pentru progres optim')
  }
  if (newlyMasteredLetters.length > 0) {
    recommendations.push(
      `Felicitați-l pentru literele noi stăpânite: ${newlyMasteredLetters.join(', ')} 🎉`
    )
  }
  if (averageAdaptiveLevel >= 3) {
    recommendations.push('Copilul progresează bine — poate trece la litere mai dificile')
  }
  if (recommendations.length === 0) {
    recommendations.push('Continuați rutina zilnică — constanța face diferența!')
  }

  // Percentile (simulat — în producție real benchmark)
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
