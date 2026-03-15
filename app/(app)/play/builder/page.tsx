import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BuilderClient from './BuilderClient'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

export default async function BuilderWorldPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await getActiveChildProfile(user.id)

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
      profileName={profile.full_name ?? 'Builder'}
      childAge={profile.age ?? 6}
      initialCoins={profile.coins}
      ownedItemIds={ownedItemIds}
      unlockedRoomIds={builderState?.unlocked_rooms ?? ['bedroom']}
    />
  )
}
