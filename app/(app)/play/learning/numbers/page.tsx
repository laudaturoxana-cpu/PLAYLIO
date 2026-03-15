import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NumberGame from './NumberGame'

export default async function NumbersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, age, coins')
    .eq('id', user.id)
    .single()

  return (
    <NumberGame
      userId={user.id}
      age={profile?.age ?? 6}
      profileName={profile?.full_name ?? 'Explorer'}
    />
  )
}
