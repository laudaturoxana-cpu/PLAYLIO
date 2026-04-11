'use client'

import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { BLOCK_MAP, type Block, type BuildScene } from '@/lib/builder/items'
import { type VoxelBlock } from '@/lib/builder/useVoxelScene'

// ─── Color extraction from CSS bgStyle ──────────────────────────

function extractHex(bgStyle: string): string {
  const match = bgStyle.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/)
  return match ? match[0] : '#888888'
}

function lighten(hex: string, amount: number): string {
  const c = new THREE.Color(hex)
  c.r = Math.min(1, c.r + amount)
  c.g = Math.min(1, c.g + amount)
  c.b = Math.min(1, c.b + amount)
  return `#${c.getHexString()}`
}

function darken(hex: string, amount: number): string {
  const c = new THREE.Color(hex)
  c.r = Math.max(0, c.r - amount)
  c.g = Math.max(0, c.g - amount)
  c.b = Math.max(0, c.b - amount)
  return `#${c.getHexString()}`
}

// Per block-type material cache — top/side/bottom faces
interface BlockMaterials {
  top: THREE.MeshLambertMaterial
  side: THREE.MeshLambertMaterial
  bottom: THREE.MeshLambertMaterial
}

const materialCache = new Map<string, BlockMaterials>()

function makePixelTexture(topColor: string, sideColor: string, size = 16): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = sideColor
  ctx.fillRect(0, 0, size, size)
  // Pixel noise for Minecraft feel
  const c = new THREE.Color(sideColor)
  for (let i = 0; i < size * size * 0.18; i++) {
    const px = Math.floor(Math.random() * size)
    const py = Math.floor(Math.random() * size)
    const bright = Math.random() > 0.5 ? 0.12 : -0.08
    ctx.fillStyle = `rgb(${Math.round(Math.min(255,Math.max(0,(c.r+bright)*255))},${Math.round(Math.min(255,Math.max(0,(c.g+bright)*255)))},${Math.round(Math.min(255,Math.max(0,(c.b+bright)*255)))})`
    ctx.fillRect(px, py, 1, 1)
  }
  // Darker border edge (Minecraft block edge)
  ctx.strokeStyle = darken(sideColor, 0.22)
  ctx.lineWidth = 1
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1)
  const tex = new THREE.CanvasTexture(canvas)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  return tex
}

function getBlockMaterials(blockId: string): BlockMaterials {
  if (materialCache.has(blockId)) return materialCache.get(blockId)!
  const block = BLOCK_MAP.get(blockId)
  const base = block ? extractHex(block.bgStyle) : '#888888'
  const topColor  = lighten(base, 0.14)
  const sideColor = base
  const botColor  = darken(base, 0.18)
  const topTex  = makePixelTexture(topColor,  topColor)
  const sideTex = makePixelTexture(sideColor, sideColor)
  const botTex  = makePixelTexture(botColor,  botColor)
  const mats: BlockMaterials = {
    top:    new THREE.MeshLambertMaterial({ map: topTex }),
    side:   new THREE.MeshLambertMaterial({ map: sideTex }),
    bottom: new THREE.MeshLambertMaterial({ map: botTex }),
  }
  materialCache.set(blockId, mats)
  return mats
}

// BoxGeometry with 6 face groups for top/side/bottom materials
const VOXEL_GEOM = new THREE.BoxGeometry(0.96, 0.96, 0.96)

// Cache the material arrays too so useMemo returns stable references
const materialArrayCache = new Map<string, THREE.MeshLambertMaterial[]>()

function voxelMaterialArray(blockId: string): THREE.MeshLambertMaterial[] {
  if (materialArrayCache.has(blockId)) return materialArrayCache.get(blockId)!
  const m = getBlockMaterials(blockId)
  // Order: +X, -X, +Y (top), -Y (bottom), +Z, -Z
  const arr = [m.side, m.side, m.top, m.bottom, m.side, m.side]
  materialArrayCache.set(blockId, arr)
  return arr
}

