'use client'

import type { JumpLevel, CharacterId } from '@/lib/jump/levels'
import {
  SCENE_W, SCENE_H, GROUND_Y, CHAR_H, CHAR_W, CHAR_SCREEN_X,
} from '@/lib/jump/useJumpGame'

interface JumpCanvasProps {
  level: JumpLevel
  charY: number
  charId: CharacterId
  distance: number
  hearts: number
  maxHearts: number
  invincible: boolean
  collectedCoinIds: Set<string>
  score: number
  onJump: () => void
}

// ─── Character drawings ───────────────────────────────────────

function LioSVG({ x, y, runFrame, invincible }: { x: number; y: number; runFrame: number; invincible: boolean }) {
  const leg1 = runFrame % 2 === 0
  const opacity = invincible ? (runFrame % 3 === 0 ? 0.25 : 1) : 1
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {/* Tail */}
      <path d="M 28 30 Q 46 18 43 36" stroke="#E65100" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="15" cy="30" rx="13" ry="11" fill="#F57F17"/>
      {/* Mane glow */}
      <circle cx="15" cy="14" r="15" fill="#E65100" opacity="0.35"/>
      {/* Head */}
      <circle cx="15" cy="14" r="12" fill="#F57F17"/>
      {/* Ears */}
      <ellipse cx="6"  cy="4" rx="4" ry="5" fill="#F57F17"/>
      <ellipse cx="24" cy="4" rx="4" ry="5" fill="#F57F17"/>
      <ellipse cx="6"  cy="4" rx="2.5" ry="3" fill="#FF8A65"/>
      <ellipse cx="24" cy="4" rx="2.5" ry="3" fill="#FF8A65"/>
      {/* Eyes */}
      <circle cx="11" cy="13" r="3.2" fill="white"/>
      <circle cx="19" cy="13" r="3.2" fill="white"/>
      <circle cx="12" cy="13" r="1.9" fill="#212121"/>
      <circle cx="20" cy="13" r="1.9" fill="#212121"/>
      <circle cx="12.6" cy="12.3" r="0.7" fill="white"/>
      <circle cx="20.6" cy="12.3" r="0.7" fill="white"/>
      {/* Nose */}
      <ellipse cx="15" cy="18.5" rx="2.5" ry="2" fill="#BF360C"/>
      {/* Smile */}
      <path d="M 12 21 Q 15 24 18 21" stroke="#BF360C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Blush */}
      <ellipse cx="9"  cy="16" rx="2.5" ry="1.5" fill="#FF8A65" opacity="0.5"/>
      <ellipse cx="21" cy="16" rx="2.5" ry="1.5" fill="#FF8A65" opacity="0.5"/>
      {/* Legs animated */}
      <ellipse cx={leg1 ? 9 : 7}  cy="39" rx="4" ry="4" fill="#E65100"/>
      <ellipse cx={leg1 ? 21 : 23} cy="39" rx="4" ry="4" fill="#E65100"/>
    </g>
  )
}

function LunaSVG({ x, y, runFrame, invincible }: { x: number; y: number; runFrame: number; invincible: boolean }) {
  const leg1 = runFrame % 2 === 0
  const opacity = invincible ? (runFrame % 3 === 0 ? 0.25 : 1) : 1
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {/* Long bunny ears */}
      <ellipse cx="10" cy="-8" rx="4" ry="13" fill="#ECEFF1"/>
      <ellipse cx="22" cy="-8" rx="4" ry="13" fill="#ECEFF1"/>
      <ellipse cx="10" cy="-8" rx="2" ry="9"  fill="#FFCDD2"/>
      <ellipse cx="22" cy="-8" rx="2" ry="9"  fill="#FFCDD2"/>
      {/* Body */}
      <ellipse cx="16" cy="30" rx="13" ry="11" fill="#ECEFF1"/>
      {/* Head */}
      <circle cx="16" cy="14" r="12" fill="#ECEFF1"/>
      {/* Eyes */}
      <circle cx="12" cy="13" r="3.2" fill="white"/>
      <circle cx="20" cy="13" r="3.2" fill="white"/>
      <circle cx="13" cy="13" r="2"   fill="#CE93D8"/>
      <circle cx="21" cy="13" r="2"   fill="#CE93D8"/>
      <circle cx="13.6" cy="12.3" r="0.7" fill="white"/>
      <circle cx="21.6" cy="12.3" r="0.7" fill="white"/>
      {/* Nose */}
      <ellipse cx="16" cy="19" rx="2.5" ry="1.8" fill="#F48FB1"/>
      <path d="M 13 21 Q 16 23.5 19 21" stroke="#F48FB1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Blush */}
      <ellipse cx="10" cy="16.5" rx="2.5" ry="1.5" fill="#F48FB1" opacity="0.5"/>
      <ellipse cx="22" cy="16.5" rx="2.5" ry="1.5" fill="#F48FB1" opacity="0.5"/>
      {/* Tail */}
      <circle cx="27" cy="28" r="5" fill="white" opacity="0.8"/>
      {/* Legs */}
      <ellipse cx={leg1 ? 10 : 8}  cy="39" rx="4.5" ry="4" fill="#CFD8DC"/>
      <ellipse cx={leg1 ? 22 : 24} cy="39" rx="4.5" ry="4" fill="#CFD8DC"/>
    </g>
  )
}

