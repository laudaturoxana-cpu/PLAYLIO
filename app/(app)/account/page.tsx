import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountClient from '@/app/parents/account/AccountClient'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <AccountClient
      parentName={user.user_metadata?.full_name ?? null}
      email={user.email ?? ''}
    />
  )
}
