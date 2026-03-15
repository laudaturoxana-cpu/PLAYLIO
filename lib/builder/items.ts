export type ItemCategory = 'furniture' | 'decoration' | 'wallpaper'

export interface BuilderItem {
  id: string
  category: ItemCategory
  name: string
  emoji: string
  color: string
  price: number
  isRare?: boolean
  width: number
  height: number
  rooms?: string[]  // undefined = available in all rooms
}

export interface Room {
  id: string
  name: string
  emoji: string
  color: string
  bgGradient: string
  wallDefault: string
  requiredCoins: number
  description: string
}

export const ROOMS: Room[] = [
  {
    id: 'bedroom',
    name: 'Bedroom',
    emoji: '🛏️',
    color: '#E91E63',
    bgGradient: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD0 100%)',
    wallDefault: 'wall_sky',
    requiredCoins: 0,
    description: 'Your cozy sleeping room',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '🍳',
    color: '#FF9800',
    bgGradient: 'linear-gradient(180deg, #FFF8E1 0%, #FFECB3 100%)',
    wallDefault: 'wall_forest',
    requiredCoins: 60,
    description: 'Cook delicious meals',
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    emoji: '🛁',
    color: '#2196F3',
    bgGradient: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
    wallDefault: 'wall_ocean',
    requiredCoins: 100,
    description: 'Clean and fresh space',
  },
  {
    id: 'living',
    name: 'Living Room',
    emoji: '🛋️',
    color: '#9C27B0',
    bgGradient: 'linear-gradient(180deg, #F3E5F5 0%, #E8EAF6 100%)',
    wallDefault: 'wall_stars',
    requiredCoins: 150,
    description: 'Relax and watch movies',
  },
  {
    id: 'playroom',
    name: 'Playroom',
    emoji: '🎮',
    color: '#4CAF50',
    bgGradient: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)',
    wallDefault: 'wall_rainbow',
    requiredCoins: 220,
    description: 'The ultimate fun space',
  },
  {
    id: 'garden',
    name: 'Garden',
    emoji: '🌻',
    color: '#8BC34A',
    bgGradient: 'linear-gradient(180deg, #F1F8E9 0%, #DCEDC8 100%)',
    wallDefault: 'wall_forest',
    requiredCoins: 300,
    description: 'Grow beautiful flowers',
  },
]