// ─── Single voxel block mesh ─────────────────────────────────────

interface VoxelMeshProps {
  voxel: VoxelBlock
  onFaceClick: (voxel: VoxelBlock, normal: THREE.Vector3) => void
  onRemove: (uid: string) => void
  hasSelectedBlock: boolean
}

function VoxelMesh({ voxel, onFaceClick, onRemove, hasSelectedBlock }: VoxelMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materials = useMemo(() => voxelMaterialArray(voxel.blockId), [voxel.blockId])

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    if (hasSelectedBlock) {
      const n = e.face?.normal.clone() ?? new THREE.Vector3(0, 1, 0)
      onFaceClick(voxel, n)
    } else {
      onRemove(voxel.uid)
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={[voxel.x, voxel.y, voxel.z]}
      geometry={VOXEL_GEOM}
      material={materials}
      onClick={handleClick}
      castShadow
      receiveShadow
    />
  )
}

// ─── Ground plane ─────────────────────────────────────────────────

interface GroundProps {
  buildScene: BuildScene
  gridSize: number
  hasSelectedBlock: boolean
  onGroundClick: (x: number, z: number) => void
}

function Ground({ buildScene, gridSize, hasSelectedBlock, onGroundClick }: GroundProps) {
  const groundColor = extractHex(buildScene.groundColor)
  const dirtColor   = darken(groundColor, 0.18)

  function handleClick(e: ThreeEvent<MouseEvent>) {
    if (!hasSelectedBlock) return
    e.stopPropagation()
    const x = Math.round(e.point.x)
    const z = Math.round(e.point.z)
    onGroundClick(x, z)
  }

  return (
    <group>
      {/* Clickable invisible plane at y=0 for placing blocks on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]} receiveShadow onClick={handleClick}>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* Ground top layer (grass/sand/snow etc) — Minecraft-style 1-unit thick */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[gridSize, 1, gridSize]} />
        <meshLambertMaterial color={groundColor} />
      </mesh>
      {/* Dirt/rock sub-layer */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[gridSize, 3, gridSize]} />
        <meshLambertMaterial color={dirtColor} />
      </mesh>
    </group>
  )
}

// ─── Sky based on scene ──────────────────────────────────────────

function SceneSky({ buildScene }: { buildScene: BuildScene }) {
  // Extract sky color from gradient
  const skyColor = extractHex(buildScene.skyGradient)
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color(skyColor)
    scene.fog = new THREE.Fog(skyColor, 30, 60)
    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene, skyColor])

  return null
}

// ─── Hover ghost preview ─────────────────────────────────────────

interface GhostVoxelProps {
  position: [number, number, number] | null
  selectedBlock: Block | null
}

function GhostVoxel({ position, selectedBlock }: GhostVoxelProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshLambertMaterial
      mat.opacity = 0.4 + Math.sin(clock.elapsedTime * 3) * 0.15
    }
  })

  if (!position || !selectedBlock) return null

  const color = extractHex(selectedBlock.bgStyle)
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      <meshLambertMaterial color={color} transparent opacity={0.5} />
    </mesh>
  )
}

// ─── Camera setup ────────────────────────────────────────────────

function CameraSetup() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(10, 12, 10)
    camera.lookAt(0, 0, 0)
    if ('fov' in camera) {
      (camera as THREE.PerspectiveCamera).fov = 55
      camera.updateProjectionMatrix()
    }
  }, [camera])
  return null
}

// ─── Main scene ──────────────────────────────────────────────────

interface VoxelSceneProps {
  blocks: VoxelBlock[]
  selectedBlock: Block | null
  buildScene: BuildScene
  gridSize: number
  onPlaceVoxel: (x: number, y: number, z: number) => void
  onRemoveVoxel: (uid: string) => void
  ghostPosition: [number, number, number] | null
  onSetGhost: (pos: [number, number, number] | null) => void
}

