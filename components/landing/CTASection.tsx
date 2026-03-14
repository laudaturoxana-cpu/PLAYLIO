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
      className="px-4 py-12 md:py-20"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Container cu fundal subtil */}
        <div
          className="rounded-[40px] px-6 py-16 md:px-16 md:py-20 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(79,195,247,0.06) 0%, rgba(255,213,79,0.08) 100%)',
            border: '1px solid rgba(79,195,247,0.15)',
          }}
        >
          {/* Heading */}
          <h2
            id="cta-heading"
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--dark)] mb-4"
          >
            Gata să pornești aventura?
          </h2>
          <p className="font-nunito text-lg md:text-xl text-[var(--gray)] mb-12 max-w-xl mx-auto">
            Alătură-te familiilor care au ales un ecran mai bun.
          </p>

          {/* FIX 1: Pricing cards — grid 2 col, max-width 900px, gap 24px */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 mb-10"
            style={{ gap: '24px', width: '100%' }}
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

          {/* Note */}
          <p className="font-nunito text-sm text-[var(--gray)] mb-10">
            Nu e nevoie de card bancar pentru versiunea gratuită.
          </p>

          {/* FIX 18: Buton CTA galben final */}
          <Link
            href="/register"
            className="cta-yellow-btn inline-flex items-center justify-center font-nunito font-bold transition-all duration-300 active:scale-95 hover:scale-[1.03]"
            aria-label="Creează cont acum și primești 50 coins bonus"
          >
            Creează cont acum — primești 50 coins bonus 🪙
          </Link>
        </div>
      </div>
    </section>
  )
}
