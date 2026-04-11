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

function getBlockMaterials(blockId: string): BlockMaterials {
  if (materialCache.has(blockId)) return materialCache.get(blockId)!
  const block = BLOCK_MAP.get(blockId)
  const base = block ? extractHex(block.bgStyle) : '#888888'
  const border = block?.borderColor ?? darken(base, 0.15)
  const mats: BlockMaterials = {
    top:    new THREE.MeshLambertMaterial({ color: lighten(base, 0.12) }),
    side:   new THREE.MeshLambertMaterial({ color: base }),
    bottom: new THREE.MeshLambertMaterial({ color: border }),
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
  selected: boolean
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

  function handleClick(e: ThreeEvent<MouseEvent>) {
    if (!hasSelectedBlock) return
    e.stopPropagation()
    const x = Math.round(e.point.x)
    const z = Math.round(e.point.z)
    onGroundClick(x, z)
  }

  return (
    <group>
      {/* Ground surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow onClick={handleClick}>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshLambertMaterial color={groundColor} />
      </mesh>
      {/* Sub-ground fill */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[gridSize, 3, gridSize]} />
        <meshLambertMaterial color={darken(groundColor, 0.1)} />
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
    camera.position.set(12, 10, 12)
    camera.lookAt(0, 0, 0)
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

      {/* Ground pointer move for ghost */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.49, 0]}
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
            selected={false}
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
    <div className="w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: 320 }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ touchAction: 'none' }}
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
