'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CONTINENTS, COUNTRY_MAP, type Continent, type Country } from '@/lib/adventure/zones'

interface WorldMapProps {
  playerLevel: number
  profileName: string
  playerAge: number
  visitedCountryIds: string[]  // countries visitade (au primit stele)
}

export default function WorldMap({
  playerLevel,
  profileName,
  playerAge,
  visitedCountryIds,
}: WorldMapProps) {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null)

  const totalCountries = CONTINENTS.reduce((s, c) => s + c.countries.length, 0)
  const visitedCount = visitedCountryIds.length

  if (selectedContinent) {
    return (
      <ContinentView
        continent={selectedContinent}
        playerLevel={playerLevel}
        playerAge={playerAge}
        visitedCountryIds={visitedCountryIds}
        onBack={() => setSelectedContinent(null)}
      />
    )
  }

  return (
    <div className="game-container min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
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

      {/* Progress bar global */}
      <div
        className="mb-5 h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
        role="progressbar"
        aria-valuenow={Math.round((visitedCount / totalCountries) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(visitedCount / totalCountries) * 100}%`,
            background: 'linear-gradient(90deg, #388E3C, #29B6F6)',
          }}
        />
      </div>

      {/* Lio mesaj */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0" style={{ animation: 'float 3s ease-in-out infinite' }}>
          🦁
        </span>
        <p className="font-nunito text-sm text-[#212121]">
          {visitedCount === 0
            ? `${profileName}, alege un continent și hai să explorăm! 🌍`
            : visitedCount === totalCountries
            ? `${profileName}, ai explorat TOATĂ lumea! Ești un explorator legendar! 🏆`
            : `${profileName}, ai explorat ${visitedCount} țări! Continuă aventura! ✈️`}
        </p>
      </div>

      {/* Harta stilizată 2D — continente ca butoane */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg mb-4"
        style={{
          background: 'linear-gradient(to bottom, #B3E5FC 0%, #81D4FA 60%, #4FC3F7 100%)',
          aspectRatio: '4/3',
          minHeight: '260px',
        }}
      >
        {/* Grid-like waves la fundul "oceanului" */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '18%',
            background: 'linear-gradient(to bottom, transparent, rgba(2,119,189,0.4))',
          }}
        />

        {CONTINENTS.map(continent => {
          const unlocked = playerLevel >= continent.requiredLevel
          const visited = continent.countries.filter(c =>
            visitedCountryIds.includes(c.id)
          ).length
          const total = continent.countries.length

          return (
            <button
              key={continent.id}
              onClick={() => unlocked && setSelectedContinent(continent)}
              disabled={!unlocked}
              className="absolute flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
              style={{
                left: `${continent.mapPosition.x}%`,
                top: `${continent.mapPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                touchAction: 'manipulation',
                opacity: unlocked ? 1 : 0.5,
                zIndex: 10,
              }}
              aria-label={`${continent.name}${!unlocked ? ' — blocat' : ''}`}
            >
              {/* Buton continent */}
              <div
                className="flex items-center justify-center rounded-2xl shadow-md"
                style={{
                  width: '52px',
                  height: '52px',
                  background: unlocked ? continent.color : '#B0BEC5',
                  border: '3px solid rgba(255,255,255,0.8)',
                  fontSize: '1.6rem',
                  position: 'relative',
                }}
              >
                {continent.emoji}
                {/* Badge progres */}
                {unlocked && visited > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#FFD600',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: '#212121',
                    }}
                  >
                    {visited}
                  </div>
                )}
                {!unlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      fontSize: '12px',
                    }}
                  >
                    🔒
                  </div>
                )}
              </div>
              {/* Etichetă */}
              <span
                className="font-nunito text-[9px] font-bold text-center leading-tight px-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  color: '#212121',
                  maxWidth: '70px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {continent.name}
              </span>
            </button>
          )
        })}

        {/* Titlu hartă */}
        <div
          className="absolute top-3 left-0 right-0 text-center pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <span
            className="font-fredoka text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: '#0277BD' }}
          >
            🧭 Harta Lumii
          </span>
        </div>
      </div>

      {/* Legendă continente */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {CONTINENTS.map(continent => {
          const unlocked = playerLevel >= continent.requiredLevel
          const visited = continent.countries.filter(c => visitedCountryIds.includes(c.id)).length
          const total = continent.countries.length
          return (
            <button
              key={continent.id}
              onClick={() => unlocked && setSelectedContinent(continent)}
              disabled={!unlocked}
              className="flex flex-col items-center gap-1 rounded-2xl p-2 transition-all active:scale-95"
              style={{
                touchAction: 'manipulation',
                backgroundColor: unlocked ? `${continent.color}15` : 'rgba(0,0,0,0.04)',
                border: `1.5px solid ${unlocked ? `${continent.color}40` : 'rgba(0,0,0,0.07)'}`,
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{continent.emoji}</span>
              <span className="font-nunito text-[9px] text-center font-semibold" style={{ color: '#555' }}>
                {continent.name.split(' ')[0]}
              </span>
              <span className="font-nunito text-[9px]" style={{ color: '#9E9E9E' }}>
                {unlocked ? `${visited}/${total}` : '🔒'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="h-6" />
    </div>
  )
}

// ─── Continent View ────────────────────────────────────────────────────────────

function ContinentView({
  continent,
  playerLevel,
  playerAge,
  visitedCountryIds,
  onBack,
}: {
  continent: Continent
  playerLevel: number
  playerAge: number
  visitedCountryIds: string[]
  onBack: () => void
}) {
  const visitedInContinent = continent.countries.filter(c =>
    visitedCountryIds.includes(c.id)
  ).length

  return (
    <div className="game-container min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[#757575] active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi la hartă"
        >
          ←
        </button>
        <div className="text-center">
          <h2 className="font-fredoka text-xl font-semibold" style={{ color: continent.color }}>
            {continent.emoji} {continent.name}
          </h2>
          <p className="font-nunito text-xs text-[#757575]">
            {visitedInContinent}/{continent.countries.length} țări explorate
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress continent */}
      <div
        className="mb-5 h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(visitedInContinent / continent.countries.length) * 100}%`,
            background: `linear-gradient(90deg, ${continent.color}, ${continent.color}aa)`,
          }}
        />
      </div>

      {/* Grid de țări */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {continent.countries.map(country => {
          const visited = visitedCountryIds.includes(country.id)
          return (
            <CountryCard
              key={country.id}
              country={country}
              visited={visited}
              continentColor={continent.color}
            />
          )
        })}
      </div>

      <div className="h-6" />
    </div>
  )
}

// ─── Country Card ─────────────────────────────────────────────────────────────

function CountryCard({
  country,
  visited,
  continentColor,
}: {
  country: Country
  visited: boolean
  continentColor: string
}) {
  return (
    <Link
      href={`/play/adventure/${country.id}`}
      className="flex items-center gap-3 rounded-3xl p-4 transition-all active:scale-98 border"
      style={{
        touchAction: 'manipulation',
        backgroundColor: visited ? `${continentColor}12` : 'white',
        borderColor: visited ? `${continentColor}40` : 'rgba(0,0,0,0.07)',
        boxShadow: visited ? `0 2px 12px ${continentColor}18` : 'none',
      }}
    >
      {/* Steag mare */}
      <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>{country.flag}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="font-fredoka text-base font-semibold truncate"
            style={{ color: visited ? continentColor : '#212121' }}
          >
            {country.name}
          </p>
          {visited && <span style={{ fontSize: '14px', flexShrink: 0 }}>✅</span>}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-nunito text-xs text-[#757575]">
            {country.capitalEmoji} {country.capital}
          </span>
          <span className="font-nunito text-xs text-[#757575]">
            · {country.animalEmoji}
          </span>
        </div>

        {/* Landmark hint */}
        <p className="font-nunito text-[10px] text-[#9E9E9E] mt-0.5 truncate">
          {country.landmarkEmoji} {country.landmark}
        </p>
      </div>

      {/* Bloc deblocat badge */}
      {country.builderBlockUnlock && visited && (
        <div
          className="flex-shrink-0 flex flex-col items-center gap-0.5 rounded-xl px-2 py-1"
          style={{ backgroundColor: '#FFF8E1' }}
        >
          <span style={{ fontSize: '14px' }}>🧱</span>
          <span className="font-nunito text-[8px] font-bold" style={{ color: '#F57F17' }}>
            Unlock!
          </span>
        </div>
      )}
      {!visited && (
        <span className="text-[#BDBDBD] text-lg flex-shrink-0">→</span>
      )}
    </Link>
  )
}
