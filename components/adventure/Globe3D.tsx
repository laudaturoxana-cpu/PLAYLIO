'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { CONTINENTS, type Continent, type Country } from '@/lib/adventure/zones'

// ─── Lat/Lng for each continent center ───────────────────────────

const CONTINENT_LATLON: Record<string, { lat: number; lng: number }> = {
  europe:        { lat: 54,   lng: 15   },
  africa:        { lat:  0,   lng: 20   },
  asia:          { lat: 34,   lng: 100  },
  north_america: { lat: 45,   lng: -100 },
  south_america: { lat: -15,  lng: -60  },
  oceania:       { lat: -25,  lng: 135  },
}

const COUNTRY_LATLON: Record<string, { lat: number; lng: number }> = {
  romania:       { lat: 45.9,  lng:  24.9  },
  france:        { lat: 46.2,  lng:   2.2  },
  germany:       { lat: 51.2,  lng:  10.4  },
  spain:         { lat: 40.5,  lng:  -3.7  },
  italy:         { lat: 41.9,  lng:  12.6  },
  uk:            { lat: 55.4,  lng:  -3.4  },
  japan:         { lat: 36.2,  lng: 138.3  },
  china:         { lat: 35.9,  lng: 104.2  },
  india:         { lat: 20.6,  lng:  79.1  },
  brazil:        { lat: -14.2, lng: -51.9  },
  usa:           { lat: 37.1,  lng: -95.7  },
  canada:        { lat: 56.1,  lng: -106.3 },
  australia:     { lat: -25.3, lng: 133.8  },
  egypt:         { lat: 26.8,  lng:  30.8  },
  south_africa:  { lat: -30.6, lng:  22.9  },
  russia:        { lat: 61.5,  lng: 105.3  },
  mexico:        { lat: 23.6,  lng: -102.6 },
  argentina:     { lat: -38.4, lng:  -63.6 },
}

// ─── Lat/Lng → 3D sphere point ────────────────────────────────────

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  )
}

// Quaternion that rotates disc's +Z to point outward from sphere surface
function surfaceQuaternion(pos: THREE.Vector3): THREE.Quaternion {
  const q = new THREE.Quaternion()
  q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize())
  return q
}

// ─── Ocean + atmosphere sphere ────────────────────────────────────

function GlobeSphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshPhongMaterial
          color="#1565C0"
          emissive="#0D2D6B"
          emissiveIntensity={0.15}
          specular="#4FC3F7"
          shininess={80}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[2.08, 32, 32]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

// ─── Continent patch (coloured disc on sphere surface) ────────────

function ContinentPatch({
  continent,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: {
  continent: Continent
  isHovered: boolean
  isSelected: boolean
  onHover: (id: string | null) => void
  onSelect: (c: Continent) => void
}) {
  const ll = CONTINENT_LATLON[continent.id]
  if (!ll) return null

  // pos + quaternion depend on ll (derived from constant map, stable per continent)
  const { pos, quat } = useMemo(() => {
    const p = latLngToVec3(ll.lat, ll.lng, 2.05)
    return { pos: p, quat: surfaceQuaternion(p) }
  }, [ll])

  const size = 0.55 + (isHovered ? 0.06 : 0) + (isSelected ? 0.08 : 0)

  return (
    <mesh
      position={pos}
      quaternion={quat}
      renderOrder={2}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(continent) }}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(continent.id) }}
      onPointerLeave={() => onHover(null)}
    >
      <circleGeometry args={[size, 32]} />
      <meshBasicMaterial
        color={isSelected ? '#FFD600' : isHovered ? '#FFF176' : continent.color}
        transparent
        opacity={isSelected ? 0.95 : isHovered ? 0.9 : 0.85}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

// ─── Country pin (small sphere on surface) ────────────────────────

function CountryPin({
  country,
  isVisited,
  onSelect,
}: {
  country: Country
  isVisited: boolean
  onSelect: (c: Country) => void
}) {
  const ll = COUNTRY_LATLON[country.id]
  if (!ll) return null

  const pos = useMemo(
    () => latLngToVec3(ll.lat, ll.lng, 2.06),
    [ll],
  )

  return (
    <mesh
      position={pos}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(country) }}
    >
      <sphereGeometry args={[0.048, 10, 10]} />
      <meshBasicMaterial color={isVisited ? '#66BB6A' : '#FF7043'} />
    </mesh>
  )
}

// ─── Continent HTML label ─────────────────────────────────────────

