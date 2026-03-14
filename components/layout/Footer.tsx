import Link from 'next/link'

const PRODUCT_LINKS = [
  { href: '#lumi', label: 'Cele 4 Lumi' },
  { href: '#avatar', label: 'Creator Avatar' },
  { href: '/register?plan=plus', label: 'Playlio Plus' },
  { href: '#', label: 'Noutăți' },
  { href: '#', label: 'Roadmap' },
]

const COMPANY_LINKS = [
  { href: '#', label: 'Despre noi' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Cariere' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Parteneriate' },
]

const LEGAL_LINKS = [
  { href: '#', label: 'Politică confidențialitate' },
  { href: '#', label: 'Termeni și condiții' },
  { href: '#', label: 'GDPR' },
  { href: '#', label: 'Ghid părinți' },
  { href: '#', label: 'Cookie Policy' },
]

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-fredoka text-lg font-semibold text-[#FAFAFA]">{title}</h3>
      <ul className="flex flex-col gap-2.5 list-none">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-nunito text-sm text-[#9E9E9E] transition-colors duration-200 hover:text-[#FAFAFA]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer
      className="px-4 pt-16 pb-8"
      style={{ backgroundColor: 'var(--dark)' }}
      aria-label="Footer Playlio"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-fredoka text-3xl font-semibold"
              aria-label="Playlio — pagina principală"
            >
              <span style={{ color: 'var(--sky)' }}>PLAYLI</span>
              <span style={{ color: 'var(--coral)' }}>O</span>
            </Link>
            <p className="font-nunito text-sm text-[#9E9E9E] leading-relaxed max-w-[200px]">
              O lume sigură și colorată pentru copiii tăi.
            </p>
            <Link
              href="/"
              className="font-nunito text-sm font-semibold"
              style={{ color: 'var(--sky)' }}
            >
              playlio.fun
            </Link>

            {/* Social placeholders */}
            <div className="flex gap-3 mt-1" aria-label="Rețele sociale">
              {[
                { label: 'Instagram', icon: '📸' },
                { label: 'TikTok', icon: '🎵' },
                { label: 'YouTube', icon: '▶️' },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Playlio pe ${label}`}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-lg transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Produs" links={PRODUCT_LINKS} />
          <FooterColumn title="Companie" links={COMPANY_LINKS} />
          <FooterColumn title="Legal & Siguranță" links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-nunito text-sm text-[#9E9E9E]">
            © 2026 Playlio. Construit cu ❤️ pentru copiii lumii.
          </p>
          <p className="font-nunito text-sm text-[#9E9E9E]">
            🇷🇴 Făcut în România
          </p>
        </div>
      </div>
    </footer>
  )
}
