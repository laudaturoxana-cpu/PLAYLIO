'use client'

import Link from 'next/link'
import { ZONES } from '@/lib/adventure/zones'
import ZoneCard from './ZoneCard'

interface WorldMapProps {
  playerLevel: number
  profileName: string
  savedStarsMap: Record<string, number>  // zoneId → stars
}

export default function WorldMap({ playerLevel, profileName, savedStarsMap }: WorldMapProps) {
  const totalStarsAll = ZONES.reduce((s, z) => s + z.totalStars, 0)
  const collectedAll = ZONES.reduce((s, z) => s + (savedStarsMap[z.id] ?? 0), 0)

  return (
    <div className="min-h-screen px-4 py-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi la lumi"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold text-[var(--mint-dark)]">
            🗺️ Lumea Aventurii
          </h1>
          <p className="font-nunito text-xs text-[var(--gray)]">
            {collectedAll}/{totalStarsAll} stele colectate
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress total */}
      <div
        className="mb-5 h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
        role="progressbar"
        aria-valuenow={Math.round((collectedAll / totalStarsAll) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(collectedAll / totalStarsAll) * 100}%`,
            background: 'linear-gradient(90deg, var(--mint-dark), var(--sky))',
          }}
        />
      </div>

      {/* Mesaj Lio cu near-miss global */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0" style={{ animation: 'float 3s ease-in-out infinite' }}>
          🦁
        </span>
        <p className="font-nunito text-sm text-[var(--dark)]">
          {collectedAll === 0
            ? `${profileName}, aventura te așteaptă! Alege o zonă! 🗺️`
            : collectedAll === totalStarsAll
            ? `${profileName}, ai explorat TOT! Ești un erou legendar! 🏆`
            : `${profileName}, ai ${collectedAll} stele! Continuă aventura! ⭐`}
        </p>
      </div>

      {/* Lista zone */}
      <div className="flex flex-col gap-4">
        {ZONES.map((zone, idx) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            playerLevel={playerLevel}
            savedStars={savedStarsMap[zone.id] ?? 0}
            isNew={idx === 0 && (savedStarsMap[zone.id] ?? 0) === 0}
          />
        ))}
      </div>

      <div className="h-6" />
    </div>
  )
}
