'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Html, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { CONTINENTS, type Continent, type Country } from '@/lib/adventure/zones'

// ─── Lat/Lng definitions for each continent ──────────────────────

const CONTINENT_LATLON: Record<string, { lat: number; lng: number }> = {
  europe:        { lat: 54,  lng: 15  },
  africa:        { lat:  0,  lng: 20  },
  asia:          { lat: 34,  lng: 100 },
  north_america: { lat: 45,  lng: -100},
  south_america: { lat: -15, lng: -60 },
  oceania:       { lat: -25, lng: 135 },
}

const COUNTRY_LATLON: Record<string, { lat: number; lng: number }> = {
  romania:       { lat: 45.9, lng: 24.9 },
  france:        { lat: 46.2, lng: 2.2  },
  germany:       { lat: 51.2, lng: 10.4 },
  spain:         { lat: 40.5, lng: -3.7 },
  italy:         { lat: 41.9, lng: 12.6 },
  uk:            { lat: 55.4, lng: -3.4 },
  japan:         { lat: 36.2, lng: 138.3},
  china:         { lat: 35.9, lng: 104.2},
  india:         { lat: 20.6, lng: 79.1 },
  brazil:        { lat: -14.2,lng: -51.9},
  usa:           { lat: 37.1, lng: -95.7},
  canada:        { lat: 56.1, lng: -106.3},
  australia:     { lat: -25.3,lng: 133.8},
  egypt:         { lat: 26.8, lng: 30.8 },
  south_africa:  { lat: -30.6,lng: 22.9 },
  russia:        { lat: 61.5, lng: 105.3},
  mexico:        { lat: 23.6, lng: -102.6},
  argentina:     { lat: -38.4,lng: -63.6},
}

// ─── Lat/Lng → 3D sphere position ────────────────────────────────

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  )
}

// ─── Globe sphere ─────────────────────────────────────────────────

function GlobeSphere() {
  return (
    <>
      {/* Ocean */}
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
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.07, 32, 32]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

// ─── Continent patch ─────────────────────────────────────────────

interface ContinentPatchProps {
  continent: Continent
  isHovered: boolean
  isSelected: boolean
  onHover: (id: string | null) => void
  onSelect: (continent: Continent) => void
}

function ContinentPatch({ continent, isHovered, isSelected, onHover, onSelect }: ContinentPatchProps) {
  const ll = CONTINENT_LATLON[continent.id]
  if (!ll) return null

  const pos = latLngToVec3(ll.lat, ll.lng, 2.01)
  const color = continent.color

  // Patch: flattened sphere segment as a disc at the continent center
  const patchSize = 0.38 + (isHovered ? 0.04 : 0) + (isSelected ? 0.04 : 0)

  return (
    <mesh
      position={pos}
      lookAt={new THREE.Vector3(0, 0, 0).multiplyScalar(-1).add(pos)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect(continent)
      }}
      onPointerEnter={() => onHover(continent.id)}
      onPointerLeave={() => onHover(null)}
    >
      <circleGeometry args={[patchSize, 24]} />
      <meshBasicMaterial
        color={isSelected ? '#FFD600' : isHovered ? '#FFF176' : color}
        transparent
        opacity={isSelected ? 0.95 : isHovered ? 0.9 : 0.82}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── Country pin ─────────────────────────────────────────────────

interface CountryPinProps {
  country: Country
  isVisited: boolean
  isSelected: boolean
  onSelect: (country: Country) => void
}

function CountryPin({ country, isVisited, isSelected, onSelect }: CountryPinProps) {
  const ll = COUNTRY_LATLON[country.id]
  if (!ll) return null

  const pos = latLngToVec3(ll.lat, ll.lng, 2.05)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current && isSelected) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 4) * 0.15)
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect(country)
      }}
    >
      <sphereGeometry args={[isSelected ? 0.07 : 0.045, 12, 12]} />
      <meshBasicMaterial
        color={isVisited ? '#66BB6A' : isSelected ? '#FFD600' : '#FF7043'}
        transparent={!isVisited && !isSelected}
        opacity={isVisited ? 1 : 0.9}
      />
    </mesh>
  )
}

