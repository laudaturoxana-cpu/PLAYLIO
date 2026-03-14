import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface PricingCardProps {
  name: string
  price: string
  priceNote: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  highlighted?: boolean
  badge?: string
}

export function PricingCard({
  name,
  price,
  priceNote,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <article
      className={cn(
        'relative flex flex-col gap-6 rounded-3xl p-7 md:p-8',
        'border transition-all duration-300',
        highlighted
          ? 'bg-white border-[var(--coral)] shadow-[var(--shadow-coral)] scale-[1.02]'
          : 'bg-white border-black/10 shadow-[var(--shadow-sm)]'
      )}
    >
      {badge && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full px-4 py-1 text-sm font-bold font-nunito text-white"
          style={{ backgroundColor: 'var(--coral)' }}
        >
          {badge}
        </span>
      )}

      {/* Header */}
      <div>
        <h3
          className="font-fredoka text-3xl font-semibold mb-1"
          style={{ color: highlighted ? 'var(--coral)' : 'var(--mint-dark)' }}
        >
          {price}
        </h3>
        <p className="font-fredoka text-xl text-[var(--dark)]">{name}</p>
        <p className="font-nunito text-sm text-[var(--gray)] mt-1">{priceNote}</p>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 list-none flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 font-nunito text-sm text-[var(--dark)]">
            <span
              className="mt-0.5 text-base font-bold flex-shrink-0"
              style={{ color: highlighted ? 'var(--coral)' : 'var(--mint-dark)' }}
              aria-hidden="true"
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={cn(
          'inline-flex items-center justify-center w-full rounded-full',
          'font-nunito font-bold text-base px-6 py-4 min-h-[52px]',
          'transition-all duration-300 hover:opacity-90 active:scale-95',
          highlighted
            ? 'text-white'
            : 'bg-transparent'
        )}
        style={
          highlighted
            ? { backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }
            : { border: '2px solid var(--mint-dark)', color: 'var(--mint-dark)' }
        }
      >
        {ctaLabel}
      </Link>
    </article>
  )
}
