import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getActiveChildProfile } from '@/lib/getActiveChildProfile'

const WORLDS = [
  {
    label: 'Letters World',
    sublabel: 'Phonics & Reading',
    emoji: '📚',
    href: '/play/learning',
    gradient: 'linear-gradient(135deg, #FF8A65, #FF7043)',
    shadow: 'rgba(255,112,67,0.35)',
    bg: 'rgba(255,138,101,0.10)',
    border: 'rgba(255,112,67,0.25)',
    textColor: '#D84315',
  },
  {
    label: 'Adventure World',
    sublabel: 'Explore & Stars',
    emoji: '🗺️',
    href: '/play/adventure',
    gradient: 'linear-gradient(135deg, #66BB6A, #43A047)',
    shadow: 'rgba(67,160,71,0.35)',
    bg: 'rgba(102,187,106,0.10)',
    border: 'rgba(67,160,71,0.25)',
    textColor: '#2E7D32',
  },
  {
    label: 'Builder World',
    sublabel: 'Decorate & Create',
    emoji: '🏗️',
    href: '/play/builder',
    gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
    shadow: 'rgba(2,136,209,0.35)',
    bg: 'rgba(79,195,247,0.10)',
    border: 'rgba(2,136,209,0.25)',
    textColor: '#01579B',
  },
  {
    label: 'Numbers World',
    sublabel: 'Math & Counting',
    emoji: '🔢',
    href: '/play/learning/numbers',
    gradient: 'linear-gradient(135deg, #FF7043, #FF5722)',
    shadow: 'rgba(255,87,34,0.35)',
    bg: 'rgba(255,112,67,0.10)',
    border: 'rgba(255,87,34,0.25)',
    textColor: '#BF360C',
  },
  {
    label: 'Jump World',
    sublabel: 'Platforms & Jumps',
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

  // Check parent role
  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isParent = parentProfile?.role === 'parent'

  const profile = await getActiveChildProfile(user.id)
  const isPlayingAsChild = profile.activeChildId !== null

  // If parent hasn't selected a child yet, redirect to dashboard
  if (isParent && !isPlayingAsChild) {
    // Check if they have children
    const { data: children } = await supabase
      .from('profiles')
      .select('id')
      .eq('parent_id', user.id)
      .eq('role', 'child')
      .limit(1)

    if (!children || children.length === 0) {
      redirect('/parents/dashboard?onboarding=true')
    } else {
      redirect('/parents/dashboard')
    }
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
      style={{
        background: 'linear-gradient(180deg, rgba(79,195,247,0.06) 0%, rgba(255,255,255,0) 30%)',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(16px, 4vw, 48px) clamp(16px, 4vw, 32px)',
        }}
      >
        {/* Top HUD */}
        <div className="flex items-center justify-between mb-8">
          {/* Level + XP */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-2xl font-fredoka font-semibold text-white"
              style={{
                width: 'clamp(40px, 5vw, 52px)',
                height: 'clamp(40px, 5vw, 52px)',
                fontSize: 'clamp(16px, 2vw, 20px)',
                background: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
              }}
            >
              {level}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-inter text-xs" style={{ color: '#757575' }}>
                Level
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    width: 'clamp(56px, 8vw, 96px)',
                    backgroundColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${xpPercent}%`,
                      background: 'linear-gradient(90deg, #4FC3F7, #0288D1)',
                    }}
                  />
                </div>
                <span className="font-inter text-xs" style={{ color: '#757575' }}>
                  {xp}/{xpForNext} XP
                </span>
              </div>
            </div>
          </div>

          {/* Coins */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,213,79,0.12)',
              border: '1.5px solid rgba(255,193,7,0.3)',
            }}
          >
            <span style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>🪙</span>
            <span
              className="font-fredoka font-semibold"
              style={{ fontSize: 'clamp(14px, 1.6vw, 18px)', color: '#F57F17' }}
            >
              {coins.toLocaleString('en-US')}
            </span>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <h1
            className="font-fredoka font-semibold"
            style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#212121' }}
          >
            Hi, {name}! 👋
          </h1>
          <p
            className="font-nunito mt-1"
            style={{ fontSize: 'clamp(14px, 1.6vw, 18px)', color: '#757575' }}
          >
            Which world are we exploring today?
          </p>
          {isPlayingAsChild && (
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-inter text-xs font-semibold"
              style={{ background: 'rgba(79,195,247,0.12)', color: '#0277BD', border: '1px solid rgba(79,195,247,0.25)' }}
            >
              🦁 Playing as {name}
            </div>
          )}
        </div>

        {/* World cards — 2 cols on mobile, 3 on tablet, 5 on desktop */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8"
          style={{ gap: 'clamp(12px, 2vw, 24px)' }}
        >
          {WORLDS.map((world) => (
            <Link
              key={world.label}
              href={world.href}
              className="flex flex-col rounded-3xl active:scale-95 transition-transform"
              style={{
                padding: 'clamp(16px, 2.5vw, 28px)',
                gap: 'clamp(12px, 1.5vw, 20px)',
                backgroundColor: world.bg,
                border: `1.5px solid ${world.border}`,
                boxShadow: `0 4px 20px ${world.shadow}`,
                touchAction: 'manipulation',
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: 'clamp(48px, 6vw, 72px)',
                  height: 'clamp(48px, 6vw, 72px)',
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  background: world.gradient,
                }}
              >
                {world.emoji}
              </div>

              {/* Text */}
              <div>
                <p
                  className="font-fredoka font-semibold leading-tight"
                  style={{
                    fontSize: 'clamp(13px, 1.4vw, 18px)',
                    color: world.textColor,
                  }}
                >
                  {world.label}
                </p>
                <p
                  className="font-inter mt-1"
                  style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: '#757575' }}
                >
                  {world.sublabel}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Daily tip */}
        <div
          className="rounded-3xl"
          style={{
            padding: 'clamp(14px, 2vw, 24px)',
            background: 'linear-gradient(135deg, rgba(79,195,247,0.08), rgba(255,213,79,0.08))',
            border: '1.5px solid rgba(79,195,247,0.15)',
          }}
        >
          <div className="flex items-start gap-3">
            <span style={{ fontSize: 'clamp(18px, 2vw, 24px)', marginTop: '2px' }}>💡</span>
            <div>
              <p
                className="font-inter font-semibold mb-1"
                style={{ fontSize: 'clamp(11px, 1.1vw, 14px)', color: '#0277BD' }}
              >
                Daily tip
              </p>
              <p
                className="font-nunito leading-relaxed"
                style={{ fontSize: 'clamp(13px, 1.3vw, 16px)', color: '#212121' }}
              >
                Play 10 minutes a day in Letters World to level up fast!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
