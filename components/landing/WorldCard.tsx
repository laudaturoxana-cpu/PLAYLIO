import Link from 'next/link'

interface WorldCardProps {
  icon: string
  title: string
  badge: string
  badgeBg: string
  badgeTextColor: string
  description: string
  features: string[]
  bulletColor: string
  ctaLabel: string
  ctaHref: string
  gradientStyle: string
  accentColor: string
}

export function WorldCard({
  icon,
  title,
  badge,
  badgeBg,
  badgeTextColor,
  description,
  features,
  bulletColor,
  ctaLabel,
  ctaHref,
  gradientStyle,
  accentColor,
}: WorldCardProps) {
  return (
    <article
      className="relative rounded-[24px] transition-all duration-250"
      style={{
        border: '1.5px solid rgba(0,0,0,0.07)',
        background: gradientStyle,
        padding: 'clamp(20px, 4vw, 32px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Icon + Badge */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 'clamp(52px, 8vw, 64px)',
              height: 'clamp(52px, 8vw, 64px)',
              minWidth: '52px',
              backgroundColor: badgeBg,
              fontSize: 'clamp(22px, 4vw, 30px)',
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
          <span
            className="inline-flex items-center rounded-full font-nunito"
            style={{
              backgroundColor: badgeBg,
              color: badgeTextColor,
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-fredoka font-semibold"
          style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: '#212121' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="font-nunito leading-relaxed"
          style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: '#757575' }}
        >
          {description}
        </p>

        {/* Features */}
        <ul className="flex flex-col gap-1.5 list-none">
          {features.map((feature) => (
            <li
              key={feature}
              className="font-nunito text-sm font-medium"
              style={{ color: bulletColor }}
            >
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1 font-nunito font-bold mt-2"
          style={{ fontSize: '15px', color: accentColor }}
          aria-label={`${ctaLabel} — ${title}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  )
}