function RoxySVG({ x, y, runFrame, invincible }: { x: number; y: number; runFrame: number; invincible: boolean }) {
  const leg1 = runFrame % 2 === 0
  const opacity = invincible ? (runFrame % 3 === 0 ? 0.25 : 1) : 1
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {/* Bushy tail */}
      <ellipse cx="30" cy="28" rx="8" ry="10" fill="#BF360C" opacity="0.7"/>
      <ellipse cx="30" cy="28" rx="4" ry="5"  fill="white" opacity="0.5"/>
      {/* Body */}
      <ellipse cx="15" cy="30" rx="13" ry="11" fill="#E64A19"/>
      {/* Head */}
      <circle cx="15" cy="14" r="12" fill="#E64A19"/>
      {/* Pointy fox ears */}
      <polygon points="6,8 2,-2 11,5"  fill="#E64A19"/>
      <polygon points="24,8 29,-2 20,5" fill="#E64A19"/>
      <polygon points="6,7 3,-1 10,4"  fill="#FFCCBC"/>
      <polygon points="24,7 28,-1 21,4" fill="#FFCCBC"/>
      {/* White face muzzle */}
      <ellipse cx="15" cy="17.5" rx="7" ry="5.5" fill="white" opacity="0.65"/>
      {/* Eyes */}
      <circle cx="11" cy="13" r="3.2" fill="white"/>
      <circle cx="19" cy="13" r="3.2" fill="white"/>
      <circle cx="12" cy="13" r="2"   fill="#1B5E20"/>
      <circle cx="20" cy="13" r="2"   fill="#1B5E20"/>
      <circle cx="12.6" cy="12.3" r="0.7" fill="white"/>
      <circle cx="20.6" cy="12.3" r="0.7" fill="white"/>
      {/* Nose */}
      <ellipse cx="15" cy="18.5" rx="2.5" ry="2" fill="#212121"/>
      <path d="M 12 21 Q 15 23.5 18 21" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <ellipse cx={leg1 ? 9 : 7}  cy="39" rx="4" ry="4" fill="#BF360C"/>
      <ellipse cx={leg1 ? 21 : 23} cy="39" rx="4" ry="4" fill="#BF360C"/>
    </g>
  )
}

