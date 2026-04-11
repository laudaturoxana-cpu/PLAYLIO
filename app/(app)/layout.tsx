import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLanguage } from '@/lib/i18n/getLanguage'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
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

  const lang = await getLanguage()

  return (
    <LanguageProvider initialLang={lang}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
        <main className="app-main-content">{children}</main>
        <AppNav />
      </div>
    </LanguageProvider>
  )
}
