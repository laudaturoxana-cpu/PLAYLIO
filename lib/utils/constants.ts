export const APP_NAME = 'Playlio'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://playlio.fun'

/* ===== LUMI ===== */
export const WORLDS = ['adventure', 'builder', 'learning', 'jump'] as const
export type World = (typeof WORLDS)[number]

export const WORLD_LABELS: Record<World, string> = {
  adventure: 'Adventure World',
  builder: 'Builder World',
  learning: 'Learning World',
  jump: 'Jump World',
}

export const WORLD_ICONS: Record<World, string> = {
  adventure: '🗺️',
  builder: '🏗️',
  learning: '📚',
  jump: '🎮',
}

/* ===== COINS ===== */
export const COIN_REWARDS = {
  QUEST_EASY: { min: 15, max: 25 },
  QUEST_MEDIUM: { min: 40, max: 60 },
  QUEST_HARD: { min: 80, max: 100 },
  QUEST_SPECIAL: { min: 150, max: 200 },
  LEARNING_CORRECT: { min: 10, max: 15 },
  LEARNING_SET_COMPLETE: 50,
  JUMP_EASY: 30,
  JUMP_MEDIUM: 60,
  JUMP_HARD: 100,
  DAILY_DAY_1: 50,
  DAILY_DAY_2: 75,
  DAILY_DAY_3: 100,
  DAILY_STREAK_7: 300,
  REGISTER_BONUS: 50,
} as const

/* ===== LEARNING ===== */
export const GAME_TYPES = [
  'letters',
  'numbers',
  'colors',
  'shapes',
  'patterns',
  'memory',
] as const
export type GameType = (typeof GAME_TYPES)[number]

export const GAME_LABELS: Record<GameType, string> = {
  letters: 'Letter Quest',
  numbers: 'Count & Collect',
  colors: 'Color World',
  shapes: 'Shape Safari',
  patterns: 'Pattern Magic',
  memory: 'Memory Garden',
}

export const GAME_ICONS: Record<GameType, string> = {
  letters: '🔤',
  numbers: '🔢',
  colors: '🎨',
  shapes: '🔷',
  patterns: '✨',
  memory: '🌸',
}

/* ===== AVATAR ===== */
export const AVATAR_HAIR_COLORS = [
  { value: '#3E2723', label: 'Șaten închis' },
  { value: '#F9A825', label: 'Blond' },
  { value: '#E91E63', label: 'Roz' },
  { value: '#1565C0', label: 'Albastru' },
  { value: '#CE93D8', label: 'Mov' },
] as const

export const AVATAR_SKIN_TONES = [
  { value: '#FFCCBC', label: 'Deschis' },
  { value: '#FFAB76', label: 'Bej' },
  { value: '#FF8A65', label: 'Piersică' },
  { value: '#D4845A', label: 'Bronzat' },
  { value: '#A0522D', label: 'Ciocolatiu' },
  { value: '#8D5524', label: 'Închis' },
] as const

export const AVATAR_EYE_COLORS = [
  { value: '#1565C0', label: 'Albastru' },
  { value: '#2E7D32', label: 'Verde' },
  { value: '#4E342E', label: 'Căprui' },
  { value: '#6A1B9A', label: 'Violet' },
  { value: '#424242', label: 'Gri' },
] as const

export const AVATAR_OUTFIT_COLORS = [
  { value: '#4FC3F7', label: 'Sky Blue' },
  { value: '#FF7043', label: 'Coral' },
  { value: '#66BB6A', label: 'Mint' },
  { value: '#FFD54F', label: 'Sun' },
  { value: '#CE93D8', label: 'Purple' },
  { value: '#F48FB1', label: 'Pink' },
] as const

/* ===== ADVENTURE ZONES ===== */
export const ADVENTURE_ZONES = [
  'sunny_forest',
  'magic_cave',
  'seaside_village',
  'sky_islands',
  'lio_island',
] as const
export type AdventureZone = (typeof ADVENTURE_ZONES)[number]

export const ZONE_LABELS: Record<AdventureZone, string> = {
  sunny_forest: 'Sunny Forest',
  magic_cave: 'Magic Cave',
  seaside_village: 'Seaside Village',
  sky_islands: 'Sky Islands',
  lio_island: "Lio's Island",
}

export const ZONE_UNLOCK_LEVEL: Record<AdventureZone, number> = {
  sunny_forest: 1,
  magic_cave: 3,
  seaside_village: 6,
  sky_islands: 10,
  lio_island: 0, // misiune specială
}

/* ===== RESPONSIVE ===== */
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
} as const

/* ===== TIMING ===== */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: 300,
} as const