function MaxSVG({ x, y, runFrame, invincible }: { x: number; y: number; runFrame: number; invincible: boolean }) {
  const leg1 = runFrame % 2 === 0
  const opacity = invincible ? (runFrame % 3 === 0 ? 0.25 : 1) : 1
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {/* Body (black) */}
      <ellipse cx="16" cy="30" rx="13" ry="12" fill="#212121"/>
      {/* White belly */}
      <ellipse cx="16" cy="30" rx="8" ry="9" fill="white"/>
      {/* Head (black) */}
      <circle cx="16" cy="13" r="12" fill="#212121"/>
      {/* White face */}
      <ellipse cx="16" cy="15" rx="8" ry="9" fill="white"/>
      {/* Eyes */}
      <circle cx="12" cy="12" r="3" fill="white"/>
      <circle cx="20" cy="12" r="3" fill="white"/>
      <circle cx="12.5" cy="12" r="1.8" fill="#212121"/>
      <circle cx="20.5" cy="12" r="1.8" fill="#212121"/>
      <circle cx="13"   cy="11.2" r="0.7" fill="white"/>
      <circle cx="21"   cy="11.2" r="0.7" fill="white"/>
      {/* Yellow beak */}
      <polygon points="12,19 20,19 16,23" fill="#FFD600"/>
      {/* Blush */}
      <ellipse cx="9"  cy="16" rx="2.5" ry="1.5" fill="#FFCDD2" opacity="0.6"/>
      <ellipse cx="23" cy="16" rx="2.5" ry="1.5" fill="#FFCDD2" opacity="0.6"/>
      {/* Flippers */}
      <ellipse cx="3"  cy="25" rx="4" ry="8" fill="#212121" transform="rotate(-15, 3, 25)"/>
      <ellipse cx="29" cy="25" rx="4" ry="8" fill="#212121" transform="rotate(15, 29, 25)"/>
      {/* Feet */}
      <ellipse cx={leg1 ? 11 : 9}  cy="41" rx="5" ry="3.5" fill="#FFD600"/>
      <ellipse cx={leg1 ? 21 : 23} cy="41" rx="5" ry="3.5" fill="#FFD600"/>
    </g>
  )
}

function CharacterSVG({ charId, charY, distance, invincible }: {
  charId: CharacterId
  charY: number
  distance: number
  invincible: boolean
}) {
  const runFrame = Math.floor(distance / 8)
  const x = CHAR_SCREEN_X
  const y = charY - CHAR_H
  const props = { x, y, runFrame, invincible }
  switch (charId) {
    case 'luna': return <LunaSVG {...props}/>
    case 'roxy': return <RoxySVG {...props}/>
    case 'max':  return <MaxSVG  {...props}/>
    default:     return <LioSVG  {...props}/>
  }
}

// ─── Background elements ──────────────────────────────────────

function ForestBg({ distance }: { distance: number }) {
  const offset = (distance * 0.25) % (SCENE_W + 80)
  // Two sets of trees for seamless loop
  const trees = [30, 120, 200, 290, 370, 460]
  return (
    <g>
      {[0, SCENE_W + 80].map(base =>
        trees.map(tx => {
          const sx = tx + base - offset
          if (sx < -60 || sx > SCENE_W + 60) return null
          return (
            <g key={`${base}_${tx}`} transform={`translate(${sx}, 0)`}>
              <rect x="12" y="280" width="8" height="80" rx="3" fill="#5D4037"/>
              <ellipse cx="16" cy="265" rx="22" ry="30" fill="#1B5E20" opacity="0.6"/>
              <ellipse cx="16" cy="250" rx="16" ry="24" fill="#2E7D32" opacity="0.7"/>
            </g>
          )
        })
      )}
      {/* Floating fireflies */}
      {[80, 180, 260, 340].map(fx => {
        const sx = fx - (distance * 0.15) % (SCENE_W + 80)
        return sx > -10 && sx < SCENE_W + 10 ? (
          <circle key={fx} cx={sx} cy={250 + Math.sin(distance / 40 + fx) * 20} r="3" fill="#FFD600" opacity="0.6"/>
        ) : null
      })}
    </g>
  )
}

function SkyBg({ distance }: { distance: number }) {
  const offset = (distance * 0.2) % (SCENE_W + 80)
  const clouds = [20, 110, 220, 320, 420]
  return (
    <g>
      {[0, SCENE_W + 80].map(base =>
        clouds.map(cx => {
          const sx = cx + base - offset
          if (sx < -80 || sx > SCENE_W + 80) return null
          return (
            <g key={`${base}_${cx}`} transform={`translate(${sx}, ${180 + (cx % 3) * 30})`}>
              <ellipse cx="30" cy="0"  rx="30" ry="18" fill="white" opacity="0.55"/>
              <ellipse cx="10" cy="5"  rx="20" ry="14" fill="white" opacity="0.45"/>
              <ellipse cx="50" cy="5"  rx="22" ry="14" fill="white" opacity="0.45"/>
            </g>
          )
        })
      )}
      {/* Rainbow arc */}
      {[150, 450].map(rx => {
        const sx = rx - (distance * 0.1) % 600
        return sx > -150 && sx < SCENE_W + 150 ? (
          <g key={rx} opacity="0.25">
            {['#FF5252','#FF9800','#FFEB3B','#4CAF50','#29B6F6','#7C4DFF'].map((c, i) => (
              <path key={c} d={`M ${sx - 80 + i * 2},${330 - i * 3} Q ${sx},${200 - i * 4} ${sx + 80 - i * 2},${330 - i * 3}`}
                stroke={c} strokeWidth="4" fill="none" opacity="0.8"/>
            ))}
          </g>
        ) : null
      })}
    </g>
  )
}