// ─── Continent label (HTML overlay) ──────────────────────────────

function ContinentLabel({ continent, isSelected }: { continent: Continent; isSelected: boolean }) {
  const ll = CONTINENT_LATLON[continent.id]
  if (!ll) return null
  const pos = latLngToVec3(ll.lat, ll.lng, 2.45)

  return (
    <Html position={pos} center distanceFactor={6} zIndexRange={[0, 10]} occlude>
      <div
        className="pointer-events-none select-none"
        style={{
          fontFamily: 'Fredoka One, sans-serif',
          fontSize: isSelected ? '13px' : '11px',
          fontWeight: 600,
          color: isSelected ? '#FFD600' : 'white',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
        }}
      >
        {continent.emoji} {continent.name}
      </div>
    </Html>
  )
}

// ─── Auto-rotation ────────────────────────────────────────────────

function AutoRotate({ paused }: { paused: boolean }) {
  const { scene } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!paused && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12
    }
  })

  // Attach globe group to scene root for auto-rotation
  return <group ref={groupRef} />
}

// ─── Main Globe scene ─────────────────────────────────────────────

interface GlobeSceneProps {
  visitedCountryIds: string[]
  playerLevel: number
  onSelectContinent: (continent: Continent) => void
  onSelectCountry: (country: Country) => void
}

function GlobeScene({ visitedCountryIds, playerLevel, onSelectContinent, onSelectCountry }: GlobeSceneProps) {
  const globeRef  = useRef<THREE.Group>(null)
  const [hoveredContinentId, setHoveredContinentId] = useState<string | null>(null)
  const [selectedContinentId, setSelectedContinentId] = useState<string | null>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  useFrame((_, delta) => {
    if (!isUserInteracting && globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1
    }
  })

  function handleContinentSelect(continent: Continent) {
    setSelectedContinentId(prev => prev === continent.id ? null : continent.id)
    onSelectContinent(continent)
  }

  const unlockedContinents = CONTINENTS.filter(c => c.requiredLevel <= playerLevel)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-8, -3, -5]} intensity={0.3} color="#4FC3F7" />

      {/* Rotating globe group */}
      <group
        ref={globeRef}
        onPointerDown={() => setIsUserInteracting(true)}
        onPointerUp={() => setTimeout(() => setIsUserInteracting(false), 1000)}
      >
        <GlobeSphere />

        {/* Continents */}
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

        {/* Country pins for selected continent */}
        {selectedContinentId && (() => {
          const cont = CONTINENTS.find(c => c.id === selectedContinentId)
          return cont?.countries.map(country => (
            <CountryPin
              key={country.id}
              country={country}
              isVisited={visitedCountryIds.includes(country.id)}
              isSelected={false}
              onSelect={onSelectCountry}
            />
          ))
        })()}

        {/* Continent labels */}
        {unlockedContinents.map(continent => (
          <ContinentLabel
            key={continent.id}
            continent={continent}
            isSelected={selectedContinentId === continent.id}
          />
        ))}
      </group>

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        enableDamping
        dampingFactor={0.06}
        onStart={() => setIsUserInteracting(true)}
        onEnd={() => setTimeout(() => setIsUserInteracting(false), 800)}
      />
    </>
  )
}

// ─── Public canvas component ─────────────────────────────────────

export interface Globe3DProps {
  visitedCountryIds: string[]
  playerLevel: number
  onSelectContinent: (continent: Continent) => void
  onSelectCountry: (country: Country) => void
}

export default function Globe3D({
  visitedCountryIds,
  playerLevel,
  onSelectContinent,
  onSelectCountry,
}: Globe3DProps) {
  return (
    <div className="w-full rounded-3xl overflow-hidden" style={{ aspectRatio: '1 / 1', maxWidth: 420, margin: '0 auto' }}>
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
