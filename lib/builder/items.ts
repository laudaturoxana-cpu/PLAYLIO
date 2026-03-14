export type ItemCategory = 'furniture' | 'decoration' | 'wallpaper'

export interface BuilderItem {
  id: string
  category: ItemCategory
  name: string
  emoji: string
  color: string    // accent color
  price: number    // coins
  isRare?: boolean // rare items → album colecție
  width: number    // grid units (1-3)
  height: number   // grid units (1-2)
}

export const BUILDER_ITEMS: BuilderItem[] = [
  // ─── FURNITURE ───────────────────────────────────
  { id: 'bed_pink',      category: 'furniture', name: 'Pat roz',        emoji: '🛏️', color: 'var(--pink)',     price: 0,  width: 2, height: 1 },
  { id: 'desk_wood',     category: 'furniture', name: 'Birou de lemn',  emoji: '🪑', color: 'var(--sun)',      price: 10, width: 2, height: 1 },
  { id: 'bookshelf',     category: 'furniture', name: 'Bibliotecă',     emoji: '📚', color: 'var(--mint-dark)',price: 15, width: 2, height: 2 },
  { id: 'toy_box',       category: 'furniture', name: 'Cutie de jucării',emoji: '🧸', color: 'var(--coral)',    price: 20, width: 2, height: 1 },
  { id: 'wardrobe',      category: 'furniture', name: 'Dulap',          emoji: '🪞', color: 'var(--sky-dark)', price: 25, width: 2, height: 2 },
  { id: 'sofa',          category: 'furniture', name: 'Canapea',        emoji: '🛋️', color: 'var(--purple)',   price: 30, width: 3, height: 1 },
  { id: 'magic_bed',     category: 'furniture', name: 'Pat magic',      emoji: '✨', color: 'var(--purple)',   price: 50, isRare: true, width: 2, height: 1 },

  // ─── DECORATIONS ─────────────────────────────────
  { id: 'flower_pot',    category: 'decoration', name: 'Ghiveci',       emoji: '🌸', color: 'var(--coral)',    price: 5,  width: 1, height: 1 },
  { id: 'rainbow',       category: 'decoration', name: 'Curcubeu',      emoji: '🌈', color: 'var(--sky)',      price: 5,  width: 1, height: 1 },
  { id: 'star_lamp',     category: 'decoration', name: 'Lampă stea',    emoji: '⭐', color: 'var(--sun)',      price: 10, width: 1, height: 1 },
  { id: 'balloon',       category: 'decoration', name: 'Balon',         emoji: '🎈', color: 'var(--coral)',    price: 5,  width: 1, height: 1 },
  { id: 'trophy',        category: 'decoration', name: 'Trofeu',        emoji: '🏆', color: 'var(--sun)',      price: 20, width: 1, height: 1 },
  { id: 'painting',      category: 'decoration', name: 'Tablou magic',  emoji: '🖼️', color: 'var(--purple)',   price: 15, width: 2, height: 1 },
  { id: 'fairy_lights',  category: 'decoration', name: 'Luminițe',      emoji: '✨', color: 'var(--sun)',      price: 15, width: 3, height: 1 },
  { id: 'dragon_plush',  category: 'decoration', name: 'Pluș dragon',   emoji: '🐉', color: 'var(--mint-dark)',price: 40, isRare: true, width: 1, height: 1 },
  { id: 'magic_mirror',  category: 'decoration', name: 'Oglindă magică',emoji: '🔮', color: 'var(--purple)',   price: 45, isRare: true, width: 1, height: 2 },

  // ─── WALLPAPERS ──────────────────────────────────
  { id: 'wall_sky',      category: 'wallpaper', name: 'Cer senin',      emoji: '☁️', color: 'var(--sky)',      price: 0,  width: 1, height: 1 },
  { id: 'wall_forest',   category: 'wallpaper', name: 'Pădure magică',  emoji: '🌳', color: 'var(--mint-dark)',price: 20, width: 1, height: 1 },
  { id: 'wall_stars',    category: 'wallpaper', name: 'Noapte cu stele',emoji: '🌙', color: 'var(--purple)',   price: 25, width: 1, height: 1 },
  { id: 'wall_ocean',    category: 'wallpaper', name: 'Ocean',          emoji: '🌊', color: 'var(--sky-dark)', price: 30, width: 1, height: 1 },
  { id: 'wall_rainbow',  category: 'wallpaper', name: 'Curcubeu',       emoji: '🌈', color: 'var(--coral)',    price: 35, width: 1, height: 1 },
  { id: 'wall_galaxy',   category: 'wallpaper', name: 'Galaxie',        emoji: '🚀', color: 'var(--purple)',   price: 50, isRare: true, width: 1, height: 1 },
]

export const ITEM_MAP = new Map<string, BuilderItem>(BUILDER_ITEMS.map(i => [i.id, i]))

// Temele de cameră (wallpaper colors pentru preview)
export const WALLPAPER_THEMES: Record<string, { bg: string; accent: string }> = {
  wall_sky:     { bg: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)', accent: '#4FC3F7' },
  wall_forest:  { bg: 'linear-gradient(180deg, #E8F5E9 0%, #A5D6A7 100%)', accent: '#388E3C' },
  wall_stars:   { bg: 'linear-gradient(180deg, #1A237E 0%, #311B92 100%)', accent: '#CE93D8' },
  wall_ocean:   { bg: 'linear-gradient(180deg, #B3E5FC 0%, #0288D1 100%)', accent: '#4FC3F7' },
  wall_rainbow: { bg: 'linear-gradient(135deg, #FCE4EC 0%, #E8F5E9 50%, #E3F2FD 100%)', accent: '#FF7043' },
  wall_galaxy:  { bg: 'linear-gradient(180deg, #0D0D2B 0%, #1A0533 100%)', accent: '#CE93D8' },
}

export const DEFAULT_WALLPAPER = 'wall_sky'
