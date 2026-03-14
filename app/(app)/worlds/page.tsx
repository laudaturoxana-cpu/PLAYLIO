import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const WORLDS = [
  {
    label: 'Lumea Literelor',
    sublabel: 'Fonică & Citire',
    emoji: '📚',
    href: '/play/learning',
    gradient: 'linear-gradient(135deg, #FF8A65, #FF7043)',
    shadow: 'rgba(255,112,67,0.35)',
    bg: 'rgba(255,138,101,0.10)',
    border: 'rgba(255,112,67,0.25)',
    textColor: '#D84315',
  },
  {
    label: 'Lumea Aventurii',
    sublabel: 'Explorare & Stele',
    emoji: '🗺️',
    href: '/play/adventure',
    gradient: 'linear-gradient(135deg, #66BB6A, #43A047)',
    shadow: 'rgba(67,160,71,0.35)',
    bg: 'rgba(102,187,106,0.10)',
    border: 'rgba(67,160,71,0.25)',
    textColor: '#2E7D32',
  },
  {
    label: 'Lumea Construcțiilor',
    sublabel: 'Decorează & Creează',
    emoji: '🏗️',
    href: '/play/builder',
    gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
    shadow: 'rgba(2,136,209,0.35)',
    bg: 'rgba(79,195,247,0.10)',
    border: 'rgba(2,136,209,0.25)',
    textColor: '#01579B',
  },
  {
    label: 'Lumea Salturilor',
    sublabel: 'Platforme & Sărituri',
    emoji: '🎮',
    href: '/play/jump',
    gradient: 'linear-gradient(135deg, #FFD54F, #F9A825)',
    shadow: 'rgba(249,168,37,0.35)',
    bg: 'rgba(255,213,79,0.10)',
    border: 'rgba(249,168,37,0.25)',
    textColor: '#E65100',
  },
] as const

export default async function WorldsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, coins, level, xp')
    .eq('id', user.id)
    .single()

  const name = profile?.full_name ?? 'Aventurierule'
  const coins = profile?.coins ?? 0
  const level = profile?.level ?? 1
  const xp = profile?.xp ?? 0
  const xpForNext = level * 100
  const xpPercent = Math.min(100, Math.round((xp / xpForNext) * 100))

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, rgba(79,195,247,0.06) 0%, rgba(255,255,255,0) 30%)',
        backgroundColor: 'var(--white)',
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Top HUD */}
        <div className="flex items-center justify-between mb-6">
          {/* Level + XP */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-2xl font-fredoka text-base font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, var(--sky), var(--sky-dark))' }}
            >
              {level}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-inter text-[10px] text-[var(--gray)] leading-none">Nivel</span>
              <div className="flex items-center gap-1">
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ width: '56px', backgroundColor: 'rgba(0,0,0,0.08)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${xpPercent}%`,
                      background: 'linear-gradient(90deg, var(--sky), var(--sky-dark))',
                    }}
                  />
                </div>
                <span className="font-inter text-[10px] text-[var(--gray)]">{xp}/{xpForNext}</span>
              </div>
            </div>
          </div>

          {/* Coins */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,213,79,0.12)',
              border: '1.5px solid rgba(255,193,7,0.3)',
            }}
          >
            <span className="text-base leading-none">🪙</span>
            <span className="font-fredoka text-sm font-semibold text-[var(--sun-dark)]">
              {coins.toLocaleString('ro-RO')}
            </span>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)]">
            Salut, {name}! 👋
          </h1>
          <p className="font-nunito text-sm text-[var(--gray)] mt-1">
            În ce lume explorăm azi?
          </p>
        </div>

        {/* World cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {WORLDS.map((world) => (
            <Link
              key={world.label}
              href={world.href}
              className="flex flex-col gap-3 rounded-3xl p-5 active:scale-95 transition-transform"
              style={{
                backgroundColor: world.bg,
                border: `1.5px solid ${world.border}`,
                boxShadow: `0 4px 16px ${world.shadow}`,
                touchAction: 'manipulation',
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl"
                style={{ background: world.gradient }}
              >
                {world.emoji}
              </div>

              {/* Text */}
              <div>
                <p
                  className="font-fredoka text-sm font-semibold leading-tight"
                  style={{ color: world.textColor }}
                >
                  {world.label}
                </p>
                <p className="font-inter text-[11px] text-[var(--gray)] mt-0.5">
                  {world.sublabel}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Daily tip */}
        <div
          className="rounded-3xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(79,195,247,0.08), rgba(255,213,79,0.08))',
            border: '1.5px solid rgba(79,195,247,0.15)',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p className="font-inter text-xs font-semibold text-[var(--sky-dark)] mb-0.5">
                Sfatul zilei
              </p>
              <p className="font-nunito text-sm text-[var(--dark)] leading-relaxed">
                Joacă 10 minute pe zi în Lumea Literelor pentru a avansa rapid!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
