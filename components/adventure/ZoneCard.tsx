'use client'

import Link from 'next/link'
import type { Zone } from '@/lib/adventure/zones'
import { isZoneUnlocked } from '@/lib/adventure/zones'

interface ZoneCardProps {
  zone: Zone
  playerLevel: number
  savedStars: number
  isNew?: boolean
}

export default function ZoneCard({ zone, playerLevel, savedStars, isNew = false }: ZoneCardProps) {
  const unlocked = isZoneUnlocked(zone, playerLevel)
  const progress = zone.totalStars > 0 ? savedStars / zone.totalStars : 0
  const complete = savedStars >= zone.totalStars

  return (
    <div
      className={`relative rounded-3xl border overflow-hidden transition-all ${
        unlocked
          ? 'bg-white border-black/5 shadow-sm hover:-translate-y-1 active:scale-95'
          : 'bg-white/50 border-black/5 opacity-60'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Decorative background gradient */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: zone.bgGradient }}
      />

      {/* "New!" badge */}
      {isNew && unlocked && (
        <div
          className="absolute -top-1 -right-1 z-10 rounded-full px-2 py-0.5 font-nunito text-xs font-bold text-white shadow-sm"
          style={{ background: 'var(--coral)', animation: 'pop 0.4s ease' }}
        >
          New! ✨
        </div>
      )}

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{zone.emoji}</span>
            <div>
              <p
                className="font-fredoka text-base font-semibold"
                style={{ color: unlocked ? zone.color : 'var(--gray)' }}
              >
                {zone.name}
              </p>
              <p className="font-nunito text-xs text-[var(--gray)] leading-snug">
                {zone.description}
              </p>
            </div>
          </div>
          {!unlocked && (
            <span className="text-xl flex-shrink-0 ml-2" aria-label="Locked">🔒</span>
          )}
          {complete && (
            <span className="text-xl flex-shrink-0 ml-2" aria-label="Completed">🏆</span>
          )}
        </div>

        {/* Stars progress */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {Array.from({ length: zone.totalStars }).map((_, i) => (
              <span
                key={i}
                className="text-sm"
                aria-hidden="true"
                style={{
                  opacity: i < savedStars ? 1 : 0.3,
                  filter: i < savedStars ? 'none' : 'grayscale(1)',
                }}
              >
                ⭐
              </span>
            ))}
          </div>
          <span className="font-nunito text-xs text-[var(--gray)]">
            {savedStars}/{zone.totalStars}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 rounded-full mb-3 overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress * 100}%`,
              background: complete
                ? 'linear-gradient(90deg, var(--mint-dark), var(--sky))'
                : `linear-gradient(90deg, ${zone.color}, ${zone.color}99)`,
            }}
          />
        </div>

        {/* Near-miss message */}
        {unlocked && savedStars > 0 && !complete && (
          <p
            className="font-nunito text-xs mb-2 font-semibold"
            style={{ color: zone.color }}
          >
            {zone.totalStars - savedStars === 1
              ? '⚡ So close! Just ONE star left!'
              : `💪 ${zone.totalStars - savedStars} stars left!`}
          </p>
        )}

        {/* CTA */}
        {unlocked ? (
          <Link
            href={`/play/adventure/${zone.slug}`}
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 font-nunito text-sm font-semibold text-white active:scale-95 transition-transform shadow-sm"
            style={{
              touchAction: 'manipulation',
              background: complete
                ? 'linear-gradient(90deg, var(--mint-dark), var(--sky))'
                : `linear-gradient(90deg, ${zone.color}, ${zone.color}cc)`,
            }}
          >
            {complete ? '🔄 Play again' : savedStars > 0 ? '▶️ Continue' : '🗺️ Explore'}
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 bg-[var(--gray-light,#f0f0f0)]">
            <span className="font-nunito text-sm text-[var(--gray)]">
              🔒 Level {zone.requiredLevel} required
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
