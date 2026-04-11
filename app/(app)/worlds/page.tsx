import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

const WORLDS = [
  {
    label: 'Litere',
    sublabel: 'Fonică & Citire',
    emoji: '📚',
    href: '/play/learning',
    gradient: 'linear-gradient(135deg, #FF7043 0%, #D84315 100%)',
    glow: 'rgba(255,112,67,0.40)',
    badge: 'ABCs',
  },
  {
    label: 'Aventură',
    sublabel: 'Explorează & Stele',
    emoji: '🗺️',
    href: '/play/adventure',
    gradient: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
    glow: 'rgba(67,160,71,0.40)',
    badge: 'Quest',
  },
  {
    label: 'Builder',
    sublabel: 'Construiește & Creează',
    emoji: '🏗️',
    href: '/play/builder',
    gradient: 'linear-gradient(135deg, #29B6F6 0%, #0277BD 100%)',
    glow: 'rgba(2,136,209,0.40)',
    badge: 'Build',
  },
  {
    label: 'Cifre',
    sublabel: 'Matematică & Numărare',
    emoji: '🔢',
    href: '/play/learning/numbers',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #BF360C 100%)',
    glow: 'rgba(255,87,34,0.40)',
    badge: '123',
  },
  {
    label: 'Jump!',
    sublabel: 'Sari & Aleargă',
    emoji: '🎮',
    href: '/play/jump',
    gradient: 'linear-gradient(135deg, #FFD54F 0%, #F57F17 100%)',
    glow: 'rgba(245,127,23,0.40)',
    badge: 'Run',
  },
] as const

