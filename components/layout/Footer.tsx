import Link from 'next/link'

const PRODUCT_LINKS = [
  { href: '#lumi', label: 'Cele 4 Lumi' },
  { href: '#avatar', label: 'Creator Avatar' },
  { href: '/register?plan=plus', label: 'Playlio Plus' },
  { href: '#', label: 'Noutăți' },
]

const COMPANY_LINKS = [
  { href: '#', label: 'Despre noi' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Cariere' },
]

const LEGAL_LINKS = [
  { href: '#', label: 'Politica de confidențialitate' },
  { href: '/terms', label: 'Termeni și condiții' },
  { href: '#', label: 'GDPR' },
  { href: '#', label: 'Ghidul părinților' },
]

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col" style={{ gap: '16px' }}>
      <h3 className="font-fredoka font-semibold" style={{ fontSize: '17px', color: '#FAFAFA' }}>
        {title}
      </h3>
      <ul className="flex flex-col list-none">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="footer-link font-nunito block transition-colors duration-200"
              style={{ fontSize: '14px', fontWeight: 500, color: '#BDBDBD', marginBottom: '10px', textDecoration: 'none' }}
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
      className="px-4"
      style={{ backgroundColor: '#212121', paddingTop: 'clamp(48px, 8vw, 64px)', paddingBottom: 'clamp(24px, 4vw, 32px)' }}
      aria-label="Playlio footer"
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 'clamp(24px, 4vw, 40px)', marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col" style={{ gap: '16px' }}>
            <Link
              href="/"
              className="font-fredoka font-semibold"
              style={{ fontSize: '28px' }}
              aria-label="Playlio — home page"
            >
              <span style={{ color: '#4FC3F7' }}>PLAYLI</span>
              <span
                className="inline-block"
                style={{
                  color: 'white',
                  backgroundColor: '#FF7043',
                  borderRadius: '50%',
                  padding: '0 5px',
                  lineHeight: 1.2,
                }}
              >
                O
              </span>
            </Link>
            <p className="font-nunito" style={{ fontSize: '13px', color: '#9E9E9E', lineHeight: 1.6, maxWidth: '200px' }}>
              O lume sigură și colorată pentru copiii tăi.
            </p>
            <Link href="/" className="font-nunito font-semibold" style={{ fontSize: '13px', color: '#4FC3F7' }}>
              playlio.fun
            </Link>

            <div className="flex" style={{ gap: '10px' }} aria-label="Social media">
              {[
                { label: 'Instagram', icon: '📸' },
                { label: 'TikTok', icon: '🎵' },
                { label: 'YouTube', icon: '▶️' },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Playlio on ${label}`}
                  className="flex items-center justify-center rounded-xl text-lg transition-opacity duration-200"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  }}
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
          className="flex flex-col sm:flex-row items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', gap: '12px' }}
        >
          <p className="font-nunito" style={{ fontSize: '13px', color: '#9E9E9E' }}>
            © 2026 Playlio. Creat cu ❤️ pentru copiii din toată lumea.
          </p>
          <p className="font-nunito" style={{ fontSize: '13px', color: '#9E9E9E' }}>
            🇷🇴 Made in Romania
          </p>
        </div>
      </div>
    </footer>
  )
}
