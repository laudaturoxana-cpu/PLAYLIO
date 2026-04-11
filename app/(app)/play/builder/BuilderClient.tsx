'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBuilderScene } from '@/lib/builder/useBuilderRoom'
import { BUILD_SCENES, type Block, type BuildScene } from '@/lib/builder/items'
import BlockCanvas from '@/components/builder/RoomCanvas'
import BlockPalette from '@/components/builder/ItemDrawer'
import HowToPlayOverlay from '@/components/shared/HowToPlayOverlay'
import { createClient } from '@/lib/supabase/client'
import { useLio } from '@/lib/ai/useLio'

const BUILDER_TUTORIAL = [
  {
    emoji: '🌍',
    title: 'Alege o scenă!',
    description: 'Ai 6 lumi în care poți construi: pădure, plajă, munte, oraș, ocean și cosmos!',
  },
  {
    emoji: '🧱',
    title: 'Selectează un bloc!',
    description: 'Din paleta de jos alege tipul de bloc dorit, apoi tapează pe grilă pentru a-l plasa.',
  },
  {
    emoji: '✨',
    title: 'Construiește liber!',
    description: 'Fă orice: case, castele, orașe, păduri! Blocurile rare se deblochează explorând Adventure World.',
  },
]

interface BuilderClientProps {
  userId: string
  profileName: string
  childAge: number
  initialCoins: number
  unlockedSceneIds: string[]
}

export default function BuilderClient({
  userId,
  profileName,
  childAge,
  initialCoins,
  unlockedSceneIds: initialUnlocked,
}: BuilderClientProps) {
  const [selectedScene, setSelectedScene] = useState<BuildScene | null>(null)
  const [coins, setCoins] = useState(initialCoins)
  const [unlockedSceneIds, setUnlockedSceneIds] = useState<string[]>(
    initialUnlocked.length > 0 ? initialUnlocked : ['magic_forest']
  )
  const [unlocking, setUnlocking] = useState<string | null>(null)

  async function handleUnlockScene(scene: BuildScene) {
    if (coins < scene.requiredCoins) return
    setUnlocking(scene.id)
    try {
      const supabase = createClient()
      await supabase.rpc('add_coins', {
        p_user_id: userId,
        p_amount: -scene.requiredCoins,
        p_reason: `unlock_scene_${scene.id}`,
        p_world: 'builder',
      })
      const newUnlocked = [...unlockedSceneIds, scene.id]
      setUnlockedSceneIds(newUnlocked)
      setCoins(c => c - scene.requiredCoins)
    } catch {
      // silent
    }
    setUnlocking(null)
  }

  if (!selectedScene) {
    return (
      <SceneSelector
        profileName={profileName}
        coins={coins}
        unlockedSceneIds={unlockedSceneIds}
        unlocking={unlocking}
        onSelectScene={setSelectedScene}
        onUnlockScene={handleUnlockScene}
      />
    )
  }

  return (
    <SceneBuilder
      buildScene={selectedScene}
      userId={userId}
      profileName={profileName}
      childAge={childAge}
      onBack={() => setSelectedScene(null)}
    />
  )
}

// ─── Scene Selector ─────────────────────────────────────────────────────────

