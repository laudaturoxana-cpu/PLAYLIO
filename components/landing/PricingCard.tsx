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
        'relative flex flex-col gap-6',
        'transition-all duration-300'
      )}
      style={{
        borderRadius: '24px',
        padding: '32px',
        background: 'white',
        border: highlighted ? '2px solid #FF7043' : '2px solid #66BB6A',
        boxShadow: highlighted
          ? '0 8px 32px rgba(255,112,67,0.15)'
          : 'var(--shadow-sm)',
      }}
    >
      {/* FIX 12: Badge "Recomandat" poziționat corect */}
      {badge && (
        <span
          className="absolute left-1/2 -translate-x-1/2 inline-flex items-center rounded-full font-bold font-nunito text-white whitespace-nowrap"
          style={{
            top: '-14px',
            backgroundColor: '#FF7043',
            padding: '4px 16px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(255,112,67,0.35)',
          }}
        >
          {badge}
        </span>
      )}

      {/* Header */}
      <div>
        <h3
          className="font-fredoka text-3xl font-semibold mb-1"
          style={{ color: highlighted ? '#FF7043' : '#388E3C' }}
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
              style={{ color: highlighted ? '#FF7043' : '#388E3C' }}
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
          highlighted ? 'text-white' : 'bg-transparent'
        )}
        style={
          highlighted
            ? { backgroundColor: '#FF7043', boxShadow: 'var(--shadow-coral)' }
            : { border: '2px solid #388E3C', color: '#388E3C' }
        }
      >
        {ctaLabel}
      </Link>
    </article>
  )
}
