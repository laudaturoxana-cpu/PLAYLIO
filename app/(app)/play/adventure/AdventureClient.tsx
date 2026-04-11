'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CONTINENTS, COUNTRY_MAP, type Continent, type Country } from '@/lib/adventure/zones'

// Globe3D uses WebGL — must be client-only, no SSR
const Globe3D = dynamic(() => import('@/components/adventure/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ aspectRatio: '1/1', maxWidth: 420, margin: '0 auto' }}>
      <span className="text-5xl" style={{ animation: 'bounce-soft 1s infinite' }}>🌍</span>
    </div>
  ),
})

interface AdventureClientProps {
  userId: string
  profileName: string
  playerLevel: number
  playerAge: number
  completedQuestIds: string[]
}

function loadVisitedCountries(): string[] {
  try {
    return JSON.parse(localStorage.getItem('adventure_visited') ?? '[]') as string[]
  } catch { return [] }
}

export default function AdventureClient({
  userId,
  profileName,
  playerLevel,
  playerAge,
  completedQuestIds,
}: AdventureClientProps) {
  const router = useRouter()
  const [visitedCountryIds, setVisitedCountryIds] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null)

  useEffect(() => {
    setVisitedCountryIds(loadVisitedCountries())
    setLoaded(true)
  }, [])

  const handleSelectContinent = useCallback((continent: Continent) => {
    if (continent.requiredLevel <= playerLevel) {
      setSelectedContinent(continent)
    }
  }, [playerLevel])

  const handleSelectCountry = useCallback((country: Country) => {
    router.push(`/play/adventure/${country.id}`)
  }, [router])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-5xl" style={{ animation: 'bounce-soft 1s infinite' }}>🌍</span>
      </div>
    )
  }

  const totalCountries = CONTINENTS.reduce((s, c) => s + c.countries.length, 0)
  const visitedCount = visitedCountryIds.length

  // ── Continent detail view ────────────────────────────────────────
  if (selectedContinent) {
    const visitedInContinent = selectedContinent.countries.filter(c =>
      visitedCountryIds.includes(c.id)
    ).length

    return (
      <div className="game-container min-h-screen px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSelectedContinent(null)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[#757575] active:scale-95 transition-transform text-lg"
            style={{ touchAction: 'manipulation' }}
            aria-label="Înapoi la glob"
          >
            ←
          </button>
          <div className="text-center">
            <h2 className="font-fredoka text-xl font-semibold" style={{ color: selectedContinent.color }}>
              {selectedContinent.emoji} {selectedContinent.name}
            </h2>
            <p className="font-nunito text-xs text-[#757575]">
              {visitedInContinent}/{selectedContinent.countries.length} țări explorate
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(visitedInContinent / selectedContinent.countries.length) * 100}%`,
              background: `linear-gradient(90deg, ${selectedContinent.color}, ${selectedContinent.color}aa)`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {selectedContinent.countries.map(country => {
            const visited = visitedCountryIds.includes(country.id)
            return (
              <Link
                key={country.id}
                href={`/play/adventure/${country.id}`}
                className="flex items-center gap-3 rounded-3xl p-4 transition-all active:scale-95 border"
                style={{
                  touchAction: 'manipulation',
                  backgroundColor: visited ? `${selectedContinent.color}12` : 'white',
                  borderColor: visited ? `${selectedContinent.color}40` : 'rgba(0,0,0,0.07)',
                }}
              >
                <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-fredoka text-base font-semibold truncate"
                       style={{ color: visited ? selectedContinent.color : '#212121' }}>
                      {country.name}
                    </p>
                    {visited && <span className="text-sm flex-shrink-0">✅</span>}
                  </div>
                  <p className="font-nunito text-xs text-[#757575]">
                    {country.capitalEmoji} {country.capital} · {country.animalEmoji}
                  </p>
                  <p className="font-nunito text-[10px] text-[#9E9E9E] truncate">
                    {country.landmarkEmoji} {country.landmark}
                  </p>
                </div>
                {country.builderBlockUnlock && visited
                  ? <span className="text-xl flex-shrink-0">🧱</span>
                  : !visited && <span className="text-[#BDBDBD] text-lg flex-shrink-0">→</span>
                }
              </Link>
            )
          })}
        </div>
        <div className="h-6" />
      </div>
    )
  }

  // ── Main globe view ──────────────────────────────────────────────
  return (
    <div className="game-container min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[#757575] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi la lumi"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold text-[#388E3C]">
            🌍 Adventure World
          </h1>
          <p className="font-nunito text-xs text-[#757575]">
            {visitedCount}/{totalCountries} țări explorate
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(visitedCount / totalCountries) * 100}%`,
            background: 'linear-gradient(90deg, #388E3C, #29B6F6)',
          }}
        />
      </div>

      {/* Lio mesaj */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0" style={{ animation: 'float 3s ease-in-out infinite' }}>🦁</span>
        <p className="font-nunito text-sm text-[#212121]">
          {visitedCount === 0
            ? `${profileName}, rotește globul și atinge un continent! 🌍`
            : `${profileName}, ai explorat ${visitedCount} țări! Continuă aventura! ✈️`}
        </p>
      </div>

      {/* 3D Globe */}
      <Globe3D
        visitedCountryIds={visitedCountryIds}
        playerLevel={playerLevel}
        onSelectContinent={handleSelectContinent}
        onSelectCountry={handleSelectCountry}
      />

      {/* Hint */}
      <p className="font-nunito text-xs text-center mt-3" style={{ color: '#BDBDBD' }}>
        Rotește globul cu degetul · Atinge un continent pentru a-l explora
      </p>

      {/* Continente list — fallback / quick access */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {CONTINENTS.map(continent => {
          const unlocked = playerLevel >= continent.requiredLevel
          const visited = continent.countries.filter(c => visitedCountryIds.includes(c.id)).length
          return (
            <button
              key={continent.id}
              onClick={() => unlocked && setSelectedContinent(continent)}
              disabled={!unlocked}
              className="flex flex-col items-center gap-1 rounded-2xl p-3 transition-all active:scale-95"
              style={{
                touchAction: 'manipulation',
                backgroundColor: unlocked ? `${continent.color}15` : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${unlocked ? `${continent.color}40` : 'rgba(0,0,0,0.07)'}`,
                opacity: unlocked ? 1 : 0.55,
              }}
              aria-label={continent.name}
            >
              <span style={{ fontSize: '1.4rem' }}>{continent.emoji}</span>
              <span className="font-fredoka text-xs font-semibold" style={{ color: unlocked ? continent.color : '#9E9E9E' }}>
                {continent.name.split(' ')[0]}
              </span>
              <span className="font-nunito text-[9px]" style={{ color: '#9E9E9E' }}>
                {unlocked ? `${visited}/${continent.countries.length}` : '🔒'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="h-6" />
    </div>
  )
}