function SceneSelector({
  profileName,
  coins,
  unlockedSceneIds,
  unlocking,
  onSelectScene,
  onUnlockScene,
}: {
  profileName: string
  coins: number
  unlockedSceneIds: string[]
  unlocking: string | null
  onSelectScene: (scene: BuildScene) => void
  onUnlockScene: (scene: BuildScene) => void
}) {
  return (
    <div className="game-container min-h-screen px-4 py-6">
      <HowToPlayOverlay
        storageKey="howtoplay_builder_v2"
        worldColor="#29B6F6"
        steps={BUILDER_TUTORIAL}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation', color: '#757575' }}
          aria-label="Înapoi"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold" style={{ color: '#29B6F6' }}>
            🏗️ Builder World
          </h1>
          <p className="font-nunito text-xs" style={{ color: '#757575' }}>
            Lumea ta, {profileName}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full px-3 py-1.5" style={{ backgroundColor: '#FFF8E1' }}>
          <span className="text-sm">🪙</span>
          <span className="font-fredoka text-sm font-semibold" style={{ color: '#F57F17' }}>{coins}</span>
        </div>
      </div>

      {/* Lio mesaj */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0" style={{ animation: 'bounce-soft 1.5s infinite' }}>🦁</span>
        <p className="font-nunito text-sm" style={{ color: '#212121' }}>
          Salut, {profileName}! Alege o lume în care să construiești! Fiecare are blocuri speciale! 🧱
        </p>
      </div>

      {/* Scene grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BUILD_SCENES.map(scene => {
          const unlocked = unlockedSceneIds.includes(scene.id)
          const canAfford = coins >= scene.requiredCoins
          const isUnlocking = unlocking === scene.id

          return (
            <button
              key={scene.id}
              onClick={() => {
                if (unlocked) onSelectScene(scene)
                else if (canAfford) onUnlockScene(scene)
              }}
              disabled={(!unlocked && !canAfford) || isUnlocking}
              className="flex flex-col items-start rounded-3xl p-4 text-left transition-all active:scale-95 border overflow-hidden"
              style={{
                touchAction: 'manipulation',
                background: unlocked ? scene.skyGradient : 'white',
                borderColor: unlocked ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.06)',
                opacity: !unlocked && !canAfford ? 0.55 : 1,
                minHeight: '120px',
                position: 'relative',
              }}
              aria-label={`${scene.name}${!unlocked ? ` — ${scene.requiredCoins} monede` : ''}`}
            >
              {/* Ground strip preview */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '20%',
                  background: scene.groundColor,
                  opacity: unlocked ? 1 : 0.3,
                }}
              />

              <div className="relative z-10 flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl">{scene.emoji}</span>
                  {!unlocked && (
                    <span
                      className="font-nunito text-[10px] font-semibold rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: canAfford ? 'rgba(255,213,79,0.3)' : 'rgba(0,0,0,0.06)',
                        color: canAfford ? '#E65100' : '#757575',
                      }}
                    >
                      {canAfford ? `🔓 ${scene.requiredCoins}🪙` : `🔒 ${scene.requiredCoins}🪙`}
                    </span>
                  )}
                  {unlocked && <span className="text-base">✅</span>}
                </div>
                <p
                  className="font-fredoka text-sm font-semibold"
                  style={{ color: unlocked ? '#212121' : '#757575' }}
                >
                  {scene.name}
                </p>
                <p className="font-nunito text-[10px]" style={{ color: unlocked ? '#555' : '#9E9E9E' }}>
                  {unlocked ? scene.description : canAfford ? 'Tap pentru a debloca!' : 'Câștigă mai multe monede'}
                </p>
                {isUnlocking && (
                  <span className="font-nunito text-xs" style={{ color: '#29B6F6' }}>Se deblochează...</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="h-6" />
    </div>
  )
}

// ─── Scene Builder ────────────────────────────────────────────────────────────

