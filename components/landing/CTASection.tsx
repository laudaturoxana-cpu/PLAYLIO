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
      className="px-4 py-20 md:py-28"
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

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
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

          {/* Big shimmer CTA */}
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-lg md:text-xl text-white px-10 py-5 min-h-[60px] transition-all duration-300 hover:opacity-90 active:scale-95 shimmer-bg"
            aria-label="Creează cont acum și primești 50 coins bonus"
          >
            Creează cont acum — primești 50 coins bonus 🪙
          </Link>
        </div>
      </div>
    </section>
  )
}
