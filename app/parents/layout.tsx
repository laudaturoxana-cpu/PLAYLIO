import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ParentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/parents/dashboard')
  }

  // Verifică că userul e părinte
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Only block if explicitly identified as a child profile
  if (profile?.role === 'child') {
    redirect('/worlds')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light)' }}>
      {/* Header minimal dashboard părinți */}
      <header
        className="sticky top-0 z-40 border-b border-black/6 px-4 py-3"
        style={{ backgroundColor: 'white' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="font-fredoka text-2xl font-semibold"
            aria-label="Playlio — home page"
          >
            <span style={{ color: 'var(--sky)' }}>PLAYLI</span>
            <span style={{ color: 'var(--coral)' }}>O</span>
          </a>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="font-nunito text-sm font-semibold text-[var(--gray)] hover:text-[var(--coral)] transition-colors px-3 py-2 rounded-xl hover:bg-[var(--light)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
