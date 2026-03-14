import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdventureClient from './AdventureClient'
import { ZONES } from '@/lib/adventure/zones'

export default async function AdventureWorldPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, level, coins')
    .eq('id', user.id)
    .single()

  // Misiunile completate ale utilizatorului
  const { data: completions } = await supabase
    .from('quest_completions')
    .select('quest_id')
    .eq('user_id', user.id)

  const completedQuestIds = (completions ?? []).map(c => c.quest_id)

  // Progresul per zonă (din quests, calculăm din completions)
  // Stele per zonă le luăm din localStorage pe client — pentru offline-first
  // Pasăm doar quest completions și player level de pe server
  const allQuestIds = ZONES.flatMap(z => z.quests.map(q => q.id))

  return (
    <AdventureClient
      userId={user.id}
      profileName={profile?.full_name ?? 'Aventurierule'}
      playerLevel={profile?.level ?? 1}
      completedQuestIds={completedQuestIds}
    />
  )
}
