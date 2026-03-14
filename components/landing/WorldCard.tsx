import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface WorldCardProps {
  icon: string
  title: string
  badge: string
  badgeColor: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  gradient: string
  accentColor: string
}

export function WorldCard({
  icon,
  title,
  badge,
  badgeColor,
  description,
  features,
  ctaLabel,
  ctaHref,
  gradient,
  accentColor,
}: WorldCardProps) {
  return (
    <article
      className={cn(
        'group relative rounded-3xl p-6 md:p-8',
        'border border-white/80',
        'shadow-[var(--shadow-sm)]',
        'transition-all duration-[250ms] ease-out',
        'hover:-translate-y-2 hover:shadow-[var(--shadow-md)]',
        gradient
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Icon + Badge */}
        <div className="flex items-start justify-between">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl text-3xl"
            style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 15%, white)` }}
            aria-hidden="true"
          >
            {icon}
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold font-nunito"
            style={{
              backgroundColor: `color-mix(in srgb, ${accentColor} 15%, white)`,
              color: accentColor,
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

        {/* Features */}
        <ul className="flex flex-col gap-1.5 list-none">
          {features.map((feature) => (
            <li
              key={feature}
              className="font-nunito text-sm font-medium"
              style={{ color: accentColor }}
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
