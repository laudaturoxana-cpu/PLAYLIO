import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(79,195,247,0.08) 0%, rgba(255,213,79,0.06) 100%)',
        backgroundColor: 'white',
      }}
    >
      {/* Decorative circles */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <circle cx="10%" cy="20%" r="120" fill="var(--sky)" opacity="0.06" />
        <circle cx="90%" cy="80%" r="150" fill="var(--coral)" opacity="0.05" />
        <circle cx="80%" cy="15%" r="80" fill="var(--sun)" opacity="0.07" />
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm">
        {/* Lio confuz */}
        <svg width="120" height="120" viewBox="0 0 100 100" aria-hidden="true" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <ellipse cx="50" cy="60" rx="28" ry="22" fill="var(--sky)" />
          <circle cx="50" cy="38" r="22" fill="var(--sky)" />
          <ellipse cx="32" cy="20" rx="8" ry="10" fill="var(--sky)" />
          <ellipse cx="68" cy="20" rx="8" ry="10" fill="var(--sky)" />
          <ellipse cx="32" cy="20" rx="5" ry="7" fill="var(--coral)" opacity="0.7" />
          <ellipse cx="68" cy="20" rx="5" ry="7" fill="var(--coral)" opacity="0.7" />
          <circle cx="43" cy="36" r="6" fill="white" />
          <circle cx="57" cy="36" r="6" fill="white" />
          {/* Ochi confuzi — una sus una jos */}
          <circle cx="43" cy="35" r="3.5" fill="#212121" />
          <circle cx="57" cy="37" r="3.5" fill="#212121" />
          <circle cx="44" cy="33.5" r="1.2" fill="white" />
          <circle cx="58" cy="35.5" r="1.2" fill="white" />
          {/* Gură întrebătoare */}
          <path d="M 43 47 Q 50 44 57 47" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="37" cy="44" rx="5" ry="3" fill="var(--pink)" opacity="0.5" />
          <ellipse cx="63" cy="44" rx="5" ry="3" fill="var(--pink)" opacity="0.5" />
          {/* Semn de întrebare */}
          <text x="62" y="18" fontSize="20" fill="var(--sun-dark)">?</text>
        </svg>

        <div>
          <h1 className="font-fredoka text-5xl font-semibold text-[var(--coral)] mb-2">
            404
          </h1>
          <h2 className="font-fredoka text-2xl font-semibold text-[var(--dark)] mb-2">
            Lio s-a rătăcit!
          </h2>
          <p className="font-nunito text-base text-[var(--gray)]">
            Această pagină nu există. Hai să ne întoarcem acasă!
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/worlds"
            className="flex items-center justify-center gap-2 rounded-full py-3 px-6 font-nunito text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
            style={{
              touchAction: 'manipulation',
              background: 'linear-gradient(90deg, var(--sky), var(--sky-dark))',
            }}
          >
            🏠 Înapoi la lumi
          </Link>
          <Link
            href="/"
            className="font-nunito text-sm text-[var(--gray)] underline"
            style={{ touchAction: 'manipulation' }}
          >
            Pagina principală
          </Link>
        </div>
      </div>
    </div>
  )
}
