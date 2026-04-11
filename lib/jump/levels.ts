// ============================================================
//  PLAYLIO — JUMP WORLD v2  (Lio Runner — Auto-runner)
//  Lio aleargă automat, copilul face tap = sari peste obstacole
//  Fiecare nivel deblochează un bloc în Builder World
// ============================================================

export type ObstacleType = 'log' | 'rock' | 'cactus' | 'wall'
export type LevelTheme = 'forest' | 'sky' | 'space'
export type CharacterId = 'lio' | 'luna' | 'roxy' | 'max'

export interface CharacterDef {
  id: CharacterId
  name: string
  emoji: string
  description: string
  unlockCondition: string  // 'always' | 'complete_world_1' | 'complete_world_2' | 'all_boss_3stars'
}

export const CHARACTERS: CharacterDef[] = [
  { id: 'lio',  name: 'Lio',  emoji: '🦁', description: 'Leul curajos!',   unlockCondition: 'always' },
  { id: 'luna', name: 'Luna', emoji: '🐰', description: 'Iepurașul rapid!', unlockCondition: 'complete_world_1' },
  { id: 'roxy', name: 'Roxy', emoji: '🦊', description: 'Vulpița isteață!', unlockCondition: 'complete_world_2' },
  { id: 'max',  name: 'Max',  emoji: '🐧', description: 'Pinguinul înaripat!', unlockCondition: 'all_boss' },
]

export interface Obstacle {
  id: string
  type: ObstacleType
  x: number      // world position (px from track start)
  width: number  // px
  height: number // px
}

export interface LevelCoin {
  id: string
  x: number    // world position (px)
  airY: number // pixels above ground (0=ground, 60=mid-air, 110=high)
}

export interface JumpLevel {
  id: string
  name: string
  emoji: string
  destinationName: string
  destinationEmoji: string
  bgGradient: string      // CSS gradient for sky
  groundColor: string     // ground fill
  groundTopColor: string  // grass/surface strip
  obstacleColor: string   // obstacle base color
  trackLength: number     // total run distance (px)
  runSpeed: number        // px per ~60fps frame
  obstacles: Obstacle[]
  coins: LevelCoin[]
  builderBlockUnlock?: string
  theme: LevelTheme
  world: 1 | 2 | 3
  worldName: string
  isBoss?: boolean
  characterUnlock?: CharacterId  // unlocked on 3-star
}

// ─── Helpers ─────────────────────────────────────────────────

const DIMS: Record<ObstacleType, [number, number]> = {
  log:    [52, 28],
  rock:   [40, 36],
  cactus: [22, 52],
  wall:   [18, 68],
}

function O(type: ObstacleType, x: number, idx: number): Obstacle {
  const [w, h] = DIMS[type]
  return { id: `o${idx}`, type, x, width: w, height: h }
}

function obstacles(...defs: [ObstacleType, number][]): Obstacle[] {
  return defs.map(([t, x], i) => O(t, x, i))
}

function C(x: number, airY = 0): LevelCoin {
  return { id: `c${x}`, x, airY }
}

// ─── LEVELS ──────────────────────────────────────────────────

