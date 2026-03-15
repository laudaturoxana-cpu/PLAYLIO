import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LetterGame from './LetterGame'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

interface PageProps {
  searchParams: Promise<{ series?: string }>
}

export default async function LettersPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { series: seriesParam } = await searchParams
  const series = seriesParam === '2' ? 2 : seriesParam === '3' ? 3 : 1

  const profile = await getActiveChildProfile(user.id)

  return (
    <LetterGame
      userId={user.id}
      initialCoins={profile.coins}
      series={series as 1 | 2 | 3}
      childName={profile.full_name ?? 'Explorer'}
      childAge={profile.age ?? 6}
    />
  )
}
