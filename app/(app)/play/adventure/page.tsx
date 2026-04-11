import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdventureClient from './AdventureClient'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

export default async function AdventureWorldPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await getActiveChildProfile(user.id)

  const { data: completions } = await supabase
    .from('quest_completions')
    .select('quest_id')
    .eq('user_id', user.id)

  const completedQuestIds = (completions ?? []).map(c => c.quest_id)

  return (
    <AdventureClient
      userId={user.id}
      profileName={profile?.full_name ?? 'Aventurierule'}
      playerLevel={profile?.level ?? 1}
      playerAge={profile?.age ?? 6}
      completedQuestIds={completedQuestIds}
    />
  )
}
