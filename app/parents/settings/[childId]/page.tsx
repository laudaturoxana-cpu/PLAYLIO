import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import SettingsClient from './SettingsClient'

interface PageProps {
  params: Promise<{ childId: string }>
}

export default async function ChildSettingsPage({ params }: PageProps) {
  const { childId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: childProfile } = await supabase
    .from('profiles')
    .select('id, full_name, parent_id, level, xp, age')
    .eq('id', childId)
    .single()

  if (!childProfile) notFound()
  if (childProfile.parent_id !== user.id) redirect('/parents/dashboard')

  return (
    <SettingsClient
      childId={childId}
      childName={childProfile.full_name ?? 'Child'}
      childAge={childProfile.age ?? 6}
    />
  )
}
