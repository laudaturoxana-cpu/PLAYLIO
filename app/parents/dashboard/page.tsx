import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'

export default async function ParentsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profil + copii
  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!parentProfile) redirect('/login?error=no_profile')

  const { data: children } = await supabase
    .from('profiles')
    .select('*')
    .eq('parent_id', user.id)
    .eq('role', 'child')

  const showOnboarding = params.onboarding === 'true' || !children || children.length === 0

  return (
    <DashboardClient
      parentProfile={parentProfile}
      children={children ?? []}
      showOnboarding={showOnboarding}
    />
  )
}
