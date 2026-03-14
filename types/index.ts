import type { World, GameType, AdventureZone } from '@/lib/utils/constants'
export type { World, GameType, AdventureZone }

/* ===== USER / PROFILE ===== */
export interface Profile {
  id: string
  username: string
  full_name: string | null
  role: 'child' | 'parent'
  parent_id: string | null
  coins: number
  level: number
  xp: number
  created_at: string
  updated_at: string
}

/* ===== AVATAR ===== */
export interface Avatar {
  id: string
  user_id: string
  hair_color: string
  hair_style: string
  skin_tone: string
  eye_color: string
  outfit_style: string
  outfit_color: string
  accessories: string[]
  updated_at: string
}

export interface AvatarConfig {
  hair_color: string
  hair_style: string
  skin_tone: string
  eye_color: string
  outfit_style: string
  outfit_color: string
  accessories: string[]
}

/* ===== PROGRESS ===== */
export interface Progress {
  id: string
  user_id: string
  world: World
  level: number
  xp: number
  quests_completed: number
  time_played_seconds: number
  updated_at: string
}

/* ===== LEARNING ===== */
export interface LearningProgress {
  id: string
  user_id: string
  game_type: GameType
  item_id: string
  attempts: number
  correct: number
  mastered: boolean
  last_seen: string
}

/* ===== QUESTS ===== */
export interface Quest {
  id: string
  world: World
  zone: AdventureZone | null
  title: string
  description: string | null
  difficulty: 'easy' | 'medium' | 'hard' | 'special'
  reward_coins: number
  reward_item: string | null
  is_daily: boolean
  order_index: number
  is_active: boolean
  created_at: string
}

export interface QuestCompletion {
  id: string
  user_id: string
  quest_id: string
  completed_at: string
}

/* ===== INVENTORY ===== */
export type ItemType = 'furniture' | 'decoration' | 'wallpaper' | 'avatar_item' | 'special'

export interface InventoryItem {
  id: string
  user_id: string
  item_id: string
  item_type: ItemType
  acquired_at: string
}

/* ===== BUILDER ===== */
export interface BuilderState {
  id: string
  user_id: string
  room_data: Record<string, unknown>
  unlocked_rooms: string[]
  updated_at: string
}

/* ===== COINS ===== */
export interface CoinTransaction {
  id: string
  user_id: string
  amount: number
  reason: string
  world: World | null
  created_at: string
}

/* ===== DAILY REWARDS ===== */
export interface DailyReward {
  id: string
  user_id: string
  reward_date: string
  day_streak: number
  coins_earned: number
}

/* ===== JUMP ===== */
export interface JumpScore {
  id: string
  user_id: string
  level_id: string
  score: number
  stars: 0 | 1 | 2 | 3
  time_ms: number | null
  created_at: string
}

/* ===== GAME STATE ===== */
export type LioEmotion = 'happy' | 'excited' | 'thinking' | 'celebrating'

export interface LioMessage {
  text: string
  emotion: LioEmotion
  duration?: number
}

export interface GameResult {
  correct: boolean
  coins: number
  message: LioMessage
}

/* ===== UI ===== */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'reward'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type CardVariant = 'default' | 'hover' | 'world'
export type BadgeVariant = 'sky' | 'coral' | 'mint' | 'sun' | 'purple' | 'pink' | 'teal'
