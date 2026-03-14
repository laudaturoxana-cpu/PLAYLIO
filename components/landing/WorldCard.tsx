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
      className="group relative rounded-[24px] p-7 md:p-8 transition-all duration-[250ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
      style={{
        border: '1.5px solid rgba(0,0,0,0.07)',
        background: gradientStyle,
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Icon + Badge — FIX 8: badge cu uppercase + letter-spacing */}
        <div className="flex items-start justify-between">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl text-3xl"
            style={{ backgroundColor: badgeBg }}
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
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-fredoka text-2xl font-semibold text-[var(--dark)]">
          {title}
        </h3>

        {/* Description */}
        <p className="font-nunito text-base text-[var(--gray)] leading-relaxed">
          {description}
        </p>

        {/* FIX 14: Features cu culori bullet specifice per lume */}
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
          className="inline-flex items-center gap-1 font-nunito text-base font-bold mt-2 transition-all duration-200 hover:gap-2"
          style={{ color: accentColor }}
          aria-label={`${ctaLabel} — ${title}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  )
}
