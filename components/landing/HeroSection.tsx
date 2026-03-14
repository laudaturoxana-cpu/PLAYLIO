import Link from 'next/link'

interface FloatingCard {
  label: string
  emoji: string
  color: string
  delay: string
  top?: string
  bottom?: string
  left?: string
  right?: string
}

const FLOATING_CARDS: FloatingCard[] = [
  { label: 'Adventure', emoji: '🗺️', color: 'var(--mint)', delay: '0s', top: '10%', left: '5%' },
  { label: 'Builder', emoji: '🏗️', color: 'var(--sky)', delay: '0.4s', top: '15%', right: '8%' },
  { label: 'Learning', emoji: '📚', color: 'var(--coral)', delay: '0.8s', bottom: '25%', left: '3%' },
  { label: 'Jump', emoji: '🎮', color: 'var(--sun)', delay: '1.2s', bottom: '20%', right: '5%' },
]

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden"
      aria-label="Secțiunea principală Playlio"
    >
      {/* Decorative SVG background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="15%" cy="20%" r="220" fill="var(--sky)" opacity="0.08" />
        <circle cx="85%" cy="15%" r="180" fill="var(--coral)" opacity="0.07" />
        <circle cx="75%" cy="80%" r="260" fill="var(--mint)" opacity="0.07" />
        <circle cx="20%" cy="85%" r="160" fill="var(--purple)" opacity="0.08" />
        <circle cx="50%" cy="50%" r="300" fill="var(--sun)" opacity="0.04" />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
        {/* Pill tag */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold font-nunito"
          style={{
            background: 'rgba(79,195,247,0.10)',
            border: '1px solid var(--sky)',
            color: 'var(--sky-dark)',
          }}
        >
          🌍 Sigur pentru copii · Fără reclame · Educativ
        </span>

        {/* H1 */}
        <h1 className="font-fredoka font-semibold text-[var(--dark)]">
          <span className="block text-4xl md:text-5xl lg:text-6xl mb-1">Bine ai venit în</span>
          <span
            className="block text-5xl md:text-6xl lg:text-7xl"
            style={{
              background: 'linear-gradient(90deg, var(--sky), var(--coral))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Lumea Playlio
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-nunito text-lg md:text-xl text-[var(--gray)] max-w-[560px]">
          O lume colorată și sigură unde copiii explorează, construiesc,
          învață și se joacă — fără reclame, fără pericole.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-lg text-white px-9 py-4 min-h-[56px] transition-all duration-300 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'var(--coral)',
              boxShadow: 'var(--shadow-coral)',
            }}
          >
            Începe Aventura
          </Link>
          <Link
            href="#lumi"
            className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-lg text-[var(--dark)] px-9 py-4 min-h-[56px] border-2 border-[var(--dark)] transition-all duration-300 hover:bg-[var(--dark)] hover:text-white active:scale-95"
          >
            Descoperă lumile
          </Link>
        </div>

        {/* Trust line */}
        <p className="font-nunito text-[13px] text-[var(--gray)]">
          ✓ Gratuit &nbsp;·&nbsp; ✓ Fără reclame &nbsp;·&nbsp; ✓ Sigur pentru copii &nbsp;·&nbsp; ✓ Educativ
        </p>
      </div>

      {/* Hero visual — floating world cards + Lio */}
      <div className="relative z-10 mt-12 w-full max-w-[600px] h-[280px] md:h-[360px] mx-auto">
        {/* Radial glow background */}
        <div
          className="absolute inset-0 rounded-[32px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(79,195,247,0.12) 0%, rgba(206,147,216,0.10) 50%, rgba(255,112,67,0.08) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Floating world cards */}
        {FLOATING_CARDS.map((card) => (
          <div
            key={card.label}
            className="absolute flex flex-col items-center gap-1 rounded-2xl px-3 py-2 shadow-[var(--shadow-md)] bg-white"
            style={{
              animationName: 'float',
              animationDuration: '4s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: card.delay,
              top: card.top,
              bottom: card.bottom,
              left: card.left,
              right: card.right,
            }}
            aria-hidden="true"
          >
            <span className="text-2xl">{card.emoji}</span>
            <span
              className="font-fredoka text-sm font-semibold"
              style={{ color: card.color }}
            >
              {card.label}
            </span>
          </div>
        ))}

        {/* Lio mascot — center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            role="img"
            aria-label="Mascota Lio"
            style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
          >
            <defs>
              <radialGradient id="lio-body" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FFD54F" />
              </radialGradient>
            </defs>
            {/* Corp */}
            <circle cx="50" cy="54" r="38" fill="url(#lio-body)" />
            <circle cx="50" cy="54" r="38" fill="var(--coral)" opacity="0.12" />
            {/* Ochi */}
            <circle cx="38" cy="48" r="6" fill="var(--dark)" />
            <circle cx="62" cy="48" r="6" fill="var(--dark)" />
            <circle cx="40" cy="45.5" r="2" fill="white" />
            <circle cx="64" cy="45.5" r="2" fill="white" />
            {/* Zâmbet */}
            <path
              d="M 36 62 Q 50 72 64 62"
              stroke="var(--dark)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Antene */}
            <circle cx="34" cy="18" r="7" fill="var(--sky)" />
            <circle cx="66" cy="14" r="5.5" fill="var(--coral)" />
            {/* Stele decorative */}
            <text x="6" y="30" fontSize="14" style={{ animation: 'spin-slow 8s linear infinite', transformOrigin: '13px 24px' }}>⭐</text>
            <text x="76" y="88" fontSize="12">✨</text>
          </svg>
        </div>

        {/* Particule decorative */}
        {[
          { x: '12%', y: '75%', size: 8, color: 'var(--sun)', delay: '0.3s' },
          { x: '88%', y: '30%', size: 10, color: 'var(--mint)', delay: '0.9s' },
          { x: '45%', y: '8%', size: 6, color: 'var(--purple)', delay: '1.5s' },
          { x: '70%', y: '70%', size: 7, color: 'var(--coral)', delay: '0.6s' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animation: `float 3s ease-in-out ${p.delay} infinite`,
              opacity: 0.7,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  )
}
