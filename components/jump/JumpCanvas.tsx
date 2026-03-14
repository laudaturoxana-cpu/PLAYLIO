'use client'

import type { JumpLevel } from '@/lib/jump/levels'
import type { CharState, MovingPlatformState } from '@/lib/jump/useJumpGame'
import { SCENE_W, SCENE_H } from '@/lib/jump/useJumpGame'

interface JumpCanvasProps {
  level: JumpLevel
  char: CharState
  collectedCoinIds: Set<string>
  movingPlatforms: MovingPlatformState[]
  timeLeft: number
  score: number
  stars: number
  totalCoins: number
}

export default function JumpCanvas({
  level,
  char,
  collectedCoinIds,
  movingPlatforms,
  timeLeft,
  score,
  stars,
  totalCoins,
}: JumpCanvasProps) {
  const isDark = level.theme === 'space'
  const textColor = isDark ? 'white' : 'var(--dark)'

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-black/08 shadow-md select-none"
      style={{
        background: level.bgGradient,
        aspectRatio: `${SCENE_W} / ${SCENE_H}`,
        maxWidth: '100%',
        touchAction: 'none',
        WebkitUserSelect: 'none',
      }}
      aria-label={`Platformer — ${level.name}`}
    >
      {/* SVG scenă */}
      <svg
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {/* Platforme */}
        {level.platforms.map((p, i) => {
          const px = p.isMoving && movingPlatforms[i]
            ? movingPlatforms[i].x
            : (p.x / 100) * SCENE_W
          const py = (p.y / 100) * SCENE_H
          const pw = (p.width / 100) * SCENE_W
          const ph = p.isGround ? 20 : 14

          return (
            <g key={i}>
              <rect
                x={px}
                y={py}
                width={pw}
                height={ph}
                rx={p.isGround ? 0 : 6}
                fill={level.groundColor}
                opacity={p.isGround ? 1 : 0.9}
              />
              {/* Iarbă / textură pe platfomă */}
              {!p.isGround && (
                <rect
                  x={px}
                  y={py}
                  width={pw}
                  height={4}
                  rx={6}
                  fill="rgba(255,255,255,0.3)"
                />
              )}
            </g>
          )
        })}

        {/* Monede */}
        {level.coins.map(coin => {
          if (collectedCoinIds.has(coin.id)) return null
          const cx = (coin.x / 100) * SCENE_W
          const cy = (coin.y / 100) * SCENE_H
          return (
            <g key={coin.id}>
              <circle cx={cx + 8} cy={cy + 8} r={8} fill="#FFD54F" />
              <circle cx={cx + 8} cy={cy + 8} r={5} fill="#FFC107" />
              <text x={cx + 5} y={cy + 12} fontSize="8" fill="white" fontWeight="bold">$</text>
            </g>
          )
        })}

        {/* Personaj */}
        <g transform={`translate(${char.pos.x}, ${char.pos.y}) scale(${char.facing === 'left' ? -1 : 1}, 1) translate(${char.facing === 'left' ? -32 : 0}, 0)`}>
          {/* Corp */}
          <ellipse cx="16" cy="26" rx="12" ry="10" fill="var(--sky)" />
          {/* Cap */}
          <circle cx="16" cy="14" r="11" fill="var(--sky)" />
          {/* Urechi */}
          <ellipse cx="9" cy="6" rx="4" ry="5" fill="var(--sky)" />
          <ellipse cx="23" cy="6" rx="4" ry="5" fill="var(--sky)" />
          <ellipse cx="9" cy="6" rx="2.5" ry="3.5" fill="var(--coral)" opacity="0.7" />
          <ellipse cx="23" cy="6" rx="2.5" ry="3.5" fill="var(--coral)" opacity="0.7" />
          {/* Ochi */}
          <circle cx="13" cy="13" r="3" fill="white" />
          <circle cx="19" cy="13" r="3" fill="white" />
          <circle cx="14" cy="13" r="1.8" fill="#212121" />
          <circle cx="20" cy="13" r="1.8" fill="#212121" />
          <circle cx="14.5" cy="12.2" r="0.7" fill="white" />
          <circle cx="20.5" cy="12.2" r="0.7" fill="white" />
          {/* Gură zâmbet */}
          <path d="M 12 18 Q 16 21 20 18" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Obraz */}
          <ellipse cx="10" cy="16" rx="2.5" ry="1.5" fill="var(--pink)" opacity="0.5" />
          <ellipse cx="22" cy="16" rx="2.5" ry="1.5" fill="var(--pink)" opacity="0.5" />
          {/* Picioare animate */}
          <ellipse cx={char.onGround ? "10" : "8"} cy="33" rx="4" ry="3" fill="var(--sky-dark)" />
          <ellipse cx={char.onGround ? "22" : "24"} cy="33" rx="4" ry="3" fill="var(--sky-dark)" />
        </g>

        {/* HUD intern — Time și score */}
        <rect x="8" y="8" width="80" height="22" rx="11" fill="rgba(0,0,0,0.3)" />
        <text x="16" y="23" fontSize="12" fill="white" fontWeight="bold">
          ⏱ {timeLeft}s
        </text>
        <rect x={SCENE_W - 88} y="8" width="80" height="22" rx="11" fill="rgba(0,0,0,0.3)" />
        <text x={SCENE_W - 80} y="23" fontSize="12" fill="white" fontWeight="bold">
          🪙 {score}/{totalCoins}
        </text>
      </svg>

      {/* Stars indicator overlay */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
        {[1, 2, 3].map(s => (
          <span
            key={s}
            className="text-sm"
            style={{
              opacity: s <= stars ? 1 : 0.3,
              filter: s <= stars ? 'drop-shadow(0 0 4px gold)' : 'grayscale(1)',
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    </div>
  )
}
