import Link from 'next/link'

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
      className="relative flex flex-col"
      style={{
        borderRadius: '24px',
        padding: 'clamp(24px, 4vw, 36px)',
        background: 'white',
        border: highlighted ? '2px solid #FF7043' : '2px solid #66BB6A',
        boxShadow: highlighted
          ? '0 8px 32px rgba(255,112,67,0.15)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        gap: 'clamp(16px, 3vw, 24px)',
      }}
    >
      {badge && (
        <span
          className="absolute left-1/2 font-nunito font-bold text-white"
          style={{
            top: '-14px',
            transform: 'translateX(-50%)',
            backgroundColor: '#FF7043',
            padding: '4px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(255,112,67,0.35)',
          }}
        >
          {badge}
        </span>
      )}

      {/* Header */}
      <div>
        <h3
          className="font-fredoka font-semibold"
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: highlighted ? '#FF7043' : '#388E3C',
            marginBottom: '4px',
          }}
        >
          {price}
        </h3>
        <p
          className="font-fredoka"
          style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#212121' }}
        >
          {name}
        </p>
        <p
          className="font-nunito"
          style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}
        >
          {priceNote}
        </p>
      </div>

      {/* Features */}
      <ul className="flex flex-col list-none" style={{ gap: '10px', flex: 1 }}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 font-nunito" style={{ fontSize: '14px', color: '#212121' }}>
            <span
              className="flex-shrink-0 font-bold"
              style={{ color: highlighted ? '#FF7043' : '#388E3C', marginTop: '1px' }}
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
        className="inline-flex items-center justify-center w-full rounded-full font-nunito font-bold transition-all duration-300 active:scale-95"
        style={
          highlighted
            ? {
                backgroundColor: '#FF7043',
                color: 'white',
                boxShadow: '0 4px 20px rgba(255,112,67,0.35)',
                padding: '14px 24px',
                fontSize: 'clamp(14px, 2vw, 16px)',
                minHeight: '52px',
              }
            : {
                border: '2px solid #388E3C',
                color: '#388E3C',
                padding: '14px 24px',
                fontSize: 'clamp(14px, 2vw, 16px)',
                minHeight: '52px',
              }
        }
      >
        {ctaLabel}
      </Link>
    </article>
  )
}
