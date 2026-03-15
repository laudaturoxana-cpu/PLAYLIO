import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LearningMap from './LearningMap'

export default async function LearningWorldPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, coins, level')
    .eq('id', user.id)
    .single()

  // Learning progress from Supabase (for initial state)
  const { data: learningRows } = await supabase
    .from('learning_progress')
    .select('item_id, attempts, correct, mastered')
    .eq('user_id', user.id)

  // Transform into map: itemId → mastered
  const masteredSet = new Set<string>(
    (learningRows ?? [])
      .filter(r => r.mastered)
      .map(r => r.item_id)
  )

  return (
    <LearningMap
      userId={user.id}
      profileName={profile?.full_name ?? 'Explorer'}
      masteredSet={Array.from(masteredSet)}
    />
  )
}
