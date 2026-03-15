import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BuilderClient from './BuilderClient'

export default async function BuilderWorldPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, coins, age')
    .eq('id', user.id)
    .single()

  const { data: inventory } = await supabase
    .from('inventory')
    .select('item_id')
    .eq('user_id', user.id)

  const { data: builderState } = await supabase
    .from('builder_state')
    .select('unlocked_rooms')
    .eq('user_id', user.id)
    .single()

  const ownedItemIds = (inventory ?? []).map(i => i.item_id)

  return (
    <BuilderClient
      userId={user.id}
      profileName={profile?.full_name ?? 'Builder'}
      childAge={profile?.age ?? 6}
      initialCoins={profile?.coins ?? 0}
      ownedItemIds={ownedItemIds}
      unlockedRoomIds={builderState?.unlocked_rooms ?? ['bedroom']}
    />
  )
}
