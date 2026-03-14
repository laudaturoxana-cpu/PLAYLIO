import Link from 'next/link'

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden"
      aria-label="Secțiunea principală Playlio"
      style={{ backgroundColor: '#FAFAFA' }}
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ position: 'absolute', top: '5%', left: '-10%', width: '45%', paddingBottom: '45%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,195,247,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '-8%', width: '40%', paddingBottom: '40%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,112,67,0.10) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '35%', paddingBottom: '35%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,187,106,0.10) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '30%', paddingBottom: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,213,79,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6">

        {/* Pill badge */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold font-nunito"
          style={{ background: 'rgba(79,195,247,0.12)', border: '1px solid #4FC3F7', color: '#0288D1' }}
        >
          🌍 Sigur · Fără reclame · Educativ
        </span>

        {/* Heading */}
        <h1 className="font-fredoka w-full" style={{ lineHeight: 1.1 }}>
          <span
            className="block font-fredoka"
            style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 400, color: '#212121' }}
          >
            Bine ai venit în
          </span>
          <span
            className="block font-fredoka"
            style={{
              fontSize: 'clamp(40px, 8vw, 72px)',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #4FC3F7 0%, #FF7043 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              paddingBottom: '6px',
              lineHeight: 1.15,
            }}
          >
            Lumea Playlio
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-nunito w-full"
          style={{ fontSize: 'clamp(15px, 2.5vw, 19px)', color: '#757575', maxWidth: '560px', lineHeight: 1.6 }}
        >
          O lume colorată și sigură unde copiii explorează, construiesc,
          învață și se joacă — fără reclame, fără pericole.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center">
          <Link
            href="/register"
            className="font-nunito font-bold text-white rounded-full transition-all duration-300 hover:opacity-90 active:scale-95 text-center"
            style={{
              backgroundColor: '#FF7043',
              boxShadow: '0 4px 20px rgba(255,112,67,0.35)',
              padding: '14px 36px',
              fontSize: '17px',
              width: '100%',
              maxWidth: '280px',
            }}
          >
            Începe Aventura
          </Link>
          <Link
            href="#lumi"
            className="font-nunito font-bold rounded-full border-2 transition-all duration-300 hover:bg-[#4FC3F7] hover:text-white text-center"
            style={{
              borderColor: '#4FC3F7',
              color: '#4FC3F7',
              padding: '14px 36px',
              fontSize: '17px',
              width: '100%',
              maxWidth: '280px',
            }}
          >
            Descoperă lumile
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Gratuit', 'Fără reclame', 'Sigur pentru copii', 'Educativ'].map((t) => (
            <span key={t} className="font-nunito text-xs font-semibold" style={{ color: '#9E9E9E' }}>
              ✓ {t}
            </span>
          ))}
        </div>

        {/* Lio mascot + 4 world badges */}
        <div
          className="relative w-full mx-auto"
          style={{ maxWidth: '500px', height: 'clamp(200px, 40vw, 320px)' }}
          aria-hidden="true"
        >
          {/* Glow background */}
          <div
            className="absolute inset-0 rounded-[32px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(79,195,247,0.10) 0%, rgba(255,112,67,0.06) 100%)' }}
          />

          {/* Lio center */}
          <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
            <svg
              width="90"
              height="90"
              viewBox="0 0 80 80"
              role="img"
              aria-label="Mascota Lio"
              style={{ animation: 'bounce-soft 3s ease-in-out infinite' }}
            >
              <defs>
                <radialGradient id="lg1" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFE57F" />
                  <stop offset="100%" stopColor="#FF8F00" />
                </radialGradient>
              </defs>
              <circle cx="40" cy="44" r="30" fill="url(#lg1)" />
              <circle cx="30" cy="40" r="5" fill="#212121" />
              <circle cx="50" cy="40" r="5" fill="#212121" />
              <circle cx="32" cy="38" r="2" fill="white" />
              <circle cx="52" cy="38" r="2" fill="white" />
              <path d="M30 52 Q40 62 50 52" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="28" cy="16" r="5" fill="#4FC3F7" />
              <line x1="28" y1="21" x2="32" y2="28" stroke="#4FC3F7" strokeWidth="2" />
              <circle cx="52" cy="12" r="4" fill="#FF7043" />
              <line x1="52" y1="16" x2="48" y2="24" stroke="#FF7043" strokeWidth="2" />
            </svg>
          </div>

          {/* 4 floating world badges */}
          {[
            { label: 'Adventure', emoji: '🗺️', bg: 'rgba(102,187,106,0.15)', color: '#2E7D32', top: '8%', left: '2%', delay: '0s' },
            { label: 'Builder', emoji: '🏗️', bg: 'rgba(79,195,247,0.15)', color: '#0277BD', top: '8%', right: '2%', delay: '0.5s' },
            { label: 'Learning', emoji: '📚', bg: 'rgba(255,112,67,0.15)', color: '#BF360C', bottom: '12%', left: '2%', delay: '1s' },
            { label: 'Jump', emoji: '🎮', bg: 'rgba(255,213,79,0.20)', color: '#F57F17', bottom: '12%', right: '2%', delay: '1.5s' },
          ].map((c) => (
            <div
              key={c.label}
              className="absolute flex flex-col items-center gap-1.5"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '10px 14px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
                minWidth: '90px',
                top: c.top,
                bottom: (c as { bottom?: string }).bottom,
                left: (c as { left?: string }).left,
                right: (c as { right?: string }).right,
                animation: `float 3s ease-in-out ${c.delay} infinite`,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {c.emoji}
              </div>
              <span className="font-fredoka font-semibold" style={{ fontSize: 12, color: c.color }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
