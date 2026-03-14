import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(79,195,247,0.06) 0%, rgba(255,213,79,0.06) 100%)',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* Cercuri decorative */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="8%" cy="15%" r="160" fill="var(--sky)" opacity="0.07" />
        <circle cx="92%" cy="85%" r="200" fill="var(--coral)" opacity="0.06" />
        <circle cx="85%" cy="10%" r="100" fill="var(--sun)" opacity="0.07" />
      </svg>

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-8 font-fredoka text-3xl font-semibold"
        aria-label="Playlio — înapoi la pagina principală"
      >
        <span style={{ color: 'var(--sky)' }}>PLAYLI</span>
        <span style={{ color: 'var(--coral)' }}>O</span>
      </Link>

      {/* Card conținut */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white shadow-[var(--shadow-md)] border border-black/5 p-8">
        {children}
      </div>

      {/* Footer minimal */}
      <p className="relative z-10 mt-6 font-nunito text-xs text-[var(--gray)]">
        © 2026 Playlio · Sigur pentru copii
      </p>
    </div>
  )
}