export const BUILDER_ITEMS: BuilderItem[] = [
  // ─── BEDROOM ITEMS ──────────────────────────────────
  { id: 'bed_pink',      category: 'furniture',   name: 'Pink Bed',       emoji: '🛏️', color: '#E91E63', price: 0,  width: 2, height: 1, rooms: ['bedroom'] },
  { id: 'bed_blue',      category: 'furniture',   name: 'Blue Bed',       emoji: '🛌', color: '#2196F3', price: 20, width: 2, height: 1, rooms: ['bedroom'] },
  { id: 'wardrobe',      category: 'furniture',   name: 'Wardrobe',       emoji: '🪞', color: '#795548', price: 25, width: 2, height: 2, rooms: ['bedroom'] },
  { id: 'magic_bed',     category: 'furniture',   name: 'Magic Bed',      emoji: '✨', color: '#9C27B0', price: 50, isRare: true, width: 2, height: 1, rooms: ['bedroom'] },
  { id: 'pillow',        category: 'decoration',  name: 'Cozy Pillow',    emoji: '🧸', color: '#F48FB1', price: 5,  width: 1, height: 1, rooms: ['bedroom'] },
  { id: 'night_lamp',    category: 'decoration',  name: 'Night Lamp',     emoji: '🕯️', color: '#FFD54F', price: 8,  width: 1, height: 1, rooms: ['bedroom'] },
  { id: 'dream_catcher', category: 'decoration',  name: 'Dream Catcher',  emoji: '🌙', color: '#CE93D8', price: 15, width: 1, height: 1, rooms: ['bedroom'] },
  { id: 'star_mobile',   category: 'decoration',  name: 'Star Mobile',    emoji: '⭐', color: '#FFD54F', price: 12, isRare: true, width: 1, height: 1, rooms: ['bedroom'] },

  // ─── KITCHEN ITEMS ──────────────────────────────────
  { id: 'fridge',        category: 'furniture',   name: 'Refrigerator',   emoji: '🧊', color: '#4FC3F7', price: 30, width: 1, height: 2, rooms: ['kitchen'] },
  { id: 'stove',         category: 'furniture',   name: 'Stove',          emoji: '🍳', color: '#FF7043', price: 25, width: 2, height: 1, rooms: ['kitchen'] },
  { id: 'kitchen_table', category: 'furniture',   name: 'Kitchen Table',  emoji: '🪑', color: '#795548', price: 20, width: 2, height: 1, rooms: ['kitchen'] },
  { id: 'fruit_bowl',    category: 'decoration',  name: 'Fruit Bowl',     emoji: '🍎', color: '#F44336', price: 8,  width: 1, height: 1, rooms: ['kitchen'] },
  { id: 'cookie_jar',    category: 'decoration',  name: 'Cookie Jar',     emoji: '🍪', color: '#FF9800', price: 10, width: 1, height: 1, rooms: ['kitchen'] },
  { id: 'herb_pot',      category: 'decoration',  name: 'Herb Pot',       emoji: '🌿', color: '#4CAF50', price: 6,  width: 1, height: 1, rooms: ['kitchen'] },
  { id: 'magic_cake',    category: 'decoration',  name: 'Magic Cake',     emoji: '🎂', color: '#F48FB1', price: 40, isRare: true, width: 2, height: 1, rooms: ['kitchen'] },

  // ─── BATHROOM ITEMS ─────────────────────────────────
  { id: 'bathtub',       category: 'furniture',   name: 'Bathtub',        emoji: '🛁', color: '#4FC3F7', price: 30, width: 2, height: 1, rooms: ['bathroom'] },
  { id: 'sink',          category: 'furniture',   name: 'Sink',           emoji: '🚰', color: '#29B6F6', price: 15, width: 1, height: 1, rooms: ['bathroom'] },
  { id: 'bath_mirror',   category: 'decoration',  name: 'Mirror',         emoji: '🔮', color: '#9C27B0', price: 20, width: 1, height: 2, rooms: ['bathroom'] },
  { id: 'rubber_duck',   category: 'decoration',  name: 'Rubber Duck',    emoji: '🦆', color: '#FFD54F', price: 8,  width: 1, height: 1, rooms: ['bathroom'] },
  { id: 'towel',         category: 'decoration',  name: 'Towel',          emoji: '🏖️', color: '#4FC3F7', price: 5,  width: 1, height: 1, rooms: ['bathroom'] },
  { id: 'bubble_bath',   category: 'decoration',  name: 'Bubble Bath',    emoji: '🫧', color: '#80DEEA', price: 12, isRare: true, width: 1, height: 1, rooms: ['bathroom'] },

  // ─── LIVING ROOM ITEMS ──────────────────────────────
  { id: 'sofa',          category: 'furniture',   name: 'Sofa',           emoji: '🛋️', color: '#7B1FA2', price: 30, width: 3, height: 1, rooms: ['living'] },
  { id: 'tv',            category: 'furniture',   name: 'TV',             emoji: '📺', color: '#37474F', price: 35, width: 2, height: 2, rooms: ['living'] },
  { id: 'bookshelf',     category: 'furniture',   name: 'Bookshelf',      emoji: '📚', color: '#388E3C', price: 15, width: 2, height: 2, rooms: ['living', 'bedroom'] },
  { id: 'rug',           category: 'decoration',  name: 'Cozy Rug',       emoji: '🎨', color: '#FF5722', price: 18, width: 2, height: 1, rooms: ['living'] },
  { id: 'fireplace',     category: 'decoration',  name: 'Fireplace',      emoji: '🔥', color: '#F57F17', price: 25, width: 2, height: 2, rooms: ['living'] },
  { id: 'piano',         category: 'decoration',  name: 'Magic Piano',    emoji: '🎹', color: '#212121', price: 55, isRare: true, width: 2, height: 1, rooms: ['living'] },

  // ─── PLAYROOM ITEMS ─────────────────────────────────
  { id: 'toy_box',       category: 'furniture',   name: 'Toy Box',        emoji: '🎁', color: '#F44336', price: 20, width: 2, height: 1, rooms: ['playroom'] },
  { id: 'slide',         category: 'furniture',   name: 'Slide',          emoji: '🛝', color: '#FF9800', price: 40, width: 2, height: 2, rooms: ['playroom'] },
  { id: 'building_blocks', category: 'decoration', name: 'Building Blocks', emoji: '🧱', color: '#F44336', price: 10, width: 1, height: 1, rooms: ['playroom'] },
  { id: 'swing',         category: 'furniture',   name: 'Swing',          emoji: '🎡', color: '#9C27B0', price: 35, width: 2, height: 2, rooms: ['playroom'] },
  { id: 'arcade',        category: 'decoration',  name: 'Arcade Machine', emoji: '🕹️', color: '#7B1FA2', price: 60, isRare: true, width: 1, height: 2, rooms: ['playroom'] },
  { id: 'ball_pit',      category: 'decoration',  name: 'Ball Pit',       emoji: '🎱', color: '#4CAF50', price: 30, width: 2, height: 1, rooms: ['playroom'] },

  // ─── GARDEN ITEMS ───────────────────────────────────
  { id: 'flower_pot',    category: 'decoration',  name: 'Flower Pot',     emoji: '🌸', color: '#E91E63', price: 5,  width: 1, height: 1, rooms: ['garden'] },
  { id: 'sunflower',     category: 'decoration',  name: 'Sunflower',      emoji: '🌻', color: '#FFD600', price: 8,  width: 1, height: 1, rooms: ['garden'] },
  { id: 'tree',          category: 'furniture',   name: 'Tree',           emoji: '🌳', color: '#388E3C', price: 20, width: 1, height: 2, rooms: ['garden'] },
  { id: 'fountain',      category: 'furniture',   name: 'Fountain',       emoji: '⛲', color: '#4FC3F7', price: 30, width: 2, height: 2, rooms: ['garden'] },
  { id: 'garden_bench',  category: 'furniture',   name: 'Garden Bench',   emoji: '🪑', color: '#795548', price: 15, width: 2, height: 1, rooms: ['garden'] },
  { id: 'butterfly',     category: 'decoration',  name: 'Butterfly',      emoji: '🦋', color: '#CE93D8', price: 10, width: 1, height: 1, rooms: ['garden'] },
  { id: 'rainbow_arch',  category: 'decoration',  name: 'Rainbow Arch',   emoji: '🌈', color: '#29B6F6', price: 50, isRare: true, width: 3, height: 2, rooms: ['garden'] },

  // ─── DECORATIONS (available in all rooms) ────────────
  { id: 'balloon',       category: 'decoration',  name: 'Balloon',        emoji: '🎈', color: '#F44336', price: 5,  width: 1, height: 1 },
  { id: 'trophy',        category: 'decoration',  name: 'Trophy',         emoji: '🏆', color: '#FFD600', price: 20, width: 1, height: 1 },
  { id: 'fairy_lights',  category: 'decoration',  name: 'Fairy Lights',   emoji: '✨', color: '#FFD54F', price: 15, width: 3, height: 1 },
  { id: 'star_lamp',     category: 'decoration',  name: 'Star Lamp',      emoji: '💫', color: '#FFD54F', price: 10, width: 1, height: 1 },
  { id: 'magic_mirror',  category: 'decoration',  name: 'Magic Mirror',   emoji: '🔮', color: '#9C27B0', price: 45, isRare: true, width: 1, height: 2 },
  { id: 'dragon_plush',  category: 'decoration',  name: 'Dragon Plush',   emoji: '🐉', color: '#388E3C', price: 40, isRare: true, width: 1, height: 1 },

  // ─── WALLPAPERS ──────────────────────────────────────
  { id: 'wall_sky',      category: 'wallpaper',   name: 'Clear Sky',      emoji: '☁️', color: '#29B6F6', price: 0,  width: 1, height: 1 },
  { id: 'wall_forest',   category: 'wallpaper',   name: 'Magic Forest',   emoji: '🌳', color: '#388E3C', price: 20, width: 1, height: 1 },
  { id: 'wall_stars',    category: 'wallpaper',   name: 'Starry Night',   emoji: '🌙', color: '#7B1FA2', price: 25, width: 1, height: 1 },
  { id: 'wall_ocean',    category: 'wallpaper',   name: 'Ocean',          emoji: '🌊', color: '#0288D1', price: 30, width: 1, height: 1 },
  { id: 'wall_rainbow',  category: 'wallpaper',   name: 'Rainbow',        emoji: '🌈', color: '#FF7043', price: 35, width: 1, height: 1 },
  { id: 'wall_galaxy',   category: 'wallpaper',   name: 'Galaxy',         emoji: '🚀', color: '#7B1FA2', price: 50, isRare: true, width: 1, height: 1 },
]

