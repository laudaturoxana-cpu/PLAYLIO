import Link from 'next/link'
import { PricingCard } from './PricingCard'

const FREE_FEATURES = [
  'Full avatar creator',
  'Adventure World — Zone 1',
  '2 Learning mini-games',
  '1 Jump World level',
]

const PLUS_FEATURES = [
  'Everything in Free',
  'All worlds unlocked',
  'Exclusive premium content',
  'Full parent dashboard',
  'Weekly reports',
  'Seasonal themes',
]

export function CTASection() {
  return (
    <section
      id="despre"
      className="px-4"
      style={{ paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
      aria-labelledby="cta-heading"
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        <div
          className="text-center"
          style={{
            borderRadius: 'clamp(24px, 4vw, 40px)',
            padding: 'clamp(32px, 6vw, 80px) clamp(20px, 4vw, 64px)',
            background: 'linear-gradient(135deg, rgba(79,195,247,0.06) 0%, rgba(255,213,79,0.08) 100%)',
            border: '1px solid rgba(79,195,247,0.15)',
          }}
        >
          <h2
            id="cta-heading"
            className="font-fredoka font-semibold"
            style={{ fontSize: 'clamp(28px, 6vw, 56px)', color: '#212121', marginBottom: '12px' }}
          >
            Ready to start the adventure?
          </h2>
          <p
            className="font-nunito"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '480px', margin: `0 auto clamp(32px, 5vw, 48px)`, lineHeight: 1.6 }}
          >
            Join the families who chose a better screen.
          </p>

          {/* Pricing cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{ gap: 'clamp(16px, 3vw, 24px)', marginBottom: 'clamp(20px, 3vw, 32px)' }}
          >
            <PricingCard
              name="Free"
              price="0€"
              priceNote="Always free"
              features={FREE_FEATURES}
              ctaLabel="Start Free"
              ctaHref="/register"
            />
            <PricingCard
              name="Playlio Plus"
              price="5€/mo"
              priceNote="Cancel anytime"
              features={PLUS_FEATURES}
              ctaLabel="Try 7 days free"
              ctaHref="/register?plan=plus"
              highlighted
              badge="Recommended"
            />
          </div>

          <p
            className="font-nunito"
            style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: 'clamp(24px, 4vw, 40px)' }}
          >
            No credit card needed for the free version.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center justify-center font-nunito font-bold transition-all duration-300 active:scale-95"
            aria-label="Create account now and get 50 bonus coins"
            style={{
              backgroundColor: '#FFD54F',
              color: '#212121',
              borderRadius: '9999px',
              padding: 'clamp(14px, 2.5vw, 18px) clamp(24px, 5vw, 48px)',
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              fontWeight: 700,
              boxShadow: '0 6px 24px rgba(255,213,79,0.40)',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            Create account now — get 50 bonus coins 🪙
          </Link>
        </div>
      </div>
    </section>
  )
}
