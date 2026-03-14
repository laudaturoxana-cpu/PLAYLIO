import Link from 'next/link'

interface FloatingCard {
  label: string
  emoji: string
  color: string
  bgColor: string
  delay: string
  top?: string
  bottom?: string
  left?: string
  right?: string
}

const FLOATING_CARDS: FloatingCard[] = [
  { label: 'Adventure', emoji: '🗺️', color: 'var(--mint-dark)', bgColor: 'rgba(102,187,106,0.15)', delay: '0s', top: '10%', left: '5%' },
  { label: 'Builder', emoji: '🏗️', color: 'var(--sky-dark)', bgColor: 'rgba(79,195,247,0.15)', delay: '0.5s', top: '15%', right: '8%' },
  { label: 'Learning', emoji: '📚', color: 'var(--coral-dark)', bgColor: 'rgba(255,112,67,0.15)', delay: '1s', bottom: '25%', left: '3%' },
  { label: 'Jump', emoji: '🎮', color: '#F57F17', bgColor: 'rgba(255,213,79,0.20)', delay: '1.5s', bottom: '20%', right: '5%' },
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

        {/* FIX 20: echilibru tipografic — FIX 4: gradient explicit hex */}
        <h1 className="font-fredoka text-[var(--dark)]" style={{ lineHeight: 1.1 }}>
          <span
            className="block"
            style={{
              fontSize: 'clamp(28px, 6vw, 40px)',
              fontWeight: 400,
              marginBottom: 0,
            }}
          >
            Bine ai venit în
          </span>
          <span
            className="block"
            style={{
              fontSize: 'clamp(44px, 9vw, 64px)',
              fontWeight: 600,
              display: 'block',
              background: 'linear-gradient(90deg, #4FC3F7 0%, #FF7043 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
              paddingBottom: '4px',
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
          {/* FIX 9: border + culoare sky blue, hover sky */}
          <Link
            href="#lumi"
            className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-lg px-9 py-4 min-h-[56px] border-2 transition-all duration-300 active:scale-95 hover:bg-[#4FC3F7] hover:text-white hover:border-[#4FC3F7]"
            style={{
              borderColor: '#4FC3F7',
              color: '#4FC3F7',
            }}
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

        {/* FIX 7: Floating world cards — min-width 130px, icon container 44x44px */}
        {FLOATING_CARDS.map((card) => (
          <div
            key={card.label}
            className="absolute bg-white"
            style={{
              minWidth: '130px',
              padding: '14px 18px',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              animationName: 'float',
              animationDuration: '3s',
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
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}
            >
              {card.emoji}
            </div>
            <span
              className="font-fredoka font-semibold"
              style={{ color: card.color, fontSize: '14px' }}
            >
              {card.label}
            </span>
          </div>
        ))}

        {/* FIX 6: Lio mascot SVG custom — bounce 3s */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <svg
            width="100"
            height="100"
            viewBox="0 0 80 80"
            role="img"
            aria-label="Mascota Lio"
            style={{ animation: 'bounce-soft 3s ease-in-out infinite' }}
          >
            <defs>
              <radialGradient id="bodyGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFE57F" />
                <stop offset="100%" stopColor="#FF8F00" />
              </radialGradient>
            </defs>
            {/* Corp */}
            <circle cx="40" cy="44" r="30" fill="url(#bodyGrad)" />
            {/* Ochi */}
            <circle cx="30" cy="40" r="5" fill="#212121" />
            <circle cx="50" cy="40" r="5" fill="#212121" />
            {/* Reflexe ochi */}
            <circle cx="32" cy="38" r="2" fill="white" />
            <circle cx="52" cy="38" r="2" fill="white" />
            {/* Gura zambet */}
            <path d="M30 52 Q40 62 50 52" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Antena stanga */}
            <circle cx="28" cy="16" r="5" fill="#4FC3F7" />
            <line x1="28" y1="21" x2="32" y2="28" stroke="#4FC3F7" strokeWidth="2" />
            {/* Antena dreapta */}
            <circle cx="52" cy="12" r="4" fill="#FF7043" />
            <line x1="52" y1="16" x2="48" y2="24" stroke="#FF7043" strokeWidth="2" />
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