function ContinentLabel({ continent, isSelected }: { continent: Continent; isSelected: boolean }) {
  const ll = CONTINENT_LATLON[continent.id]
  if (!ll) return null

  const pos = useMemo(
    () => latLngToVec3(ll.lat, ll.lng, 2.55),
    [ll],
  )

  return (
    <Html position={pos} center distanceFactor={6} zIndexRange={[0, 10]}>
      <div
        className="pointer-events-none select-none"
        style={{
          fontFamily: 'Fredoka One, sans-serif',
          fontSize: isSelected ? '13px' : '11px',
          fontWeight: 600,
          color: isSelected ? '#FFD600' : 'white',
          textShadow: '0 1px 4px rgba(0,0,0,0.85)',
          whiteSpace: 'nowrap',
          transition: 'font-size 0.15s ease, color 0.15s ease',
        }}
      >
        {continent.emoji} {continent.name}
      </div>
    </Html>
  )
}

// ─── Main scene ───────────────────────────────────────────────────

function GlobeScene({
  visitedCountryIds,
  playerLevel,
  onSelectContinent,
  onSelectCountry,
}: {
  visitedCountryIds: string[]
  playerLevel: number
  onSelectContinent: (c: Continent) => void
  onSelectCountry: (c: Country) => void
}) {
  const globeRef      = useRef<THREE.Group>(null)
  const controlsRef   = useRef<OrbitControlsImpl>(null)
  const interactingRef = useRef(false)             // no re-render on drag

  const [hoveredContinentId,  setHoveredContinentId]  = useState<string | null>(null)
  const [selectedContinentId, setSelectedContinentId] = useState<string | null>(null)

  // Wire up OrbitControls start/end via addEventListener (no onStart/onEnd prop)
  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl) return
    const onStart = () => { interactingRef.current = true }
    const onEnd   = () => { setTimeout(() => { interactingRef.current = false }, 700) }
    ctrl.addEventListener('start', onStart)
    ctrl.addEventListener('end',   onEnd)
    return () => {
      ctrl.removeEventListener('start', onStart)
      ctrl.removeEventListener('end',   onEnd)
    }
  }, [])

  // Auto-rotate when user isn't interacting
  useFrame((_, delta) => {
    if (!interactingRef.current && globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1
    }
  })

  function handleContinentSelect(continent: Continent) {
    setSelectedContinentId(prev => prev === continent.id ? null : continent.id)
    onSelectContinent(continent)
  }

  const unlockedContinents = useMemo(
    () => CONTINENTS.filter(c => c.requiredLevel <= playerLevel),
    [playerLevel],
  )

  const selectedContinent = useMemo(
    () => CONTINENTS.find(c => c.id === selectedContinentId) ?? null,
    [selectedContinentId],
  )

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-8, -3, -5]} intensity={0.25} color="#4FC3F7" />

      {/* The whole globe rotates in this group */}
      <group ref={globeRef}>
        <GlobeSphere />

        {unlockedContinents.map(continent => (
          <ContinentPatch
            key={continent.id}
            continent={continent}
            isHovered={hoveredContinentId === continent.id}
            isSelected={selectedContinentId === continent.id}
            onHover={setHoveredContinentId}
            onSelect={handleContinentSelect}
          />
        ))}

        {/* Country pins — only for selected continent */}
        {selectedContinent?.countries.map(country => (
          <CountryPin
            key={country.id}
            country={country}
            isVisited={visitedCountryIds.includes(country.id)}
            onSelect={onSelectCountry}
          />
        ))}

        {/* Labels */}
        {unlockedContinents.map(continent => (
          <ContinentLabel
            key={continent.id}
            continent={continent}
            isSelected={selectedContinentId === continent.id}
          />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

// ─── Public component ─────────────────────────────────────────────

export interface Globe3DProps {
  visitedCountryIds: string[]
  playerLevel: number
  onSelectContinent: (continent: Continent) => void
  onSelectCountry: (country: Country) => void
}

export default function Globe3D({ visitedCountryIds, playerLevel, onSelectContinent, onSelectCountry }: Globe3DProps) {
  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{ aspectRatio: '1 / 1', maxWidth: 420, margin: '0 auto' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', touchAction: 'none' }}
        dpr={[1, 2]}
      >
        <GlobeScene
          visitedCountryIds={visitedCountryIds}
          playerLevel={playerLevel}
          onSelectContinent={onSelectContinent}
          onSelectCountry={onSelectCountry}
        />
      </Canvas>
    </div>
  )
}
