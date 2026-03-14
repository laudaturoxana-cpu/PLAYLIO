import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getZoneBySlug } from '@/lib/adventure/zones'
import ZoneGame from './ZoneGame'

interface PageProps {
  params: Promise<{ zone: string }>
}

export default async function ZonePage({ params }: PageProps) {
  const { zone: zoneSlug } = await params
  const zone = getZoneBySlug(zoneSlug)
  if (!zone) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('level, coins')
    .eq('id', user.id)
    .single()

  const playerLevel = profile?.level ?? 1

  // Misiunile completate pentru această zonă
  const questIds = zone.quests.map(q => q.id)
  const { data: completions } = await supabase
    .from('quest_completions')
    .select('quest_id')
    .eq('user_id', user.id)
    .in('quest_id', questIds)

  const completedQuestIds = (completions ?? []).map(c => c.quest_id)

  return (
    <ZoneGame
      zone={zone}
      userId={user.id}
      playerLevel={playerLevel}
      completedQuestIds={completedQuestIds}
    />
  )
}
