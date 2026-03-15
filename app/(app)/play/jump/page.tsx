import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JumpClient from './JumpClient'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

export default async function JumpWorldPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await getActiveChildProfile(user.id)

  // Best scores per nivel
  const { data: scores } = await supabase
    .from('jump_scores')
    .select('level_id, score, stars')
    .eq('user_id', user.id)

  const bestScores: Record<string, { score: number; stars: number }> = {}
  for (const row of scores ?? []) {
    if (!bestScores[row.level_id] || row.stars > bestScores[row.level_id].stars) {
      bestScores[row.level_id] = { score: row.score, stars: row.stars }
    }
  }

  return (
    <JumpClient
      userId={user.id}
      profileName={profile.full_name ?? 'Jucătorule'}
      initialCoins={profile.coins}
      bestScores={bestScores}
    />
  )
}
