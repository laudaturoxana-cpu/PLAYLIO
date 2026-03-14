import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LetterGame from './LetterGame'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, coins')
    .eq('id', user.id)
    .single()

  return (
    <LetterGame
      userId={user.id}
      initialCoins={profile?.coins ?? 0}
      series={series as 1 | 2 | 3}
    />
  )
}
