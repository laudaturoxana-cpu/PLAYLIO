// Adventure World — zone definitions, quests, collectibles

export interface ZoneItem {
  id: string
  emoji: string
  label: string
  points: number
}

export interface ZoneSecret {
  id: string
  trigger: 'idle_10s' | 'tap_5x' | 'tap_object_sequence'
  description: string
  rewardEmoji: string
  rewardCoins: number
}

export interface ZoneQuest {
  id: string
  title: string
  description: string
  requiredStars: number
  rewardCoins: number
  rewardEmoji: string
}

export interface Zone {
  id: string
  slug: string
  name: string
  emoji: string
  description: string
  color: string
  bgGradient: string      // gradient CSS
  items: ZoneItem[]       // items that appear in the mini-game
  totalStars: number
  requiredLevel: number   // minimum level to unlock
  quests: ZoneQuest[]
  secret: ZoneSecret
  postcardEmoji: string   // emoji for collection album
}

export const ZONES: Zone[] = [
  {
    id: 'zone_sunny_forest',
    slug: 'sunny-forest',
    name: 'Sunny Forest',
    emoji: '🌳',
    description: 'A magical forest full of butterflies and enchanted flowers',
    color: 'var(--mint-dark)',
    bgGradient: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)',
    totalStars: 5,
    requiredLevel: 1,
    items: [
      { id: 'butterfly', emoji: '🦋', label: 'Butterfly', points: 1 },
      { id: 'flower',    emoji: '🌸', label: 'Flower',    points: 1 },
      { id: 'mushroom',  emoji: '🍄', label: 'Mushroom',  points: 1 },
      { id: 'leaf',      emoji: '🍃', label: 'Leaf',      points: 1 },
      { id: 'acorn',     emoji: '🌰', label: 'Acorn',     points: 1 },
      { id: 'star_rare', emoji: '⭐', label: 'Rare Star', points: 2 },
    ],
    quests: [
      {
        id: 'q_forest_1',
        title: 'Butterfly Collector',
        description: 'Collect 3 stars in the Sunny Forest',
        requiredStars: 3,
        rewardCoins: 10,
        rewardEmoji: '🦋',
      },
      {
        id: 'q_forest_2',
        title: 'Forest Explorer',
        description: 'Collect all 5 stars!',
        requiredStars: 5,
        rewardCoins: 20,
        rewardEmoji: '🌟',
      },
    ],
    secret: {
      id: 'secret_bunny',
      trigger: 'idle_10s',
      description: 'An invisible bunny appears if you stay still for 10 seconds',
      rewardEmoji: '🐰',
      rewardCoins: 15,
    },
    postcardEmoji: '🌳',
  },
  {
    id: 'zone_crystal_cave',
    slug: 'crystal-cave',
    name: 'Crystal Cave',
    emoji: '💎',
    description: 'Deep in the mountain, crystals shine like stars',
    color: 'var(--sky-dark)',
    bgGradient: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
    totalStars: 5,
    requiredLevel: 2,
    items: [
      { id: 'crystal_blue',   emoji: '💎', label: 'Crystal',   points: 1 },
      { id: 'crystal_pink',   emoji: '🔮', label: 'Magic Orb', points: 1 },
      { id: 'gem',            emoji: '💍', label: 'Gemstone',  points: 1 },
      { id: 'crystal_yellow', emoji: '✨', label: 'Sparkle',   points: 1 },
      { id: 'diamond',        emoji: '🌟', label: 'Diamond',   points: 2 },
    ],
    quests: [
      {
        id: 'q_cave_1',
        title: 'Crystal Hunter',
        description: 'Collect 3 shiny crystals',
        requiredStars: 3,
        rewardCoins: 12,
        rewardEmoji: '💎',
      },
      {
        id: 'q_cave_2',
        title: 'Cave Master',
        description: 'Discover all the treasures!',
        requiredStars: 5,
        rewardCoins: 25,
        rewardEmoji: '👑',
      },
    ],
    secret: {
      id: 'secret_echo',
      trigger: 'tap_5x',
      description: 'The wall echoes if you tap it 5 times',
      rewardEmoji: '🔊',
      rewardCoins: 12,
    },
    postcardEmoji: '💎',
  },
  {
    id: 'zone_magic_garden',
    slug: 'magic-garden',
    name: 'Magic Garden',
    emoji: '🌺',
    description: 'Talking flowers and dancing plants',
    color: 'var(--coral)',
    bgGradient: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD0 100%)',
    totalStars: 5,
    requiredLevel: 3,
    items: [
      { id: 'rose',      emoji: '🌹', label: 'Rose',      points: 1 },
      { id: 'tulip',     emoji: '🌷', label: 'Tulip',     points: 1 },
      { id: 'sunflower', emoji: '🌻', label: 'Sunflower', points: 1 },
      { id: 'fairy',     emoji: '🧚', label: 'Fairy',     points: 2 },
      { id: 'rainbow',   emoji: '🌈', label: 'Rainbow',   points: 2 },
    ],
    quests: [
      {
        id: 'q_garden_1',
        title: 'Little Gardener',
        description: 'Collect 3 magic flowers',
        requiredStars: 3,
        rewardCoins: 15,
        rewardEmoji: '🌺',
      },
      {
        id: 'q_garden_2',
        title: 'Friend of Fairies',
        description: 'Complete the magic garden!',
        requiredStars: 5,
        rewardCoins: 30,
        rewardEmoji: '🧚',
      },
    ],
    secret: {
      id: 'secret_rainbow',
      trigger: 'tap_5x',
      description: 'A rainbow appears if you tap the cloud 5 times',
      rewardEmoji: '🌈',
      rewardCoins: 20,
    },
    postcardEmoji: '🌺',
  },
  {
    id: 'zone_cloud_kingdom',
    slug: 'cloud-kingdom',
    name: 'Cloud Kingdom',
    emoji: '☁️',
    description: 'High in the sky where clouds are made of cotton candy',
    color: 'var(--purple)',
    bgGradient: 'linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 100%)',
    totalStars: 5,
    requiredLevel: 5,
    items: [
      { id: 'cloud',     emoji: '⛅', label: 'Cloud',        points: 1 },
      { id: 'lightning', emoji: '⚡', label: 'Lightning',    points: 1 },
      { id: 'snowflake', emoji: '❄️', label: 'Snowflake',    points: 1 },
      { id: 'moon_star', emoji: '🌙', label: 'Little Moon',  points: 2 },
      { id: 'rainbow2',  emoji: '🌈', label: 'Rainbow',      points: 2 },
    ],
    quests: [
      {
        id: 'q_cloud_1',
        title: 'Cloud Traveler',
        description: 'Collect 3 sky treasures',
        requiredStars: 3,
        rewardCoins: 18,
        rewardEmoji: '☁️',
      },
      {
        id: 'q_cloud_2',
        title: 'Cloud King',
        description: 'Conquer the sky kingdom!',
        requiredStars: 5,
        rewardCoins: 35,
        rewardEmoji: '👑',
      },
    ],
    secret: {
      id: 'secret_shooting_star',
      trigger: 'idle_10s',
      description: 'A shooting star passes if you watch the sky for 10 seconds',
      rewardEmoji: '🌠',
      rewardCoins: 25,
    },
    postcardEmoji: '☁️',
  },
  {
    id: 'zone_dragon_peak',
    slug: 'dragon-peak',
    name: 'Dragon Peak',
    emoji: '🐉',
    description: 'The highest peak where a friendly dragon lives',
    color: '#F57F17',
    bgGradient: 'linear-gradient(180deg, #FFF8E1 0%, #FFECB3 100%)',
    totalStars: 7,
    requiredLevel: 8,
    items: [
      { id: 'fire',       emoji: '🔥', label: 'Flame',      points: 1 },
      { id: 'gem_dragon', emoji: '💎', label: 'Crystal',    points: 1 },
      { id: 'egg',        emoji: '🥚', label: 'Dragon Egg', points: 2 },
      { id: 'treasure',   emoji: '💰', label: 'Treasure',   points: 2 },
      { id: 'dragon_gem', emoji: '🐉', label: 'Baby Dragon',points: 3 },
    ],
    quests: [
      {
        id: 'q_dragon_1',
        title: 'Mountain Daredevil',
        description: 'Collect 5 dragon treasures',
        requiredStars: 5,
        rewardCoins: 25,
        rewardEmoji: '🐉',
      },
      {
        id: 'q_dragon_2',
        title: 'Legendary Adventurer',
        description: 'Complete the legendary peak!',
        requiredStars: 7,
        rewardCoins: 50,
        rewardEmoji: '🏆',
      },
    ],
    secret: {
      id: 'secret_dragon_roar',
      trigger: 'tap_5x',
      description: 'The dragon roars if you tap its tail 5 times',
      rewardEmoji: '🔥',
      rewardCoins: 30,
    },
    postcardEmoji: '🐉',
  },
]

export const ZONE_MAP = new Map<string, Zone>(ZONES.map(z => [z.slug, z]))

export function getZoneBySlug(slug: string): Zone | undefined {
  return ZONE_MAP.get(slug)
}

export function isZoneUnlocked(zone: Zone, playerLevel: number): boolean {
  return playerLevel >= zone.requiredLevel
}

// Near-miss: if the player has partial progress, Lio motivates them
export function getNearMissMessage(collectedStars: number, totalStars: number): string | null {
  const remaining = totalStars - collectedStars
  if (collectedStars === 0 || remaining <= 0) return null
  if (remaining === 1) return `So close! Just ONE star left! 🌟`
  if (remaining === 2) return `Almost there! ${remaining} stars left! 💪`
  if (collectedStars > 0 && collectedStars >= Math.floor(totalStars / 2)) {
    return `Halfway there! Keep going! ⭐`
  }
  return null
}
