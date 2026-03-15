'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/worlds',         emoji: '🏠', label: 'Home',      color: '#29B6F6' },
  { href: '/play/learning',  emoji: '📚', label: 'Letters',   color: '#EF5350' },
  { href: '/play/adventure', emoji: '🗺️', label: 'Adventure', color: '#66BB6A' },
  { href: '/play/builder',   emoji: '🏗️', label: 'Builder',   color: '#29B6F6' },
  { href: '/play/jump',      emoji: '🎮', label: 'Jump',      color: '#FFA726' },
]

export default function AppNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/worlds') return pathname === '/worlds'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-black/5 px-2"
      style={{
        backgroundColor: 'white',
        height: '64px',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(item => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all active:scale-90"
            style={{
              touchAction: 'manipulation',
              minWidth: '56px',
              minHeight: '52px',
              backgroundColor: active ? `${item.color}18` : 'transparent',
              padding: '6px 8px',
            }}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            <span
              style={{
                fontSize: active ? '1.6rem' : '1.4rem',
                transition: 'font-size 0.15s ease',
                filter: active ? 'none' : 'grayscale(0.3)',
              }}
            >
              {item.emoji}
            </span>
            <span
              className="font-nunito font-semibold"
              style={{
                fontSize: '9px',
                color: active ? item.color : 'var(--gray)',
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
