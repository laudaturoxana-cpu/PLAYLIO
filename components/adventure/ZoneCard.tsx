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
          ? 'bg-white border-black/5 shadow-sm active:scale-95'
          : 'bg-white/50 border-black/5 opacity-60'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundColor: zone.color }}
      />

      {isNew && unlocked && (
        <div
          className="absolute -top-1 -right-1 z-10 rounded-full px-2 py-0.5 font-nunito text-xs font-bold text-white shadow-sm"
          style={{ background: '#FF7043', animation: 'pop 0.4s ease' }}
        >
          Nou! ✨
        </div>
      )}

      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{zone.flag}</span>
            <div>
              <p
                className="font-fredoka text-base font-semibold"
                style={{ color: unlocked ? zone.color : '#757575' }}
              >
                {zone.name}
              </p>
              <p className="font-nunito text-xs text-[#757575] leading-snug">
                {zone.description}
              </p>
            </div>
          </div>
          {!unlocked && <span className="text-xl flex-shrink-0 ml-2">🔒</span>}
          {complete && <span className="text-xl flex-shrink-0 ml-2">🏆</span>}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {Array.from({ length: zone.totalStars }).map((_, i) => (
              <span
                key={i}
                className="text-sm"
                style={{ opacity: i < savedStars ? 1 : 0.3, filter: i < savedStars ? 'none' : 'grayscale(1)' }}
              >
                ⭐
              </span>
            ))}
          </div>
          <span className="font-nunito text-xs text-[#757575]">{savedStars}/{zone.totalStars}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress * 100}%`,
              background: complete
                ? 'linear-gradient(90deg, #388E3C, #29B6F6)'
                : `linear-gradient(90deg, ${zone.color}, ${zone.color}99)`,
            }}
          />
        </div>

        {unlocked ? (
          <Link
            href={`/play/adventure/${zone.slug}`}
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 font-nunito text-sm font-semibold text-white active:scale-95 transition-transform shadow-sm"
            style={{
              touchAction: 'manipulation',
              background: complete
                ? 'linear-gradient(90deg, #388E3C, #29B6F6)'
                : `linear-gradient(90deg, ${zone.color}, ${zone.color}cc)`,
            }}
          >
            {complete ? '🔄 Joacă din nou' : savedStars > 0 ? '▶️ Continuă' : '🌍 Explorează'}
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 bg-[rgba(0,0,0,0.04)]">
            <span className="font-nunito text-sm text-[#757575]">🔒 Nivel insuficient</span>
          </div>
        )}
      </div>
    </div>
  )
}
