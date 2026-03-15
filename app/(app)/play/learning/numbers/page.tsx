import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NumberGame from './NumberGame'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

export default async function NumbersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getActiveChildProfile(user.id)

  return (
    <NumberGame
      userId={user.id}
      age={profile.age ?? 6}
      profileName={profile.full_name ?? 'Explorer'}
    />
  )
}