export const ITEM_MAP = new Map<string, BuilderItem>(BUILDER_ITEMS.map(i => [i.id, i]))

export function getItemsForRoom(roomId: string): BuilderItem[] {
  return BUILDER_ITEMS.filter(i => !i.rooms || i.rooms.includes(roomId))
}

export const WALLPAPER_THEMES: Record<string, { bg: string; accent: string }> = {
  wall_sky:     { bg: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)', accent: '#4FC3F7' },
  wall_forest:  { bg: 'linear-gradient(180deg, #E8F5E9 0%, #A5D6A7 100%)', accent: '#388E3C' },
  wall_stars:   { bg: 'linear-gradient(180deg, #1A237E 0%, #311B92 100%)', accent: '#CE93D8' },
  wall_ocean:   { bg: 'linear-gradient(180deg, #B3E5FC 0%, #0288D1 100%)', accent: '#4FC3F7' },
  wall_rainbow: { bg: 'linear-gradient(135deg, #FCE4EC 0%, #E8F5E9 50%, #E3F2FD 100%)', accent: '#FF7043' },
  wall_galaxy:  { bg: 'linear-gradient(180deg, #0D0D2B 0%, #1A0533 100%)', accent: '#CE93D8' },
}

export const DEFAULT_WALLPAPER = 'wall_sky'
