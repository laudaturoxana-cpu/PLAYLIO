import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { generateWeeklyReport } from '@/lib/parents/weeklyReport'
import ReportClient from './ReportClient'

interface PageProps {
  params: Promise<{ childId: string }>
}

export default async function WeeklyReportPage({ params }: PageProps) {
  const { childId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verifică că este părintele acestui copil
  const { data: childProfile } = await supabase
    .from('profiles')
    .select('id, full_name, parent_id, level, xp')
    .eq('id', childId)
    .single()

  if (!childProfile) notFound()
  if (childProfile.parent_id !== user.id) redirect('/parents/dashboard')

  // Estimăm vârsta din level (aproximare simplă)
  const estimatedAge = Math.min(10, Math.max(3, 3 + childProfile.level))

  const report = await generateWeeklyReport(
    supabase,
    childId,
    childProfile.full_name ?? 'Copil',
    estimatedAge
  )

  return <ReportClient report={report} />
}
