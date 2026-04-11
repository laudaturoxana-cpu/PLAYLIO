'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/worlds',                emoji: '🏠', label: 'Home',      color: '#29B6F6' },
  { href: '/play/learning',         emoji: '📚', label: 'Litere',    color: '#EF5350' },
  { href: '/play/learning/numbers', emoji: '🔢', label: 'Cifre',     color: '#FF7043' },
  { href: '/play/adventure',        emoji: '🗺️', label: 'Adventure', color: '#66BB6A' },
  { href: '/play/builder',          emoji: '🏗️', label: 'Builder',   color: '#29B6F6' },
  { href: '/play/jump',             emoji: '🎮', label: 'Jump',      color: '#FFA726' },
]

export default function AppNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/worlds') return pathname === '/worlds'
    if (href === '/play/learning') {
      return pathname.startsWith('/play/learning') && !pathname.startsWith('/play/learning/numbers')
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="app-nav" aria-label="Main navigation">
      {/* Playlio logo — visible only in desktop sidebar */}
      <div className="app-nav-logo" aria-hidden="true">
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>🦁</span>
        <span
          className="font-fredoka font-semibold"
          style={{ fontSize: '1.35rem', color: '#29B6F6', lineHeight: 1 }}
        >
          Playlio
        </span>
      </div>

      {NAV_ITEMS.map(item => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className="app-nav-item active:scale-90"
            style={{
              backgroundColor: active ? `${item.color}1A` : 'transparent',
            }}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className="app-nav-emoji"
              style={{
                fontSize: active ? '1.6rem' : '1.4rem',
                transition: 'font-size 0.15s ease',
                filter: active ? 'none' : 'grayscale(0.25)',
              }}
            >
              {item.emoji}
            </span>
            <span
              className="app-nav-label"
              style={{ color: active ? item.color : 'var(--gray)' }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
