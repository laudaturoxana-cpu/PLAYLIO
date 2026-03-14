import Link from 'next/link'

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden"
      aria-label="Playlio main section"
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
      <div className="relative z-10 flex flex-col items-center text-center" style={{ width: '100%', maxWidth: '896px', margin: '0 auto', gap: 'clamp(20px, 4vw, 24px)' }}>

        {/* Pill badge */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold font-nunito"
          style={{ background: 'rgba(79,195,247,0.12)', border: '1px solid #4FC3F7', color: '#0288D1' }}
        >
          🌍 Safe · No Ads · Educational
        </span>

        {/* Heading */}
        <h1 className="font-fredoka w-full" style={{ lineHeight: 1.1 }}>
          <span
            className="block font-fredoka"
            style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 400, color: '#212121' }}
          >
            Welcome to
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
            The Playlio World
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-nunito w-full"
          style={{ fontSize: 'clamp(15px, 2.5vw, 19px)', color: '#757575', maxWidth: '560px', lineHeight: 1.6 }}
        >
          A colorful and safe world where kids explore, build, learn and play — no ads, no dangers.
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
            Start the Adventure
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
            Explore the worlds
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Free', 'No ads', 'Safe for kids', 'Educational'].map((t) => (
            <span key={t} className="font-nunito text-xs font-semibold" style={{ color: '#9E9E9E' }}>
              ✓ {t}
            </span>
          ))}
        </div>

        {/* Lio mascot + 4 world badges */}
        <div className="w-full" style={{ margin: '0 auto', maxWidth: '480px' }} aria-hidden="true">
          {/* Lio center */}
          <div className="flex justify-center" style={{ marginBottom: '16px' }}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              role="img"
              aria-label="Lio Mascot"
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

          {/* 4 world badges — 2x2 grid, always visible on all screens */}
          <div className="grid grid-cols-2" style={{ gap: '12px' }}>
            {[
              { label: 'Adventure', emoji: '🗺️', bg: 'rgba(102,187,106,0.15)', color: '#2E7D32', delay: '0s' },
              { label: 'Builder', emoji: '🏗️', bg: 'rgba(79,195,247,0.15)', color: '#0277BD', delay: '0.5s' },
              { label: 'Learning', emoji: '📚', bg: 'rgba(255,112,67,0.15)', color: '#BF360C', delay: '1s' },
              { label: 'Jump', emoji: '🎮', bg: 'rgba(255,213,79,0.20)', color: '#F57F17', delay: '1.5s' },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3"
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: 'clamp(10px, 2vw, 14px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  animation: `float 3s ease-in-out ${c.delay} infinite`,
                }}
              >
                <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: 10, backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {c.emoji}
                </div>
                <span className="font-fredoka font-semibold" style={{ fontSize: 'clamp(13px, 2.5vw, 15px)', color: c.color }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
