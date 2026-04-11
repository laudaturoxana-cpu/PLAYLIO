'use client'

import { useEffect, useState } from 'react'
import WorldMap from '@/components/adventure/WorldMap'

interface AdventureClientProps {
  userId: string
  profileName: string
  playerLevel: number
  playerAge: number
  completedQuestIds: string[]
}

function loadVisitedCountries(): string[] {
  try {
    const raw = localStorage.getItem('adventure_visited') ?? '[]'
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export default function AdventureClient({
  userId,
  profileName,
  playerLevel,
  playerAge,
  completedQuestIds,
}: AdventureClientProps) {
  const [visitedCountryIds, setVisitedCountryIds] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setVisitedCountryIds(loadVisitedCountries())
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-4xl" style={{ animation: 'bounce-soft 1s infinite' }}>🌍</span>
      </div>
    )
  }

  return (
    <WorldMap
      playerLevel={playerLevel}
      profileName={profileName}
      playerAge={playerAge}
      visitedCountryIds={visitedCountryIds}
    />
  )
}
