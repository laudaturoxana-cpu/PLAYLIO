'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '#lumi', label: 'Lumi' },
  { href: '#avatar', label: 'Avatar' },
  { href: '#parinti', label: 'Părinți' },
  { href: '#despre', label: 'Despre' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.08)]'
            : 'bg-transparent'
        )}
      >
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8"
          aria-label="Navigare principală"
        >
          {/* FIX 5: Logo cu O rotitor */}
          <Link
            href="/"
            className="font-fredoka font-semibold tracking-wide"
            style={{ fontSize: '28px' }}
            aria-label="Playlio — pagina principală"
          >
            <span style={{ color: 'var(--sky)' }}>PLAYLI</span>
            <span
              className="inline-block transition-transform duration-300 hover:rotate-[20deg]"
              style={{
                color: 'white',
                backgroundColor: 'var(--coral)',
                borderRadius: '50%',
                padding: '0 5px',
                lineHeight: 1.2,
              }}
            >
              O
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-nunito text-base font-semibold text-[var(--dark)] transition-colors duration-200 hover:text-[var(--coral)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="/register"
            className="hidden md:inline-flex items-center justify-center rounded-full font-nunito font-semibold text-base text-white px-6 py-3 min-h-[44px] transition-all duration-[300ms] hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'var(--coral)',
              boxShadow: 'var(--shadow-coral)',
            }}
          >
            Începe Gratuit
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center h-11 w-11 rounded-xl text-[var(--dark)] transition-colors hover:bg-black/5"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Deschide meniu"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Meniu navigare"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden',
          'flex flex-col p-6 gap-6',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-fredoka font-semibold"
            style={{ fontSize: '24px' }}
            onClick={() => setMobileOpen(false)}
          >
            <span style={{ color: 'var(--sky)' }}>PLAYLI</span>
            <span
              className="inline-block"
              style={{
                color: 'white',
                backgroundColor: 'var(--coral)',
                borderRadius: '50%',
                padding: '0 4px',
                lineHeight: 1.2,
              }}
            >
              O
            </span>
          </Link>
          <button
            className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-[var(--light)] transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Închide meniu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block font-nunito text-lg font-semibold text-[var(--dark)] py-3 px-3 rounded-xl hover:bg-[var(--light)] hover:text-[var(--coral)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/register"
          className="mt-auto inline-flex items-center justify-center w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
          onClick={() => setMobileOpen(false)}
        >
          Începe Gratuit
        </Link>
      </div>
    </>
  )
}