export const JUMP_LEVELS: JumpLevel[] = [

  // ═══════════════════════════════════════════════════════════
  //  WORLD 1 — Pădurea Magică
  // ═══════════════════════════════════════════════════════════

  {
    id: 'w1_l1',
    name: 'Drumul Vrăjitoarelor',
    emoji: '🌲',
    destinationName: 'Castelul Pădurii',
    destinationEmoji: '🏰',
    bgGradient: 'linear-gradient(180deg, #B2DFDB 0%, #C8E6C9 60%, #E8F5E9 100%)',
    groundColor: '#388E3C',
    groundTopColor: '#66BB6A',
    obstacleColor: '#5D4037',
    trackLength: 2400,
    runSpeed: 2.5,
    theme: 'forest',
    world: 1,
    worldName: '🌲 Pădurea Magică',
    builderBlockUnlock: 'enchanted',
    obstacles: obstacles(
      ['log',    400],
      ['rock',   630],
      ['log',    880],
      ['rock',  1090],
      ['cactus',1320],
      ['log',   1540],
      ['rock',  1760],
      ['log',   1990],
      ['cactus',2220],
    ),
    coins: [
      C(200), C(310), C(500, 60), C(660), C(760, 60),
      C(1000), C(1140, 60), C(1390), C(1460, 110),
      C(1680), C(1860, 60), C(2090), C(2320),
    ],
  },

  {
    id: 'w1_l2',
    name: 'Poiana Stelelor',
    emoji: '🌿',
    destinationName: 'Poiana Magică',
    destinationEmoji: '⭐',
    bgGradient: 'linear-gradient(180deg, #A5D6A7 0%, #C8E6C9 60%, #E8F5E9 100%)',
    groundColor: '#2E7D32',
    groundTopColor: '#4CAF50',
    obstacleColor: '#4E342E',
    trackLength: 2600,
    runSpeed: 2.5,
    theme: 'forest',
    world: 1,
    worldName: '🌲 Pădurea Magică',
    builderBlockUnlock: 'oak_tree',
    obstacles: obstacles(
      ['rock',   360],
      ['log',    570],
      ['rock',   780],
      ['cactus', 1010],
      ['log',    1210],
      ['rock',   1390],
      ['log',    1560],
      ['cactus', 1770],
      ['rock',   1970],
      ['log',    2200],
      ['cactus', 2420],
    ),
    coins: [
      C(200), C(330, 60), C(490), C(670), C(870, 110),
      C(1100), C(1280, 60), C(1460), C(1630, 60),
      C(1850), C(2060, 110), C(2280), C(2500),
    ],
  },

  {
    id: 'w1_boss',
    name: 'Muntele de Foc',
    emoji: '🌋',
    destinationName: 'Vârful Vulcanului',
    destinationEmoji: '🌋',
    bgGradient: 'linear-gradient(180deg, #795548 0%, #BCAAA4 60%, #D7CCC8 100%)',
    groundColor: '#4E342E',
    groundTopColor: '#6D4C41',
    obstacleColor: '#BF360C',
    trackLength: 3000,
    runSpeed: 3,
    theme: 'forest',
    world: 1,
    worldName: '🌲 Pădurea Magică',
    isBoss: true,
    builderBlockUnlock: 'lava',
    characterUnlock: 'luna',
    obstacles: obstacles(
      ['log',    300],
      ['cactus', 480],
      ['rock',   660],
      ['log',    840],
      ['rock',   990],
      ['cactus', 1170],
      ['log',    1340],
      ['rock',   1510],
      ['cactus', 1690],
      ['wall',   1870],
      ['log',    2050],
      ['rock',   2220],
      ['cactus', 2400],
      ['log',    2570],
      ['wall',   2760],
    ),
    coins: [
      C(170), C(270, 60), C(420), C(570, 110), C(740),
      C(910, 60), C(1080), C(1250, 110), C(1420),
      C(1600, 60), C(1780), C(1960, 110), C(2130),
      C(2300, 60), C(2480), C(2660, 110), C(2830),
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  WORLD 2 — Tărâmul Cerului
  // ═══════════════════════════════════════════════════════════

  {
    id: 'w2_l1',
    name: 'Norii de Cristal',
    emoji: '☁️',
    destinationName: 'Palatul Norilor',
    destinationEmoji: '🏯',
    bgGradient: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 60%, #E1F5FE 100%)',
    groundColor: '#0277BD',
    groundTopColor: '#29B6F6',
    obstacleColor: '#78909C',
    trackLength: 2600,
    runSpeed: 3,
    theme: 'sky',
    world: 2,
    worldName: '☁️ Tărâmul Cerului',
    builderBlockUnlock: 'cloud',
    obstacles: obstacles(
      ['rock',   380],
      ['log',    600],
      ['rock',   830],
      ['cactus', 1060],
      ['log',    1270],
      ['rock',   1470],
      ['log',    1650],
      ['cactus', 1870],
      ['rock',   2080],
      ['log',    2290],
      ['cactus', 2480],
    ),
    coins: [
      C(210), C(360, 60), C(530), C(730, 110), C(950),
      C(1140, 60), C(1350), C(1550, 110), C(1740),
      C(1960, 60), C(2170), C(2380, 110),
    ],
  },

  {
    id: 'w2_l2',
    name: 'Curcubeul Magic',
    emoji: '🌈',
    destinationName: 'Grota Cristalelor',
    destinationEmoji: '🌈',
    bgGradient: 'linear-gradient(180deg, #CE93D8 0%, #80DEEA 60%, #B2EBF2 100%)',
    groundColor: '#7B1FA2',
    groundTopColor: '#AB47BC',
    obstacleColor: '#6A1B9A',
    trackLength: 2800,
    runSpeed: 3,
    theme: 'sky',
    world: 2,
    worldName: '☁️ Tărâmul Cerului',
    builderBlockUnlock: 'crystal',
    obstacles: obstacles(
      ['rock',   340],
      ['log',    540],
      ['cactus', 740],
      ['rock',   960],
      ['log',    1150],
      ['rock',   1330],
      ['cactus', 1510],
      ['log',    1700],
      ['rock',   1880],
      ['wall',   2060],
      ['cactus', 2260],
      ['log',    2460],
      ['rock',   2660],
    ),
    coins: [
      C(190), C(340, 60), C(520), C(680, 110), C(860),
      C(1040, 60), C(1220), C(1420, 110), C(1600),
      C(1790, 60), C(1990), C(2150, 110), C(2360),
      C(2560, 60), C(2750),
    ],
  },

  {
    id: 'w2_boss',
    name: 'Furtuna de Sus',
    emoji: '⛈️',
    destinationName: 'Stația Spațială',
    destinationEmoji: '🚀',
    bgGradient: 'linear-gradient(180deg, #37474F 0%, #546E7A 60%, #78909C 100%)',
    groundColor: '#263238',
    groundTopColor: '#37474F',
    obstacleColor: '#455A64',
    trackLength: 3200,
    runSpeed: 3.5,
    theme: 'sky',
    world: 2,
    worldName: '☁️ Tărâmul Cerului',
    isBoss: true,
    builderBlockUnlock: 'star_dust',
    characterUnlock: 'roxy',
    obstacles: obstacles(
      ['log',    290],
      ['cactus', 460],
      ['rock',   630],
      ['log',    800],
      ['wall',   970],
      ['rock',   1150],
      ['cactus', 1320],
      ['log',    1490],
      ['rock',   1660],
      ['cactus', 1830],
      ['wall',   2020],
      ['log',    2190],
      ['rock',   2360],
      ['cactus', 2540],
      ['log',    2710],
      ['wall',   2900],
    ),
    coins: [
      C(160), C(250, 60), C(400), C(560, 110), C(730),
      C(890, 60), C(1060), C(1220, 110), C(1400),
      C(1560, 60), C(1740), C(1920, 110), C(2100),
      C(2270, 60), C(2450), C(2630, 110), C(2820),
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  WORLD 3 — Spațiul Cosmic
  // ═══════════════════════════════════════════════════════════

  {
    id: 'w3_l1',
    name: 'Galaxia Stelelor',
    emoji: '🚀',
    destinationName: 'Luna',
    destinationEmoji: '🌕',
    bgGradient: 'linear-gradient(180deg, #0D0D2B 0%, #1A237E 60%, #283593 100%)',
    groundColor: '#311B92',
    groundTopColor: '#4527A0',
    obstacleColor: '#4527A0',
    trackLength: 2800,
    runSpeed: 3.5,
    theme: 'space',
    world: 3,
    worldName: '🚀 Spațiul Cosmic',
    builderBlockUnlock: 'moon',
    obstacles: obstacles(
      ['rock',   360],
      ['log',    570],
      ['rock',   790],
      ['cactus', 1020],
      ['log',    1230],
      ['wall',   1420],
      ['cactus', 1620],
      ['rock',   1820],
      ['log',    2020],
      ['cactus', 2220],
      ['rock',   2440],
      ['log',    2640],
    ),
    coins: [
      C(200), C(340, 60), C(510), C(700, 110), C(890),
      C(1080, 60), C(1300), C(1510, 110), C(1710),
      C(1910, 60), C(2110), C(2320, 110), C(2540),
    ],
  },

  {
    id: 'w3_l2',
    name: 'Baza Lunară',
    emoji: '🌕',
    destinationName: 'Inelele lui Saturn',
    destinationEmoji: '🪐',
    bgGradient: 'linear-gradient(180deg, #1A237E 0%, #283593 60%, #3949AB 100%)',
    groundColor: '#1A237E',
    groundTopColor: '#283593',
    obstacleColor: '#3949AB',
    trackLength: 3000,
    runSpeed: 3.5,
    theme: 'space',
    world: 3,
    worldName: '🚀 Spațiul Cosmic',
    builderBlockUnlock: 'portal',
    obstacles: obstacles(
      ['rock',   320],
      ['log',    510],
      ['cactus', 690],
      ['rock',   880],
      ['log',    1060],
      ['wall',   1240],
      ['rock',   1420],
      ['cactus', 1600],
      ['log',    1780],
      ['rock',   1960],
      ['wall',   2150],
      ['cactus', 2330],
      ['log',    2520],
      ['rock',   2710],
    ),
    coins: [
      C(180), C(310, 60), C(470), C(640, 110), C(810),
      C(990, 60), C(1160), C(1360, 110), C(1540),
      C(1730, 60), C(1910), C(2090, 110), C(2290),
      C(2470, 60), C(2660), C(2870, 110),
    ],
  },

  {
    id: 'w3_boss',
    name: 'Galaxia Finală',
    emoji: '🌌',
    destinationName: 'Diamantul Galactic',
    destinationEmoji: '💎',
    bgGradient: 'linear-gradient(180deg, #000051 0%, #0D0D2B 60%, #1A0533 100%)',
    groundColor: '#000028',
    groundTopColor: '#0D0D4B',
    obstacleColor: '#311B92',
    trackLength: 3400,
    runSpeed: 4,
    theme: 'space',
    world: 3,
    worldName: '🚀 Spațiul Cosmic',
    isBoss: true,
    builderBlockUnlock: 'diamond',
    characterUnlock: 'max',
    obstacles: obstacles(
      ['log',    270],
      ['cactus', 430],
      ['rock',   590],
      ['log',    760],
      ['wall',   930],
      ['rock',   1100],
      ['cactus', 1270],
      ['log',    1440],
      ['wall',   1620],
      ['rock',   1790],
      ['cactus', 1960],
      ['log',    2140],
      ['rock',   2310],
      ['wall',   2490],
      ['cactus', 2670],
      ['log',    2840],
      ['rock',   3020],
      ['wall',   3210],
    ),
    coins: [
      C(150), C(240, 60), C(380), C(530, 110), C(690),
      C(840, 60), C(1010), C(1180, 110), C(1350),
      C(1520, 60), C(1700), C(1880, 110), C(2050),
      C(2230, 60), C(2400), C(2580, 110), C(2760),
      C(2940, 60), C(3130), C(3320, 110),
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────

export function getLevelById(id: string): JumpLevel | undefined {
  return JUMP_LEVELS.find(l => l.id === id)
}

/** Stars based on hearts remaining at finish */
export function calculateStars(heartsLeft: number, reached: boolean): number {
  if (!reached) return 0
  if (heartsLeft >= 3) return 3
  if (heartsLeft >= 2) return 2
  if (heartsLeft >= 1) return 1
  return 0
}

export function getMaxHearts(childAge: number): number {
  if (childAge <= 5) return 5
  if (childAge <= 8) return 3
  return 2
}
