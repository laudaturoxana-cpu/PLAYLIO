import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/shared/AppNav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
      {/* pb-16 leaves room for the fixed bottom nav bar */}
      <main className="pb-16">{children}</main>
      <AppNav />
    </div>
  )
}
