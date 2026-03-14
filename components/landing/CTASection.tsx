import Link from 'next/link'
import { PricingCard } from './PricingCard'

const FREE_FEATURES = [
  'Avatar creator complet',
  'Adventure World — Zona 1',
  '2 mini-jocuri Learning',
  '1 nivel Jump World',
]

const PLUS_FEATURES = [
  'Tot din Gratuit',
  'Toate lumile deblocate',
  'Conținut premium exclusiv',
  'Dashboard părinți complet',
  'Rapoarte săptămânale',
  'Teme sezoniere',
]

export function CTASection() {
  return (
    <section
      id="despre"
      className="px-4"
      style={{ paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto" style={{ maxWidth: '960px' }}>
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
            Gata să pornești aventura?
          </h2>
          <p
            className="font-nunito mx-auto"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '480px', marginBottom: 'clamp(32px, 5vw, 48px)', lineHeight: 1.6 }}
          >
            Alătură-te familiilor care au ales un ecran mai bun.
          </p>

          {/* Pricing cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{ gap: 'clamp(16px, 3vw, 24px)', marginBottom: 'clamp(20px, 3vw, 32px)' }}
          >
            <PricingCard
              name="Gratuit"
              price="0€"
              priceNote="Mereu gratuit"
              features={FREE_FEATURES}
              ctaLabel="Începe Gratuit"
              ctaHref="/register"
            />
            <PricingCard
              name="Playlio Plus"
              price="5€/lună"
              priceNote="Anulezi oricând"
              features={PLUS_FEATURES}
              ctaLabel="Încearcă 7 zile gratuit"
              ctaHref="/register?plan=plus"
              highlighted
              badge="Recomandat"
            />
          </div>

          <p
            className="font-nunito"
            style={{ fontSize: '13px', color: '#9E9E9E', marginBottom: 'clamp(24px, 4vw, 40px)' }}
          >
            Nu e nevoie de card bancar pentru versiunea gratuită.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center justify-center font-nunito font-bold transition-all duration-300 active:scale-95"
            aria-label="Creează cont acum și primești 50 coins bonus"
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
            Creează cont acum — primești 50 coins bonus 🪙
          </Link>
        </div>
      </div>
    </section>
  )
}
