'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '#lumi', label: 'Lumi' },
  { href: '#lio', label: 'Lio AI' },
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
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          scrolled
            ? { background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }
            : { background: 'transparent' }
        }
      >
        <nav
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: '1152px', margin: '0 auto', padding: '12px 16px', width: '100%' }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-fredoka font-semibold"
            style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', letterSpacing: '0.02em' }}
            aria-label="Playlio — home page"
          >
            <span style={{ color: '#4FC3F7' }}>PLAYLI</span>
            <span
              className="inline-block transition-transform duration-300"
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

          {/* Desktop links */}
          <ul className="hidden md:flex items-center list-none" style={{ gap: '32px' }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-nunito font-semibold transition-colors duration-200"
                  style={{ fontSize: '15px', color: '#212121' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FF7043' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#212121' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="/register"
            className="hidden md:inline-flex items-center justify-center rounded-full font-nunito font-semibold text-white transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: '#FF7043',
              boxShadow: '0 4px 20px rgba(255,112,67,0.35)',
              padding: '10px 24px',
              fontSize: '15px',
              minHeight: '44px',
            }}
          >
            Începe Gratuit
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center rounded-xl transition-colors duration-200"
            style={{ width: '44px', height: '44px', color: '#212121' }}
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 right-0 z-50 md:hidden flex flex-col"
        style={{
          width: '280px',
          height: '100%',
          background: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          padding: '20px',
          gap: '20px',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease-out',
        }}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-fredoka font-semibold"
            style={{ fontSize: '24px' }}
            onClick={() => setMobileOpen(false)}
          >
            <span style={{ color: '#4FC3F7' }}>PLAYLI</span>
            <span
              className="inline-block"
              style={{
                color: 'white',
                backgroundColor: '#FF7043',
                borderRadius: '50%',
                padding: '0 4px',
                lineHeight: 1.2,
              }}
            >
              O
            </span>
          </Link>
          <button
            className="flex items-center justify-center rounded-xl transition-colors duration-200"
            style={{ width: '40px', height: '40px', color: '#212121' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-col list-none" style={{ gap: '4px' }}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block font-nunito font-semibold rounded-xl transition-colors duration-200"
                style={{ fontSize: '17px', color: '#212121', padding: '12px 12px' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 'auto' }}>
          <Link
            href="/register"
            className="inline-flex items-center justify-center w-full rounded-full font-nunito font-bold text-white transition-all active:scale-95"
            style={{
              backgroundColor: '#FF7043',
              boxShadow: '0 4px 20px rgba(255,112,67,0.35)',
              padding: '16px 24px',
              fontSize: '17px',
              minHeight: '56px',
            }}
            onClick={() => setMobileOpen(false)}
          >
            Începe Gratuit
          </Link>
        </div>
      </div>
    </>
  )
}