function SceneBuilder({
  buildScene,
  userId,
  profileName,
  childAge,
  onBack,
}: {
  buildScene: BuildScene
  userId: string
  profileName: string
  childAge: number
  onBack: () => void
}) {
  const {
    scene,
    selectedBlock,
    setSelectedBlock,
    lioComment,
    isLoaded,
    isDirty,
    blockCount,
    placeBlock,
    removeBlock,
    replaceBlock,
    clearScene,
    syncToSupabase,
    gridCols,
    gridRows,
  } = useBuilderScene(userId, buildScene.id)

  const { ask: askLio } = useLio({ childName: profileName, age: childAge, world: 'builder' })
  const [aiLioMessage, setAiLioMessage] = useState<string | null>(null)

  function handleBlockSelect(block: Block | null) {
    setSelectedBlock(block)
  }

  function handleCellTap(col: number, row: number) {
    if (!selectedBlock) return
    // Încearcă plasare directă; dacă celula e ocupată → înlocuire
    const placed = scene.placedBlocks.some(b => b.col === col && b.row === row)
    const success = placed
      ? replaceBlock(selectedBlock, col, row)
      : placeBlock(selectedBlock, col, row)

    if (success) {
      // Lio AI mesaj la fiecare 5 blocuri
      if (blockCount > 0 && blockCount % 5 === 0) {
        askLio('item_placed', { context: `a plasat ${blockCount + 1} blocuri în ${buildScene.nameEn}` })
          .then(msg => {
            if (msg) {
              setAiLioMessage(msg)
              setTimeout(() => setAiLioMessage(null), 3000)
            }
          })
      }
    }
  }

  function handleBlockTap(uid: string) {
    removeBlock(uid)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-5xl" style={{ animation: 'bounce-soft 1s infinite' }}>{buildScene.emoji}</span>
      </div>
    )
  }

  return (
    <div
      className="game-container min-h-screen px-3 py-4"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 active:scale-95 transition-transform text-lg"
          style={{ touchAction: 'manipulation', color: '#757575' }}
          aria-label="Înapoi la scene"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="font-fredoka text-lg font-semibold" style={{ color: '#29B6F6' }}>
            {buildScene.emoji} {profileName}&apos;s {buildScene.name}
          </h1>
          <p className="font-nunito text-xs" style={{ color: '#757575' }}>
            {blockCount} blocuri plasate
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isDirty && (
            <button
              onClick={syncToSupabase}
              className="font-nunito text-[10px] underline"
              style={{ touchAction: 'manipulation', color: '#29B6F6' }}
            >
              Salvează
            </button>
          )}
          <button
            onClick={clearScene}
            className="font-nunito text-[10px]"
            style={{ touchAction: 'manipulation', color: '#EF5350' }}
          >
            🗑️ Șterge tot
          </button>
        </div>
      </div>

      {/* Lio mesaj */}
      {(aiLioMessage || lioComment) && (
        <div
          className="rounded-2xl px-4 py-2 text-center"
          style={{
            backgroundColor: 'rgba(41,182,246,0.1)',
            border: '1px solid rgba(41,182,246,0.25)',
            animation: 'slide-up 0.3s ease',
          }}
        >
          <p className="font-nunito text-sm font-semibold" style={{ color: '#0288D1' }}>
            🦁 {aiLioMessage ?? lioComment}
          </p>
        </div>
      )}

      {/* Two-column on desktop: canvas left, palette right */}
      <div
        className="builder-layout flex flex-col gap-3"
        style={{
          flex: 1,
          /* On lg screens: row layout via inline media would need CSS — handled via globals */
        }}
      >
        {/* Canvas */}
        <div className="builder-canvas flex flex-col gap-2">
          <BlockCanvas
            scene={scene}
            buildScene={buildScene}
            selectedBlock={selectedBlock}
            onCellTap={handleCellTap}
            onBlockTap={handleBlockTap}
            gridCols={gridCols}
            gridRows={gridRows}
          />
          {!selectedBlock && scene.placedBlocks.length > 0 && (
            <p className="font-nunito text-[10px] text-center" style={{ color: '#BDBDBD' }}>
              Tap pe un bloc din canvas pentru a-l șterge
            </p>
          )}
        </div>

        {/* Palette */}
        <div className="builder-palette rounded-3xl bg-white border border-black/5 shadow-sm p-3">
          <BlockPalette
            childAge={childAge}
            selectedBlock={selectedBlock}
            onSelect={handleBlockSelect}
          />
        </div>
      </div>

      <div className="h-2" />
    </div>
  )
}
