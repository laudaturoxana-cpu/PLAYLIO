// Jump World — definițiile nivelurilor platformer

export interface Platform {
  x: number    // % din lățimea scenei
  y: number    // % din înălțimea scenei (0 = sus, 100 = jos)
  width: number // % din lățimea scenei
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
  starThresholds: [number, number, number]  // coins pentru 1⭐, 2⭐, 3⭐
  timeLimit: number   // secunde
  theme: 'forest' | 'sky' | 'cave' | 'space'
}

export const JUMP_LEVELS: JumpLevel[] = [
  {
    id: 'level_1',
    name: 'Pădurea Săriturii',
    emoji: '🌿',
    bgGradient: 'linear-gradient(180deg, #B2EBF2 0%, #E8F5E9 100%)',
    groundColor: '#4CAF50',
    theme: 'forest',
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
      { x: 0,   y: 88, width: 100, isGround: true },  // sol
      { x: 10,  y: 68, width: 20 },
      { x: 35,  y: 53, width: 20 },
      { x: 58,  y: 68, width: 22 },
      { x: 75,  y: 53, width: 20 },
      { x: 20,  y: 38, width: 18 },
      { x: 55,  y: 38, width: 20 },
    ],
  },
  {
    id: 'level_2',
    name: 'Cerul Curcubeului',
    emoji: '🌈',
    bgGradient: 'linear-gradient(180deg, #CE93D8 0%, #80DEEA 100%)',
    groundColor: '#7B1FA2',
    theme: 'sky',
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
    id: 'level_3',
    name: 'Galaxia Stelelor',
    emoji: '🚀',
    bgGradient: 'linear-gradient(180deg, #0D0D2B 0%, #1A237E 100%)',
    groundColor: '#311B92',
    theme: 'space',
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