export default async function WorldsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isParent = parentProfile?.role === 'parent'
  const profile = await getActiveChildProfile(user.id)
  const isPlayingAsChild = profile.activeChildId !== null

  if (isParent && !isPlayingAsChild) {
    const { data: children } = await supabase
      .from('profiles')
      .select('id')
      .eq('parent_id', user.id)
      .eq('role', 'child')
      .limit(1)

    redirect(!children || children.length === 0
      ? '/parents/dashboard?onboarding=true'
      : '/parents/dashboard'
    )
  }

  const name = profile.full_name ?? 'Explorer'
  const coins = profile.coins
  const level = profile.level
  const xp = profile.xp
  const xpForNext = level * 100
  const xpPercent = Math.min(100, Math.round((xp / xpForNext) * 100))

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #EBF8FF 0%, #ffffff 40%)' }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 40px)',
        }}
      >
        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between gap-3 rounded-2xl mb-8"
          style={{
            background: 'white',
            border: '1.5px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            padding: 'clamp(10px, 2vw, 16px) clamp(14px, 3vw, 24px)',
          }}
        >
          {/* Level + XP */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-2xl font-fredoka font-semibold text-white flex-shrink-0"
              style={{
                width: 'clamp(40px, 5vw, 52px)',
                height: 'clamp(40px, 5vw, 52px)',
                fontSize: 'clamp(16px, 2vw, 20px)',
                background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
                boxShadow: '0 4px 12px rgba(2,136,209,0.35)',
              }}
            >
              {level}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-inter text-xs font-semibold" style={{ color: '#9E9E9E', letterSpacing: '0.05em' }}>
                LEVEL
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ width: 'clamp(60px, 8vw, 100px)', backgroundColor: 'rgba(0,0,0,0.07)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${xpPercent}%`,
                      background: 'linear-gradient(90deg, #4FC3F7, #0288D1)',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                <span className="font-inter text-xs" style={{ color: '#9E9E9E' }}>
                  {xp}/{xpForNext}
                </span>
              </div>
            </div>
          </div>

          {/* Right: coins + parent */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: 'rgba(255,213,79,0.14)', border: '1.5px solid rgba(255,193,7,0.3)' }}
            >
              <span style={{ fontSize: 'clamp(15px, 2vw, 19px)' }}>🪙</span>
              <span
                className="font-fredoka font-semibold"
                style={{ fontSize: 'clamp(14px, 1.6vw, 18px)', color: '#F57F17' }}
              >
                {coins.toLocaleString('ro-RO')}
              </span>
            </div>
            <Link
              href="/parents/dashboard"
              className="flex items-center gap-1.5 rounded-xl bg-white border border-black/8 shadow-sm active:scale-95 transition-transform px-3 py-2"
              style={{ touchAction: 'manipulation', flexShrink: 0 }}
              aria-label="Parent dashboard"
            >
              <span style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>👨‍👧</span>
              <span className="font-inter font-semibold hidden sm:block" style={{ fontSize: '12px', color: '#757575' }}>
                Părinți
              </span>
            </Link>
          </div>
        </div>

        {/* ── Hero greeting ── */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1
              className="font-fredoka font-semibold"
              style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', color: '#212121', lineHeight: 1.1 }}
            >
              Salut, {name}! 👋
            </h1>
            <p
              className="font-nunito mt-2"
              style={{ fontSize: 'clamp(14px, 1.6vw, 18px)', color: '#757575' }}
            >
              În ce lume ne aventurăm azi?
            </p>
            {isPlayingAsChild && (
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-inter text-xs font-semibold"
                style={{ background: 'rgba(79,195,247,0.12)', color: '#0277BD', border: '1px solid rgba(79,195,247,0.25)' }}
              >
                🦁 Joci ca {name}
              </div>
            )}
          </div>
          {/* Lio mascot — decorative */}
          <div
            className="flex-shrink-0 hidden sm:flex items-center justify-center rounded-3xl"
            style={{
              width: 'clamp(72px, 9vw, 110px)',
              height: 'clamp(72px, 9vw, 110px)',
              background: 'linear-gradient(135deg, #FFF9C4, #FFD54F)',
              border: '2px solid rgba(255,193,7,0.3)',
              fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)',
              animation: 'bounce-soft 3s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            🦁
          </div>
        </div>

        {/* ── World cards ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          style={{ gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(28px, 4vw, 48px)' }}
        >
          {WORLDS.map((world) => (
            <Link
              key={world.label}
              href={world.href}
              className="relative flex flex-col items-center justify-end rounded-3xl overflow-hidden active:scale-95 hover:scale-[1.03] transition-transform select-none"
              style={{
                background: world.gradient,
                boxShadow: `0 8px 28px ${world.glow}`,
                aspectRatio: '3 / 4',
                minHeight: 'clamp(140px, 22vw, 220px)',
                touchAction: 'manipulation',
                textDecoration: 'none',
              }}
              aria-label={world.label}
            >
              {/* Badge top-right */}
              <div
                className="absolute top-3 right-3 font-inter font-bold rounded-full px-2 py-0.5"
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  color: 'white',
                  fontSize: 'clamp(8px, 1vw, 10px)',
                  letterSpacing: '0.06em',
                }}
              >
                {world.badge}
              </div>

              {/* Emoji */}
              <div
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                  lineHeight: 1,
                  marginBottom: 'clamp(8px, 1.5vw, 14px)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }}
                aria-hidden="true"
              >
                {world.emoji}
              </div>

              {/* Text overlay at bottom */}
              <div
                className="w-full text-center"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.30) 0%, transparent 100%)',
                  padding: 'clamp(10px, 2vw, 18px) 8px clamp(10px, 2vw, 16px)',
                }}
              >
                <p
                  className="font-fredoka font-semibold text-white"
                  style={{ fontSize: 'clamp(13px, 1.6vw, 18px)', lineHeight: 1.2 }}
                >
                  {world.label}
                </p>
                <p
                  className="font-nunito text-white/80"
                  style={{ fontSize: 'clamp(9px, 1vw, 12px)', marginTop: '2px' }}
                >
                  {world.sublabel}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Daily tip ── */}
        <div
          className="rounded-3xl flex items-start gap-3"
          style={{
            padding: 'clamp(16px, 2.5vw, 24px)',
            background: 'linear-gradient(135deg, rgba(79,195,247,0.08), rgba(255,213,79,0.10))',
            border: '1.5px solid rgba(79,195,247,0.18)',
          }}
        >
          <span style={{ fontSize: 'clamp(18px, 2vw, 24px)', marginTop: '1px', flexShrink: 0 }}>💡</span>
          <div>
            <p
              className="font-inter font-bold mb-1"
              style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#0277BD', letterSpacing: '0.05em' }}
            >
              SFATUL ZILEI
            </p>
            <p
              className="font-nunito leading-relaxed"
              style={{ fontSize: 'clamp(13px, 1.3vw, 16px)', color: '#212121' }}
            >
              Joacă 10 minute pe zi în Lumea Literelor ca să avansezi rapid!
            </p>
          </div>
        </div>

        <div style={{ height: 'clamp(20px, 3vw, 40px)' }} />
      </div>
    </div>
  )
}