function SpaceBg({ distance }: { distance: number }) {
  const offset = distance * 0.1
  const stars = [20, 55, 90, 130, 165, 200, 240, 280, 315, 350]
  const bigStars = [40, 140, 250, 340]
  return (
    <g>
      {/* Star field */}
      {[0, 360, 720].map(base =>
        stars.map(sx => {
          const x = (sx + base - offset) % (SCENE_W + 10)
          const y = 50 + (sx * 7 % 300)
          return (
            <circle key={`${base}_${sx}`} cx={x} cy={y} r={1.5}
              fill="white" opacity={0.4 + (sx % 5) * 0.12}/>
          )
        })
      )}
      {/* Twinkling big stars */}
      {bigStars.map(sx => {
        const x = (sx - offset * 0.5) % (SCENE_W + 10)
        const twinkle = 0.5 + Math.abs(Math.sin(distance / 30 + sx)) * 0.5
        return <circle key={sx} cx={x} cy={80 + (sx % 4) * 50} r="3" fill="#FFD700" opacity={twinkle}/>
      })}
      {/* Distant planet */}
      <circle cx={(200 - distance * 0.05) % (SCENE_W + 100)} cy="120" r="28" fill="#7B1FA2" opacity="0.3"/>
      <ellipse cx={(200 - distance * 0.05) % (SCENE_W + 100)} cy="120" rx="44" ry="8"
        fill="none" stroke="#CE93D8" strokeWidth="3" opacity="0.2"/>
    </g>
  )
}

// ─── Ground decoration ────────────────────────────────────────

function GroundDecor({ level, distance }: { level: JumpLevel; distance: number }) {
  if (level.theme === 'space') return null
  const offset = distance % 60
  const spots = [0, 60, 120, 180, 240, 300, 360]
  if (level.theme === 'forest') {
    return (
      <g>
        {spots.map(s => {
          const x = s - offset
          return x > -20 && x < SCENE_W + 20 ? (
            <ellipse key={s} cx={x} cy={GROUND_Y + 6} rx="5" ry="3" fill="#388E3C" opacity="0.4"/>
          ) : null
        })}
      </g>
    )
  }
  return (
    <g>
      {spots.map(s => {
        const x = s - offset
        return x > -20 && x < SCENE_W + 20 ? (
          <rect key={s} x={x - 4} y={GROUND_Y + 3} width="8" height="4" rx="2"
            fill={level.groundColor} opacity="0.5"/>
        ) : null
      })}
    </g>
  )
}

// ─── Obstacle rendering ───────────────────────────────────────

