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
  items: ZoneItem[]       // obiectele care apar în mini-joc
  totalStars: number
  requiredLevel: number   // nivel minim deblocare
  quests: ZoneQuest[]
  secret: ZoneSecret
  postcardEmoji: string   // emoji pentru album colecție
}

export const ZONES: Zone[] = [
  {
    id: 'zone_sunny_forest',
    slug: 'sunny-forest',
    name: 'Pădurea Însorită',
    emoji: '🌳',
    description: 'O pădure magică plină de fluturi și flori fermecate',
    color: 'var(--mint-dark)',
    bgGradient: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)',
    totalStars: 5,
    requiredLevel: 1,
    items: [
      { id: 'butterfly', emoji: '🦋', label: 'Fluture', points: 1 },
      { id: 'flower',    emoji: '🌸', label: 'Floare',  points: 1 },
      { id: 'mushroom',  emoji: '🍄', label: 'Ciupercă',points: 1 },
      { id: 'leaf',      emoji: '🍃', label: 'Frunză',  points: 1 },
      { id: 'acorn',     emoji: '🌰', label: 'Ghindă',  points: 1 },
      { id: 'star_rare', emoji: '⭐', label: 'Stea rară',points: 2 },
    ],
    quests: [
      {
        id: 'q_forest_1',
        title: 'Colecționarul de fluturi',
        description: 'Adună 3 stele în Pădurea Însorită',
        requiredStars: 3,
        rewardCoins: 10,
        rewardEmoji: '🦋',
      },
      {
        id: 'q_forest_2',
        title: 'Exploratorul pădurii',
        description: 'Adună toate 5 stelele!',
        requiredStars: 5,
        rewardCoins: 20,
        rewardEmoji: '🌟',
      },
    ],
    secret: {
      id: 'secret_bunny',
      trigger: 'idle_10s',
      description: 'Un iepuraș invizibil apare dacă stai nemișcat 10 secunde',
      rewardEmoji: '🐰',
      rewardCoins: 15,
    },
    postcardEmoji: '🌳',
  },
  {
    id: 'zone_crystal_cave',
    slug: 'crystal-cave',
    name: 'Peștera de Cristal',
    emoji: '💎',
    description: 'Adânc în munte, cristalele strălucesc ca stelele',
    color: 'var(--sky-dark)',
    bgGradient: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
    totalStars: 5,
    requiredLevel: 2,
    items: [
      { id: 'crystal_blue',   emoji: '💎', label: 'Cristal',    points: 1 },
      { id: 'crystal_pink',   emoji: '🔮', label: 'Orb magic',  points: 1 },
      { id: 'gem',            emoji: '💍', label: 'Piatră prețioasă', points: 1 },
      { id: 'crystal_yellow', emoji: '✨', label: 'Scânteie',   points: 1 },
      { id: 'diamond',        emoji: '🌟', label: 'Diamant',    points: 2 },
    ],
    quests: [
      {
        id: 'q_cave_1',
        title: 'Vânătorul de cristale',
        description: 'Adună 3 cristale strălucitoare',
        requiredStars: 3,
        rewardCoins: 12,
        rewardEmoji: '💎',
      },
      {
        id: 'q_cave_2',
        title: 'Maestrul peșterii',
        description: 'Descoperă toate comorile!',
        requiredStars: 5,
        rewardCoins: 25,
        rewardEmoji: '👑',
      },
    ],
    secret: {
      id: 'secret_echo',
      trigger: 'tap_5x',
      description: 'Peretele face ecou dacă îl atingi de 5 ori',
      rewardEmoji: '🔊',
      rewardCoins: 12,
    },
    postcardEmoji: '💎',
  },
  {
    id: 'zone_magic_garden',
    slug: 'magic-garden',
    name: 'Grădina Magică',
    emoji: '🌺',
    description: 'Flori care vorbesc și plante care dansează',
    color: 'var(--coral)',
    bgGradient: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD0 100%)',
    totalStars: 5,
    requiredLevel: 3,
    items: [
      { id: 'rose',      emoji: '🌹', label: 'Trandafir',  points: 1 },
      { id: 'tulip',     emoji: '🌷', label: 'Lalea',      points: 1 },
      { id: 'sunflower', emoji: '🌻', label: 'Floarea-soarelui', points: 1 },
      { id: 'fairy',     emoji: '🧚', label: 'Zânuță',     points: 2 },
      { id: 'rainbow',   emoji: '🌈', label: 'Curcubeu',   points: 2 },
    ],
    quests: [
      {
        id: 'q_garden_1',
        title: 'Grădinarul mic',
        description: 'Adună 3 flori magice',
        requiredStars: 3,
        rewardCoins: 15,
        rewardEmoji: '🌺',
      },
      {
        id: 'q_garden_2',
        title: 'Prietenul zânuțelor',
        description: 'Completează grădina magică!',
        requiredStars: 5,
        rewardCoins: 30,
        rewardEmoji: '🧚',
      },
    ],
    secret: {
      id: 'secret_rainbow',
      trigger: 'tap_5x',
      description: 'Un curcubeu apare dacă atingi norul de 5 ori',
      rewardEmoji: '🌈',
      rewardCoins: 20,
    },
    postcardEmoji: '🌺',
  },
  {
    id: 'zone_cloud_kingdom',
    slug: 'cloud-kingdom',
    name: 'Regatul Norilor',
    emoji: '☁️',
    description: 'Sus în ceruri, unde norii sunt din vată de zahăr',
    color: 'var(--purple)',
    bgGradient: 'linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 100%)',
    totalStars: 5,
    requiredLevel: 5,
    items: [
      { id: 'cloud',     emoji: '⛅', label: 'Norișor',   points: 1 },
      { id: 'lightning', emoji: '⚡', label: 'Fulger',    points: 1 },
      { id: 'snowflake', emoji: '❄️', label: 'Fulg',      points: 1 },
      { id: 'moon_star', emoji: '🌙', label: 'Lunuță',    points: 2 },
      { id: 'rainbow2',  emoji: '🌈', label: 'Curcubeu',  points: 2 },
    ],
    quests: [
      {
        id: 'q_cloud_1',
        title: 'Călătorul norilor',
        description: 'Adună 3 comori din cer',
        requiredStars: 3,
        rewardCoins: 18,
        rewardEmoji: '☁️',
      },
      {
        id: 'q_cloud_2',
        title: 'Regele norilor',
        description: 'Cucerește regatul ceresc!',
        requiredStars: 5,
        rewardCoins: 35,
        rewardEmoji: '👑',
      },
    ],
    secret: {
      id: 'secret_shooting_star',
      trigger: 'idle_10s',
      description: 'O stea căzătoare trece dacă privești cerul 10 secunde',
      rewardEmoji: '🌠',
      rewardCoins: 25,
    },
    postcardEmoji: '☁️',
  },
  {
    id: 'zone_dragon_peak',
    slug: 'dragon-peak',
    name: 'Vârful Dragonului',
    emoji: '🐉',
    description: 'Cel mai înalt vârf unde trăiește un dragon prietenos',
    color: '#F57F17',
    bgGradient: 'linear-gradient(180deg, #FFF8E1 0%, #FFECB3 100%)',
    totalStars: 7,
    requiredLevel: 8,
    items: [
      { id: 'fire',       emoji: '🔥', label: 'Flacără',   points: 1 },
      { id: 'gem_dragon', emoji: '💎', label: 'Cristal',   points: 1 },
      { id: 'egg',        emoji: '🥚', label: 'Ou dragon', points: 2 },
      { id: 'treasure',   emoji: '💰', label: 'Comoară',   points: 2 },
      { id: 'dragon_gem', emoji: '🐉', label: 'Dragon mic',points: 3 },
    ],
    quests: [
      {
        id: 'q_dragon_1',
        title: 'Temerarul munților',
        description: 'Adună 5 comori ale dragonului',
        requiredStars: 5,
        rewardCoins: 25,
        rewardEmoji: '🐉',
      },
      {
        id: 'q_dragon_2',
        title: 'Legendarul aventurier',
        description: 'Completează vârful legendar!',
        requiredStars: 7,
        rewardCoins: 50,
        rewardEmoji: '🏆',
      },
    ],
    secret: {
      id: 'secret_dragon_roar',
      trigger: 'tap_5x',
      description: 'Dragonul răcnește dacă îi atingi coada de 5 ori',
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

// Near-miss: dacă playerul are progres parțial, Lio îl motivează
export function getNearMissMessage(collectedStars: number, totalStars: number): string | null {
  const remaining = totalStars - collectedStars
  if (collectedStars === 0 || remaining <= 0) return null
  if (remaining === 1) return `Ești la un pas! Mai ai O ${remaining === 1 ? 'stea' : 'stele'}! 🌟`
  if (remaining === 2) return `Aproape! Mai ai ${remaining} stele! 💪`
  if (collectedStars > 0 && collectedStars >= Math.floor(totalStars / 2)) {
    return `Ești la jumătate! Continuă! ⭐`
  }
  return null
}
