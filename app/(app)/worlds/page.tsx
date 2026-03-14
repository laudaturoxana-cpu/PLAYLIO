import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WorldsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, coins, level')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <p className="font-nunito text-base text-[var(--gray)] mb-2">Bun venit,</p>
        <h1 className="font-fredoka text-4xl font-semibold text-[var(--dark)]">
          {profile?.full_name ?? 'Aventurierule'} 👋
        </h1>
        <p className="font-nunito text-sm text-[var(--gray)] mt-2">
          Nivel {profile?.level ?? 1} · {profile?.coins ?? 0} coins 🪙
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {[
          { label: 'Adventure', emoji: '🗺️', href: '/play/adventure', color: 'var(--mint-dark)' },
          { label: 'Builder', emoji: '🏗️', href: '/play/builder', color: 'var(--sky-dark)' },
          { label: 'Learning', emoji: '📚', href: '/play/learning', color: 'var(--coral-dark)' },
          { label: 'Jump', emoji: '🎮', href: '/play/jump', color: '#F57F17' },
        ].map((world) => (
          <a
            key={world.label}
            href={world.href}
            className="flex flex-col items-center gap-2 rounded-3xl p-6 bg-white shadow-[var(--shadow-sm)] border border-black/5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)] active:scale-95"
          >
            <span className="text-4xl" aria-hidden="true">{world.emoji}</span>
            <span
              className="font-fredoka text-base font-semibold"
              style={{ color: world.color }}
            >
              {world.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