function VoxelScene({
  blocks,
  selectedBlock,
  buildScene,
  gridSize,
  onPlaceVoxel,
  onRemoveVoxel,
  ghostPosition,
  onSetGhost,
}: VoxelSceneProps) {
  const hasSelected = selectedBlock !== null

  const handleFaceClick = useCallback((voxel: VoxelBlock, normal: THREE.Vector3) => {
    const nx = Math.round(normal.x)
    const ny = Math.round(normal.y)
    const nz = Math.round(normal.z)
    onPlaceVoxel(voxel.x + nx, voxel.y + ny, voxel.z + nz)
  }, [onPlaceVoxel])

  const handleGroundClick = useCallback((x: number, z: number) => {
    onPlaceVoxel(x, 0, z)
  }, [onPlaceVoxel])

  const handleFaceHover = useCallback((e: ThreeEvent<PointerEvent>, voxel: VoxelBlock) => {
    if (!selectedBlock) { onSetGhost(null); return }
    e.stopPropagation()
    const n = e.face?.normal.clone() ?? new THREE.Vector3(0, 1, 0)
    onSetGhost([
      voxel.x + Math.round(n.x),
      voxel.y + Math.round(n.y),
      voxel.z + Math.round(n.z),
    ])
  }, [selectedBlock, onSetGhost])

  const handleGroundMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!selectedBlock) { onSetGhost(null); return }
    onSetGhost([Math.round(e.point.x), 0, Math.round(e.point.z)])
  }, [selectedBlock, onSetGhost])

  return (
    <>
      <CameraSetup />
      <SceneSky buildScene={buildScene} />

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87CEEB', '#228B22', 0.3]} />

      {/* Grid overlay on ground */}
      <Grid
        position={[0, -0.48, 0]}
        args={[gridSize, gridSize]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ffffff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="rgba(255,255,255,0.3)"
        fadeDistance={40}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Ground */}
      <Ground
        buildScene={buildScene}
        gridSize={gridSize}
        hasSelectedBlock={hasSelected}
        onGroundClick={handleGroundClick}
      />

      {/* Ghost hover plane at y=0 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.48, 0]}
        onPointerMove={hasSelected ? handleGroundMove : undefined}
        onPointerLeave={() => onSetGhost(null)}
      >
        <planeGeometry args={[gridSize, gridSize]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Placed voxel blocks */}
      {blocks.map(voxel => (
        <group
          key={voxel.uid}
          onPointerMove={hasSelected ? (e) => handleFaceHover(e, voxel) : undefined}
        >
          <VoxelMesh
            voxel={voxel}
            hasSelectedBlock={hasSelected}
            onFaceClick={handleFaceClick}
            onRemove={onRemoveVoxel}
          />
        </group>
      ))}

      {/* Ghost preview */}
      <GhostVoxel position={ghostPosition} selectedBlock={selectedBlock} />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={4}
        maxDistance={35}
        enablePan={true}
        panSpeed={0.8}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

// ─── Public canvas wrapper ────────────────────────────────────────

export interface VoxelWorldProps {
  blocks: VoxelBlock[]
  selectedBlock: Block | null
  buildScene: BuildScene
  gridSize: number
  ghostPosition: [number, number, number] | null
  onSetGhost: (pos: [number, number, number] | null) => void
  onPlaceVoxel: (x: number, y: number, z: number) => void
  onRemoveVoxel: (uid: string) => void
}

export default function VoxelWorld({
  blocks,
  selectedBlock,
  buildScene,
  gridSize,
  ghostPosition,
  onSetGhost,
  onPlaceVoxel,
  onRemoveVoxel,
}: VoxelWorldProps) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: 'min(60vh, 520px)', minHeight: 340 }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ touchAction: 'none', width: '100%', height: '100%' }}
      >
        <VoxelScene
          blocks={blocks}
          selectedBlock={selectedBlock}
          buildScene={buildScene}
          gridSize={gridSize}
          ghostPosition={ghostPosition}
          onSetGhost={onSetGhost}
          onPlaceVoxel={onPlaceVoxel}
          onRemoveVoxel={onRemoveVoxel}
        />
      </Canvas>
    </div>
  )
}
