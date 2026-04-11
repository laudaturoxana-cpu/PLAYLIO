'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AppNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const NAV_ITEMS = [
    { href: '/worlds',                label: t('nav_home'),      emoji: '🏠', color: '#29B6F6' },
    { href: '/play/learning',         label: t('nav_letters'),   emoji: '📚', color: '#EF5350' },
    { href: '/play/learning/numbers', label: t('nav_numbers'),   emoji: '🔢', color: '#FF7043' },
    { href: '/play/adventure',        label: t('nav_adventure'), emoji: '🗺️', color: '#66BB6A' },
    { href: '/play/builder',          label: t('nav_builder'),   emoji: '🏗️', color: '#29B6F6' },
    { href: '/play/jump',             label: t('nav_jump'),      emoji: '🎮', color: '#FFA726' },
  ]

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
            style={{ backgroundColor: active ? `${item.color}1A` : 'transparent' }}
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