function ObstacleSVG({ type, screenX, width, height, color }: {
  type: string; screenX: number; width: number; height: number; color: string
}) {
  const baseY = GROUND_Y - height
  if (type === 'log') {
    return (
      <g>
        <rect x={screenX} y={baseY} width={width} height={height} rx="6" fill={color}/>
        <rect x={screenX} y={baseY} width={width} height={8} rx="6" fill="rgba(255,255,255,0.2)"/>
        {/* Wood rings */}
        <ellipse cx={screenX + 8} cy={baseY + height / 2} rx="5" ry={height / 2 - 2} fill="none"
          stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"/>
        <ellipse cx={screenX + width - 8} cy={baseY + height / 2} rx="5" ry={height / 2 - 2} fill="none"
          stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"/>
      </g>
    )
  }
  if (type === 'rock') {
    return (
      <g>
        <ellipse cx={screenX + width / 2} cy={GROUND_Y - height / 2} rx={width / 2} ry={height / 2} fill="#78909C"/>
        <ellipse cx={screenX + width / 2} cy={GROUND_Y - height / 2 - 2} rx={width / 2 - 2} ry={height / 2 - 4}
          fill="#90A4AE"/>
        <ellipse cx={screenX + width / 2 - 4} cy={GROUND_Y - height + 6} rx={5} ry={3} fill="rgba(255,255,255,0.25)"/>
      </g>
    )
  }
  if (type === 'cactus') {
    const cx = screenX + width / 2
    return (
      <g fill="#2E7D32">
        {/* Main trunk */}
        <rect x={cx - 6} y={baseY} width={12} height={height} rx="4"/>
        {/* Left arm */}
        <rect x={cx - 16} y={baseY + 15} width={10} height={6} rx="3"/>
        <rect x={cx - 18} y={baseY + 5} width={6} height={16} rx="3"/>
        {/* Right arm */}
        <rect x={cx + 6}  y={baseY + 20} width={10} height={6} rx="3"/>
        <rect x={cx + 12} y={baseY + 10} width={6} height={16} rx="3"/>
        {/* Spine dots */}
        <circle cx={cx} cy={baseY + 8} r="1.5" fill="#A5D6A7"/>
      </g>
    )
  }
  if (type === 'wall') {
    return (
      <g>
        <rect x={screenX} y={baseY} width={width} height={height} rx="2" fill="#546E7A"/>
        {/* Brick pattern */}
        {[0, 1, 2, 3].map(row => (
          <rect key={row} x={screenX + (row % 2 === 0 ? 0 : width / 2)} y={baseY + row * 16}
            width={width / 2 - 1} height={14} rx="1" fill="rgba(255,255,255,0.08)"
            stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
        ))}
      </g>
    )
  }
  return null
}

// ─── Destination building ─────────────────────────────────────

function DestinationSVG({ screenX, emoji, name }: { screenX: number; emoji: string; name: string }) {
  if (screenX > SCENE_W + 20 || screenX < -120) return null
  const groundY = GROUND_Y
  return (
    <g>
      {/* Flag pole */}
      <line x1={screenX + 40} y1={groundY} x2={screenX + 40} y2={groundY - 160}
        stroke="#FFD600" strokeWidth="3"/>
      {/* Flag */}
      <polygon points={`${screenX + 40},${groundY - 160} ${screenX + 75},${groundY - 148} ${screenX + 40},${groundY - 136}`}
        fill="#FF5252"/>
      {/* Base tower */}
      <rect x={screenX + 10} y={groundY - 120} width="60" height="120" rx="4" fill="#546E7A"/>
      <rect x={screenX + 8} y={groundY - 130} width="64" height="18" rx="4" fill="#455A64"/>
      {/* Gate */}
      <path d={`M ${screenX + 25},${groundY} L ${screenX + 25},${groundY - 40} Q ${screenX + 40},${groundY - 55} ${screenX + 55},${groundY - 40} L ${screenX + 55},${groundY}`}
        fill="#263238"/>
      {/* Windows */}
      <rect x={screenX + 16} y={groundY - 95} width="12" height="14" rx="6" fill="#29B6F6" opacity="0.7"/>
      <rect x={screenX + 52} y={groundY - 95} width="12" height="14" rx="6" fill="#29B6F6" opacity="0.7"/>
      {/* Emoji destination */}
      <text x={screenX + 40} y={groundY - 145} fontSize="22" textAnchor="middle">{emoji}</text>
      {/* Name label */}
      <rect x={screenX - 10} y={groundY - 180} width="100" height="22" rx="11"
        fill="rgba(0,0,0,0.5)"/>
      <text x={screenX + 40} y={groundY - 164} fontSize="9" fill="white" textAnchor="middle"
        fontFamily="sans-serif" fontWeight="bold">{name}</text>
    </g>
  )
}

// ─── HUD ─────────────────────────────────────────────────────

