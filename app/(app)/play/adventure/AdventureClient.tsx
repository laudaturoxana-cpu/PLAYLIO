'use client'

import { useEffect, useState } from 'react'
import { ZONES } from '@/lib/adventure/zones'
import { loadSavedStars } from '@/lib/adventure/useAdventureGame'
import WorldMap from '@/components/adventure/WorldMap'

interface AdventureClientProps {
  userId: string
  profileName: string
  playerLevel: number
  completedQuestIds: string[]
}

export default function AdventureClient({
  userId,
  profileName,
  playerLevel,
  completedQuestIds,
}: AdventureClientProps) {
  // Încarcă stelele din localStorage (offline-first)
  const [savedStarsMap, setSavedStarsMap] = useState<Record<string, number>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const map: Record<string, number> = {}
    for (const zone of ZONES) {
      map[zone.id] = loadSavedStars(zone.id)
    }
    setSavedStarsMap(map)
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-4xl" style={{ animation: 'bounce-soft 1s infinite' }}>🗺️</span>
      </div>
    )
  }

  return (
    <WorldMap
      playerLevel={playerLevel}
      profileName={profileName}
      savedStarsMap={savedStarsMap}
    />
  )
}
