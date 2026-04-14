import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'
import { PHONETIC_LETTERS } from '@/lib/learning/phonetics'

export default async function ParentsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('id, full_name, role, coins, level, xp')
    .eq('id', user.id)
    .single()

  // Profile missing — create it on the fly (Google OAuth trigger may have failed)
  if (!parentProfile) {
    const username =
      user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ??
      `user_${user.id.slice(0, 8)}`
    await supabase.from('profiles').upsert({
      id: user.id,
      username,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      role: 'parent',
      coins: 0,
      level: 1,
      xp: 0,
    }, { onConflict: 'id' })
    // After creating profile, redirect to dashboard with onboarding
    redirect('/parents/dashboard?onboarding=true')
  }
  // Treat null role as parent (profiles created by Supabase trigger may have role=null)
  if (parentProfile.role && parentProfile.role !== 'parent') redirect('/worlds')
  // Auto-fix null role
  if (!parentProfile.role) {
    await supabase.from('profiles').update({ role: 'parent' }).eq('id', user.id)
  }

  const { data: children } = await supabase
    .from('profiles')
    .select('id, full_name, level, coins, xp, age')
    .eq('parent_id', user.id)
    .eq('role', 'child')

  const showOnboarding = params.onboarding === 'true' || !children || children.length === 0

  // Pentru fiecare copil: litere masterite + timp estimat săptămâna asta
  const childStats: Record<string, { masteredLetters: number; minutesThisWeek: number }> = {}

  const totalLetters = PHONETIC_LETTERS.length
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  for (const child of children ?? []) {
    const { data: learning } = await supabase
      .from('learning_progress')
      .select('item_id, mastered, attempts, last_seen')
      .eq('user_id', child.id)

    const masteredLetters = (learning ?? []).filter(r => r.mastered && r.item_id.startsWith('letter_')).length

    // Timp estimat: activitate din această săptămână
    const thisWeekActivity = (learning ?? []).filter(r => {
      const seen = new Date(r.last_seen)
      return seen >= weekStart
    }).reduce((s, r) => s + r.attempts, 0)

    const { data: questsThisWeek } = await supabase
      .from('quest_completions')
      .select('id')
      .eq('user_id', child.id)
      .gte('completed_at', weekStart.toISOString())

    const minutesThisWeek = Math.round((thisWeekActivity * 12) / 60) + (questsThisWeek?.length ?? 0) * 5

    childStats[child.id] = { masteredLetters, minutesThisWeek }
  }

  return (
    <DashboardClient
      parentProfile={parentProfile}
      children={children ?? []}
      childStats={childStats}
      totalLetters={totalLetters}
      showOnboarding={showOnboarding}
    />
  )
}