function HUD({ hearts, maxHearts, score, distance, trackLength }: {
  hearts: number; maxHearts: number; score: number; distance: number; trackLength: number
}) {
  const progress = Math.min(distance / trackLength, 1)
  return (
    <>
      {/* Top bar */}
      <rect x="0" y="0" width={SCENE_W} height="36" fill="rgba(0,0,0,0.35)"/>
      {/* Hearts */}
      {Array.from({ length: maxHearts }).map((_, i) => (
        <text key={i} x={10 + i * 22} y="24" fontSize="16"
          opacity={i < hearts ? 1 : 0.25}>
          {i < hearts ? '❤️' : '🖤'}
        </text>
      ))}
      {/* Coins */}
      <rect x={SCENE_W - 72} y="8" width="64" height="20" rx="10" fill="rgba(0,0,0,0.4)"/>
      <text x={SCENE_W - 64} y="22" fontSize="12" fill="#FFD600" fontWeight="bold">🪙 {score}</text>
      {/* Progress bar */}
      <rect x="0" y="34" width={SCENE_W} height="4" fill="rgba(0,0,0,0.3)"/>
      <rect x="0" y="34" width={SCENE_W * progress} height="4" fill="#69F0AE"/>
      {/* Lio indicator on progress bar */}
      <text x={SCENE_W * progress - 6} y="32" fontSize="10">🦁</text>
      {/* Destination flag */}
      <text x={SCENE_W - 8} y="32" fontSize="10">🏁</text>
    </>
  )
}

// ─── Main Canvas ──────────────────────────────────────────────

export default function JumpCanvas({
  level,
  charY,
  charId,
  distance,
  hearts,
  maxHearts,
  invincible,
  collectedCoinIds,
  score,
  onJump,
}: JumpCanvasProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl select-none"
      style={{
        background: level.bgGradient,
        aspectRatio: `${SCENE_W} / ${SCENE_H}`,
        maxWidth: '100%',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        border: '2px solid rgba(0,0,0,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }}
      onTouchStart={(e) => { e.preventDefault(); onJump() }}
      onClick={onJump}
      aria-label="Tap pentru a sări"
    >
      <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width="100%" height="100%" aria-hidden>

        {/* ── Background ── */}
        {level.theme === 'forest' && <ForestBg distance={distance}/>}
        {level.theme === 'sky'    && <SkyBg    distance={distance}/>}
        {level.theme === 'space'  && <SpaceBg  distance={distance}/>}

        {/* ── Ground ── */}
        <rect x="0" y={GROUND_Y} width={SCENE_W} height={SCENE_H - GROUND_Y} fill={level.groundColor}/>
        <rect x="0" y={GROUND_Y} width={SCENE_W} height="10" fill={level.groundTopColor}/>
        <GroundDecor level={level} distance={distance}/>

        {/* ── Coins ── */}
        {level.coins.map(coin => {
          if (collectedCoinIds.has(coin.id)) return null
          const sx = coin.x - distance
          if (sx < -20 || sx > SCENE_W + 20) return null
          const cy = GROUND_Y - coin.airY - 10
          return (
            <g key={coin.id}>
              <circle cx={sx + 8} cy={cy} r="9" fill="#FFD54F"/>
              <circle cx={sx + 8} cy={cy} r="6" fill="#FFC107"/>
              <text x={sx + 4.5} y={cy + 4.5} fontSize="7" fill="white" fontWeight="bold">$</text>
            </g>
          )
        })}

        {/* ── Obstacles ── */}
        {level.obstacles.map(obs => {
          const sx = obs.x - distance
          if (sx + obs.width < -10 || sx > SCENE_W + 10) return null
          return (
            <ObstacleSVG
              key={obs.id}
              type={obs.type}
              screenX={sx}
              width={obs.width}
              height={obs.height}
              color={level.obstacleColor}
            />
          )
        })}

        {/* ── Destination ── */}
        <DestinationSVG
          screenX={level.trackLength - distance - 80}
          emoji={level.destinationEmoji}
          name={level.destinationName}
        />

        {/* ── Character ── */}
        <CharacterSVG
          charId={charId}
          charY={charY}
          distance={distance}
          invincible={invincible}
        />

        {/* ── HUD ── */}
        <HUD
          hearts={hearts}
          maxHearts={maxHearts}
          score={score}
          distance={distance}
          trackLength={level.trackLength}
        />

        {/* ── Tap hint (when close to destination) ── */}
        {level.trackLength - distance < 300 && (
          <g>
            <rect x={SCENE_W / 2 - 60} y={SCENE_H / 2 - 22} width="120" height="28" rx="14"
              fill="rgba(255,215,0,0.9)"/>
            <text x={SCENE_W / 2} y={SCENE_H / 2 - 3} fontSize="11" fill="#212121"
              textAnchor="middle" fontWeight="bold">
              Aproape! Continuă! 🏁
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
