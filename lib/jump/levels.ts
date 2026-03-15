// Jump World — platformer level definitions

export interface Platform {
  x: number    // % of scene width
  y: number    // % of scene height (0 = top, 100 = bottom)
  width: number // % of scene width
  isGround?: boolean
  isMoving?: boolean
  moveRange?: number  // px oscillation
  speed?: number      // px/frame
}

export interface Coin {
  x: number
  y: number
  id: string
}

export interface JumpLevel {
  id: string
  name: string
  emoji: string
  bgGradient: string
  groundColor: string
  platforms: Platform[]
  coins: Coin[]
  starThresholds: [number, number, number]  // coins for 1⭐, 2⭐, 3⭐
  timeLimit: number   // seconds
  theme: 'forest' | 'sky' | 'cave' | 'space'
  world: 1 | 2 | 3
  worldName: string
  isBoss?: boolean
}

export const JUMP_LEVELS: JumpLevel[] = [
  // ─── WORLD 1: Forest World ───────────────────────────────────────────────────
  {
    id: 'level_1',
    name: 'Jump Forest',
    emoji: '🌿',
    bgGradient: 'linear-gradient(180deg, #B2EBF2 0%, #E8F5E9 100%)',
    groundColor: '#4CAF50',
    theme: 'forest',
    world: 1,
    worldName: 'Forest World',
    timeLimit: 45,
    starThresholds: [3, 5, 8],
    coins: [
      { id: 'c1',  x: 25, y: 62 },
      { id: 'c2',  x: 38, y: 47 },
      { id: 'c3',  x: 52, y: 62 },
      { id: 'c4',  x: 65, y: 47 },
      { id: 'c5',  x: 15, y: 47 },
      { id: 'c6',  x: 78, y: 62 },
      { id: 'c7',  x: 45, y: 30 },
      { id: 'c8',  x: 85, y: 47 },
      { id: 'c9',  x: 32, y: 30 },
      { id: 'c10', x: 60, y: 30 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },  // ground
      { x: 10,  y: 68, width: 20 },
      { x: 35,  y: 53, width: 20 },
      { x: 58,  y: 68, width: 22 },
      { x: 75,  y: 53, width: 20 },
      { x: 20,  y: 38, width: 18 },
      { x: 55,  y: 38, width: 20 },
    ],
  },
  {
    id: 'level_2_forest',
    name: 'Enchanted Forest',
    emoji: '🌲',
    bgGradient: 'linear-gradient(180deg, #A5D6A7 0%, #E8F5E9 100%)',
    groundColor: '#2E7D32',
    theme: 'forest',
    world: 1,
    worldName: 'Forest World',
    timeLimit: 50,
    starThresholds: [4, 7, 10],
    coins: [
      { id: 'c1',  x: 18, y: 62 },
      { id: 'c2',  x: 30, y: 62 },
      { id: 'c3',  x: 42, y: 47 },
      { id: 'c4',  x: 55, y: 47 },
      { id: 'c5',  x: 68, y: 62 },
      { id: 'c6',  x: 80, y: 47 },
      { id: 'c7',  x: 12, y: 47 },
      { id: 'c8',  x: 25, y: 33 },
      { id: 'c9',  x: 50, y: 33 },
      { id: 'c10', x: 72, y: 33 },
      { id: 'c11', x: 38, y: 20 },
      { id: 'c12', x: 62, y: 20 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 8,   y: 70, width: 18 },
      { x: 30,  y: 55, width: 16 },
      { x: 52,  y: 70, width: 18 },
      { x: 70,  y: 55, width: 18 },
      { x: 15,  y: 40, width: 16 },
      { x: 42,  y: 40, width: 16, isMoving: true, moveRange: 70, speed: 1.1 },
      { x: 65,  y: 40, width: 16 },
      { x: 30,  y: 25, width: 20 },
    ],
  },
  {
    id: 'level_3_boss',
    name: '🔥 Forest Boss',
    emoji: '🐲',
    bgGradient: 'linear-gradient(180deg, #795548 0%, #BCAAA4 100%)',
    groundColor: '#4E342E',
    theme: 'forest',
    world: 1,
    worldName: 'Forest World',
    isBoss: true,
    timeLimit: 60,
    starThresholds: [6, 9, 12],
    coins: [
      { id: 'c1',  x: 15, y: 65 },
      { id: 'c2',  x: 28, y: 65 },
      { id: 'c3',  x: 42, y: 50 },
      { id: 'c4',  x: 55, y: 65 },
      { id: 'c5',  x: 68, y: 50 },
      { id: 'c6',  x: 80, y: 65 },
      { id: 'c7',  x: 10, y: 50 },
      { id: 'c8',  x: 35, y: 36 },
      { id: 'c9',  x: 58, y: 36 },
      { id: 'c10', x: 78, y: 36 },
      { id: 'c11', x: 22, y: 22 },
      { id: 'c12', x: 45, y: 22 },
      { id: 'c13', x: 67, y: 22 },
      { id: 'c14', x: 50, y: 15 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 5,   y: 72, width: 16 },
      { x: 28,  y: 57, width: 14 },
      { x: 50,  y: 72, width: 16 },
      { x: 72,  y: 57, width: 14 },
      { x: 15,  y: 43, width: 14, isMoving: true, moveRange: 60, speed: 1.3 },
      { x: 48,  y: 43, width: 14 },
      { x: 70,  y: 43, width: 14, isMoving: true, moveRange: 50, speed: 1.1 },
      { x: 30,  y: 28, width: 18 },
      { x: 58,  y: 28, width: 16 },
    ],
  },

  // ─── WORLD 2: Sky World ───────────────────────────────────────────────────────
  {
    id: 'level_2',
    name: 'Rainbow Sky',
    emoji: '🌈',
    bgGradient: 'linear-gradient(180deg, #CE93D8 0%, #80DEEA 100%)',
    groundColor: '#7B1FA2',
    theme: 'sky',
    world: 2,
    worldName: 'Sky World',
    timeLimit: 50,
    starThresholds: [4, 6, 9],
    coins: [
      { id: 'c1', x: 20, y: 60 },
      { id: 'c2', x: 35, y: 45 },
      { id: 'c3', x: 50, y: 60 },
      { id: 'c4', x: 65, y: 45 },
      { id: 'c5', x: 80, y: 60 },
      { id: 'c6', x: 12, y: 45 },
      { id: 'c7', x: 42, y: 30 },
      { id: 'c8', x: 72, y: 30 },
      { id: 'c9', x: 28, y: 30 },
      { id: 'c10',x: 57, y: 18 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 8,   y: 68, width: 18 },
      { x: 30,  y: 52, width: 16 },
      { x: 55,  y: 67, width: 18 },
      { x: 72,  y: 52, width: 18 },
      { x: 18,  y: 37, width: 18, isMoving: true, moveRange: 80, speed: 1.2 },
      { x: 55,  y: 37, width: 18 },
      { x: 40,  y: 22, width: 16 },
    ],
  },
  {
    id: 'level_5_sky',
    name: 'Cloud Kingdom',
    emoji: '☁️',
    bgGradient: 'linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 100%)',
    groundColor: '#0277BD',
    theme: 'sky',
    world: 2,
    worldName: 'Sky World',
    timeLimit: 55,
    starThresholds: [5, 8, 11],
    coins: [
      { id: 'c1',  x: 18, y: 63 },
      { id: 'c2',  x: 32, y: 63 },
      { id: 'c3',  x: 46, y: 48 },
      { id: 'c4',  x: 60, y: 48 },
      { id: 'c5',  x: 74, y: 63 },
      { id: 'c6',  x: 85, y: 48 },
      { id: 'c7',  x: 10, y: 48 },
      { id: 'c8',  x: 25, y: 34 },
      { id: 'c9',  x: 50, y: 34 },
      { id: 'c10', x: 72, y: 34 },
      { id: 'c11', x: 38, y: 20 },
      { id: 'c12', x: 60, y: 20 },
      { id: 'c13', x: 82, y: 20 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 6,   y: 70, width: 18 },
      { x: 28,  y: 55, width: 16 },
      { x: 50,  y: 70, width: 18 },
      { x: 72,  y: 55, width: 16 },
      { x: 14,  y: 41, width: 16, isMoving: true, moveRange: 75, speed: 1.2 },
      { x: 45,  y: 41, width: 16 },
      { x: 68,  y: 41, width: 16 },
      { x: 32,  y: 26, width: 18 },
    ],
  },
  {
    id: 'level_6_boss',
    name: '⚡ Sky Boss',
    emoji: '⛈️',
    bgGradient: 'linear-gradient(180deg, #37474F 0%, #78909C 100%)',
    groundColor: '#263238',
    theme: 'sky',
    world: 2,
    worldName: 'Sky World',
    isBoss: true,
    timeLimit: 65,
    starThresholds: [7, 10, 13],
    coins: [
      { id: 'c1',  x: 14, y: 65 },
      { id: 'c2',  x: 26, y: 65 },
      { id: 'c3',  x: 40, y: 50 },
      { id: 'c4',  x: 54, y: 50 },
      { id: 'c5',  x: 68, y: 65 },
      { id: 'c6',  x: 80, y: 50 },
      { id: 'c7',  x: 8,  y: 50 },
      { id: 'c8',  x: 22, y: 36 },
      { id: 'c9',  x: 38, y: 36 },
      { id: 'c10', x: 55, y: 36 },
      { id: 'c11', x: 72, y: 36 },
      { id: 'c12', x: 30, y: 22 },
      { id: 'c13', x: 50, y: 22 },
      { id: 'c14', x: 68, y: 22 },
      { id: 'c15', x: 44, y: 15 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 5,   y: 72, width: 15 },
      { x: 26,  y: 57, width: 14 },
      { x: 48,  y: 72, width: 15 },
      { x: 70,  y: 57, width: 15 },
      { x: 12,  y: 43, width: 14, isMoving: true, moveRange: 65, speed: 1.4 },
      { x: 40,  y: 43, width: 14 },
      { x: 64,  y: 43, width: 14, isMoving: true, moveRange: 55, speed: 1.2 },
      { x: 22,  y: 29, width: 16 },
      { x: 50,  y: 29, width: 16 },
      { x: 36,  y: 18, width: 18 },
    ],
  },

  // ─── WORLD 3: Space World ─────────────────────────────────────────────────────
  {
    id: 'level_3',
    name: 'Star Galaxy',
    emoji: '🚀',
    bgGradient: 'linear-gradient(180deg, #0D0D2B 0%, #1A237E 100%)',
    groundColor: '#311B92',
    theme: 'space',
    world: 3,
    worldName: 'Space World',
    timeLimit: 60,
    starThresholds: [5, 8, 10],
    coins: [
      { id: 'c1',  x: 18, y: 60 },
      { id: 'c2',  x: 35, y: 45 },
      { id: 'c3',  x: 52, y: 60 },
      { id: 'c4',  x: 70, y: 45 },
      { id: 'c5',  x: 85, y: 60 },
      { id: 'c6',  x: 10, y: 45 },
      { id: 'c7',  x: 28, y: 30 },
      { id: 'c8',  x: 60, y: 30 },
      { id: 'c9',  x: 78, y: 30 },
      { id: 'c10', x: 44, y: 17 },
    ],
    platforms: [
      { x: 0,  y: 88, width: 100, isGround: true },
      { x: 5,  y: 68, width: 15 },
      { x: 28, y: 53, width: 14 },
      { x: 50, y: 68, width: 15 },
      { x: 72, y: 53, width: 15 },
      { x: 15, y: 38, width: 14, isMoving: true, moveRange: 60, speed: 1.5 },
      { x: 52, y: 38, width: 14, isMoving: true, moveRange: 50, speed: 1.2 },
      { x: 35, y: 22, width: 16 },
    ],
  },
  {
    id: 'level_8_space',
    name: 'Moon Base',
    emoji: '🌕',
    bgGradient: 'linear-gradient(180deg, #1A237E 0%, #283593 100%)',
    groundColor: '#283593',
    theme: 'space',
    world: 3,
    worldName: 'Space World',
    timeLimit: 65,
    starThresholds: [6, 9, 12],
    coins: [
      { id: 'c1',  x: 16, y: 63 },
      { id: 'c2',  x: 30, y: 63 },
      { id: 'c3',  x: 44, y: 48 },
      { id: 'c4',  x: 58, y: 48 },
      { id: 'c5',  x: 72, y: 63 },
      { id: 'c6',  x: 84, y: 48 },
      { id: 'c7',  x: 8,  y: 48 },
      { id: 'c8',  x: 22, y: 34 },
      { id: 'c9',  x: 46, y: 34 },
      { id: 'c10', x: 68, y: 34 },
      { id: 'c11', x: 32, y: 20 },
      { id: 'c12', x: 56, y: 20 },
      { id: 'c13', x: 78, y: 20 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 6,   y: 70, width: 16 },
      { x: 26,  y: 55, width: 14 },
      { x: 48,  y: 70, width: 16 },
      { x: 70,  y: 55, width: 14 },
      { x: 14,  y: 41, width: 14, isMoving: true, moveRange: 65, speed: 1.4 },
      { x: 44,  y: 41, width: 14 },
      { x: 66,  y: 41, width: 14, isMoving: true, moveRange: 55, speed: 1.3 },
      { x: 28,  y: 27, width: 16 },
      { x: 54,  y: 27, width: 16 },
    ],
  },
  {
    id: 'level_9_boss',
    name: '🚀 Galaxy Boss',
    emoji: '🌌',
    bgGradient: 'linear-gradient(180deg, #000051 0%, #1A0533 100%)',
    groundColor: '#000028',
    theme: 'space',
    world: 3,
    worldName: 'Space World',
    isBoss: true,
    timeLimit: 75,
    starThresholds: [8, 11, 14],
    coins: [
      { id: 'c1',  x: 12, y: 65 },
      { id: 'c2',  x: 24, y: 65 },
      { id: 'c3',  x: 38, y: 50 },
      { id: 'c4',  x: 52, y: 65 },
      { id: 'c5',  x: 65, y: 50 },
      { id: 'c6',  x: 78, y: 65 },
      { id: 'c7',  x: 8,  y: 50 },
      { id: 'c8',  x: 20, y: 36 },
      { id: 'c9',  x: 36, y: 36 },
      { id: 'c10', x: 52, y: 36 },
      { id: 'c11', x: 68, y: 36 },
      { id: 'c12', x: 82, y: 36 },
      { id: 'c13', x: 28, y: 22 },
      { id: 'c14', x: 48, y: 22 },
      { id: 'c15', x: 68, y: 22 },
      { id: 'c16', x: 44, y: 15 },
    ],
    platforms: [
      { x: 0,   y: 88, width: 100, isGround: true },
      { x: 5,   y: 72, width: 14 },
      { x: 24,  y: 57, width: 13 },
      { x: 44,  y: 72, width: 14 },
      { x: 65,  y: 57, width: 13 },
      { x: 84,  y: 72, width: 13 },
      { x: 10,  y: 43, width: 13, isMoving: true, moveRange: 70, speed: 1.5 },
      { x: 36,  y: 43, width: 13 },
      { x: 58,  y: 43, width: 13, isMoving: true, moveRange: 60, speed: 1.4 },
      { x: 78,  y: 43, width: 13, isMoving: true, moveRange: 45, speed: 1.2 },
      { x: 22,  y: 29, width: 15 },
      { x: 48,  y: 29, width: 15 },
      { x: 36,  y: 18, width: 17 },
    ],
  },
]

export function getLevelById(id: string): JumpLevel | undefined {
  return JUMP_LEVELS.find(l => l.id === id)
}

export function calculateStars(coins: number, thresholds: [number, number, number]): number {
  if (coins >= thresholds[2]) return 3
  if (coins >= thresholds[1]) return 2
  if (coins >= thresholds[0]) return 1
  return 0
}
