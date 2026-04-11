// ============================================================
//  PLAYLIO — BUILDER WORLD v2  (blocuri Minecraft-like)
//  Toate blocurile sunt 1×1. Estetica: CSS-styled, nu emoji.
// ============================================================

export type BlockCategory =
  | 'ground'    // teren: iarbă, pământ, nisip, rocă…
  | 'water'     // apă: lac, ocean, cascadă…
  | 'plants'    // floră: copaci, flori, ciuperci…
  | 'building'  // construcție: cărămidă, lemn, piatră…
  | 'sky'       // cer: nor, soare, lună, stele…
  | 'magic'     // magic/rar: cristal, aur, portal…

export interface Block {
  id: string
  name: string          // afișat în paletă (română)
  nameEn: string        // pentru AI/Lio context
  category: BlockCategory
  bgStyle: string       // CSS background (gradient/solid)
  borderColor: string   // culoare chenar bloc
  shadowLight: string   // rgba for highlight (inset top-left)
  shadowDark: string    // rgba for shadow (inset bottom-right)
  icon: string          // emoji afișat în paletă
  isRare?: boolean
  minAge?: number       // 3 = toți, 6 = copii 6+, 9 = copii 9+
  geographyUnlock?: string  // id-ul țării care deblochează blocul
}

// ─── TEREN ──────────────────────────────────────────────────────
export const GROUND_BLOCKS: Block[] = [
  {
    id: 'grass',
    name: 'Iarbă', nameEn: 'Grass',
    category: 'ground',
    bgStyle: 'linear-gradient(to bottom, #56C94E 0%, #56C94E 28%, #8B6346 28%, #8B6346 100%)',
    borderColor: '#3A8F33',
    shadowLight: 'rgba(150,255,120,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🟩', minAge: 3,
  },
  {
    id: 'dirt',
    name: 'Pământ', nameEn: 'Dirt',
    category: 'ground',
    bgStyle: '#8B6346',
    borderColor: '#6B4A32',
    shadowLight: 'rgba(180,130,90,0.5)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '🟫', minAge: 3,
  },
  {
    id: 'sand',
    name: 'Nisip', nameEn: 'Sand',
    category: 'ground',
    bgStyle: 'linear-gradient(135deg, #F7D97A 0%, #E8C055 50%, #F7D97A 100%)',
    borderColor: '#C9A030',
    shadowLight: 'rgba(255,240,160,0.6)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '🏖️', minAge: 3,
  },
  {
    id: 'rock',
    name: 'Rocă', nameEn: 'Rock',
    category: 'ground',
    bgStyle: 'linear-gradient(135deg, #78909C 0%, #546E7A 50%, #78909C 100%)',
    borderColor: '#37474F',
    shadowLight: 'rgba(180,200,210,0.5)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '🪨', minAge: 3,
  },
  {
    id: 'snow',
    name: 'Zăpadă', nameEn: 'Snow',
    category: 'ground',
    bgStyle: 'linear-gradient(to bottom, #FFFFFF 0%, #E3F2FD 100%)',
    borderColor: '#B0C4DE',
    shadowLight: 'rgba(255,255,255,0.9)',
    shadowDark: 'rgba(100,150,200,0.3)',
    icon: '❄️', minAge: 3,
  },
  {
    id: 'lava',
    name: 'Lavă', nameEn: 'Lava',
    category: 'ground',
    bgStyle: 'linear-gradient(to bottom, #FF6D00 0%, #BF360C 100%)',
    borderColor: '#7F1900',
    shadowLight: 'rgba(255,180,50,0.6)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🌋', minAge: 5,
  },
  {
    id: 'ice',
    name: 'Gheață', nameEn: 'Ice',
    category: 'ground',
    bgStyle: 'linear-gradient(135deg, #B3E5FC 0%, #E1F5FE 50%, #B3E5FC 100%)',
    borderColor: '#81D4FA',
    shadowLight: 'rgba(255,255,255,0.7)',
    shadowDark: 'rgba(0,80,150,0.2)',
    icon: '🧊', minAge: 3,
  },
  {
    id: 'gravel',
    name: 'Pietriș', nameEn: 'Gravel',
    category: 'ground',
    bgStyle: 'linear-gradient(135deg, #9E9E9E 0%, #757575 50%, #9E9E9E 100%)',
    borderColor: '#616161',
    shadowLight: 'rgba(220,220,220,0.5)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '⬜', minAge: 3,
  },
  {
    id: 'path',
    name: 'Cărare', nameEn: 'Path',
    category: 'ground',
    bgStyle: 'linear-gradient(to right, #A1887F 0%, #BCAAA4 50%, #A1887F 100%)',
    borderColor: '#795548',
    shadowLight: 'rgba(210,180,160,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🛤️', minAge: 3,
  },
  {
    id: 'mud',
    name: 'Mâl', nameEn: 'Mud',
    category: 'ground',
    bgStyle: 'linear-gradient(135deg, #5D4037 0%, #4E342E 50%, #5D4037 100%)',
    borderColor: '#3E2723',
    shadowLight: 'rgba(120,80,50,0.4)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '💧', minAge: 3,
  },
]

// ─── APĂ ────────────────────────────────────────────────────────
export const WATER_BLOCKS: Block[] = [
  {
    id: 'water',
    name: 'Apă', nameEn: 'Water',
    category: 'water',
    bgStyle: 'linear-gradient(to bottom, #29B6F6 0%, #0277BD 100%)',
    borderColor: '#0288D1',
    shadowLight: 'rgba(100,200,255,0.6)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '💧', minAge: 3,
  },
  {
    id: 'ocean',
    name: 'Ocean', nameEn: 'Ocean',
    category: 'water',
    bgStyle: 'linear-gradient(to bottom, #0D47A1 0%, #01579B 100%)',
    borderColor: '#003c8f',
    shadowLight: 'rgba(50,130,240,0.4)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🌊', minAge: 3,
  },
  {
    id: 'waterfall',
    name: 'Cascadă', nameEn: 'Waterfall',
    category: 'water',
    bgStyle: 'repeating-linear-gradient(to bottom, #29B6F6 0px, #4FC3F7 3px, #E1F5FE 3px, #29B6F6 6px)',
    borderColor: '#0288D1',
    shadowLight: 'rgba(150,230,255,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '💦', minAge: 5,
  },
  {
    id: 'lava_flow',
    name: 'Lavă curgătoare', nameEn: 'Flowing Lava',
    category: 'water',
    bgStyle: 'repeating-linear-gradient(135deg, #FF6D00 0px, #DD2C00 5px, #FF6D00 10px)',
    borderColor: '#BF360C',
    shadowLight: 'rgba(255,150,50,0.5)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🔥', minAge: 7,
  },
]

// ─── PLANTE ─────────────────────────────────────────────────────
export const PLANT_BLOCKS: Block[] = [
  {
    id: 'oak_tree',
    name: 'Stejar', nameEn: 'Oak Tree',
    category: 'plants',
    bgStyle: 'radial-gradient(ellipse at 50% 40%, #56C94E 40%, #388E3C 100%)',
    borderColor: '#2E7D32',
    shadowLight: 'rgba(130,220,100,0.5)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '🌳', minAge: 3,
  },
  {
    id: 'pine_tree',
    name: 'Brad', nameEn: 'Pine Tree',
    category: 'plants',
    bgStyle: 'radial-gradient(ellipse at 50% 30%, #388E3C 30%, #1B5E20 100%)',
    borderColor: '#1B5E20',
    shadowLight: 'rgba(80,180,80,0.4)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '🌲', minAge: 3,
  },
  {
    id: 'flower_pink',
    name: 'Flori', nameEn: 'Flowers',
    category: 'plants',
    bgStyle: 'radial-gradient(circle at 50% 40%, #F48FB1 30%, #E91E63 60%, #4CAF50 60%, #388E3C 100%)',
    borderColor: '#C2185B',
    shadowLight: 'rgba(255,180,200,0.5)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '🌸', minAge: 3,
  },
  {
    id: 'sunflower',
    name: 'Floarea-soarelui', nameEn: 'Sunflower',
    category: 'plants',
    bgStyle: 'radial-gradient(circle at 50% 35%, #FFD600 35%, #FF8F00 60%, #388E3C 60%, #2E7D32 100%)',
    borderColor: '#F57F17',
    shadowLight: 'rgba(255,220,50,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🌻', minAge: 3,
  },
  {
    id: 'mushroom',
    name: 'Ciupercă', nameEn: 'Mushroom',
    category: 'plants',
    bgStyle: 'linear-gradient(to bottom, #F44336 0%, #F44336 55%, #EEEEEE 55%, #EEEEEE 100%)',
    borderColor: '#C62828',
    shadowLight: 'rgba(255,180,160,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🍄', minAge: 3,
  },
  {
    id: 'cactus',
    name: 'Cactus', nameEn: 'Cactus',
    category: 'plants',
    bgStyle: 'linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%)',
    borderColor: '#2E7D32',
    shadowLight: 'rgba(120,210,100,0.4)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '🌵', minAge: 3,
  },
  {
    id: 'bush',
    name: 'Tufă', nameEn: 'Bush',
    category: 'plants',
    bgStyle: 'radial-gradient(ellipse at 50% 60%, #7CB342 40%, #558B2F 100%)',
    borderColor: '#33691E',
    shadowLight: 'rgba(160,230,100,0.4)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🌿', minAge: 3,
  },
  {
    id: 'seaweed',
    name: 'Alge marine', nameEn: 'Seaweed',
    category: 'plants',
    bgStyle: 'linear-gradient(to bottom, #26A69A 0%, #00796B 100%)',
    borderColor: '#004D40',
    shadowLight: 'rgba(80,200,190,0.4)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '🌿', minAge: 6,
  },
  {
    id: 'coral',
    name: 'Coral', nameEn: 'Coral',
    category: 'plants',
    bgStyle: 'radial-gradient(circle at 50% 70%, #FF7043 50%, #E64A19 100%)',
    borderColor: '#BF360C',
    shadowLight: 'rgba(255,180,140,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🪸', minAge: 6,
  },
]

// ─── CONSTRUCȚIE ─────────────────────────────────────────────────
export const BUILDING_BLOCKS: Block[] = [
  {
    id: 'brick',
    name: 'Cărămidă', nameEn: 'Brick',
    category: 'building',
    bgStyle: `
      repeating-linear-gradient(
        transparent 0px, transparent 7px,
        rgba(0,0,0,0.18) 7px, rgba(0,0,0,0.18) 8px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 11px,
        rgba(0,0,0,0.12) 11px, rgba(0,0,0,0.12) 12px
      ),
      #C62828
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#8D1515',
    shadowLight: 'rgba(220,100,100,0.5)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🧱', minAge: 3,
  },
  {
    id: 'wood_plank',
    name: 'Scânduri', nameEn: 'Wood Plank',
    category: 'building',
    bgStyle: `
      repeating-linear-gradient(
        to bottom,
        #8D6E63 0px, #8D6E63 7px,
        #6D4C41 7px, #6D4C41 8px
      )
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#4E342E',
    shadowLight: 'rgba(200,160,120,0.5)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '🪵', minAge: 3,
  },
  {
    id: 'stone_brick',
    name: 'Piatră cioplită', nameEn: 'Stone Brick',
    category: 'building',
    bgStyle: `
      repeating-linear-gradient(
        transparent 0px, transparent 7px,
        rgba(0,0,0,0.15) 7px, rgba(0,0,0,0.15) 8px
      ),
      #546E7A
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#37474F',
    shadowLight: 'rgba(170,200,210,0.4)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '🪨', minAge: 3,
  },
  {
    id: 'glass',
    name: 'Sticlă', nameEn: 'Glass',
    category: 'building',
    bgStyle: 'linear-gradient(135deg, rgba(144,202,249,0.5) 0%, rgba(255,255,255,0.8) 40%, rgba(144,202,249,0.5) 100%)',
    borderColor: '#90CAF9',
    shadowLight: 'rgba(255,255,255,0.8)',
    shadowDark: 'rgba(0,80,180,0.15)',
    icon: '🪟', minAge: 5,
  },
  {
    id: 'dark_wood',
    name: 'Lemn închis', nameEn: 'Dark Wood',
    category: 'building',
    bgStyle: `
      repeating-linear-gradient(
        to bottom,
        #4E342E 0px, #4E342E 7px,
        #3E2723 7px, #3E2723 8px
      )
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#2C1810',
    shadowLight: 'rgba(120,70,50,0.4)',
    shadowDark: 'rgba(0,0,0,0.45)',
    icon: '🍂', minAge: 5,
  },
  {
    id: 'white_stone',
    name: 'Marmură', nameEn: 'Marble',
    category: 'building',
    bgStyle: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 40%, #FAFAFA 60%, #EEEEEE 100%)',
    borderColor: '#BDBDBD',
    shadowLight: 'rgba(255,255,255,0.9)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '🤍', minAge: 5,
  },
  {
    id: 'metal',
    name: 'Metal', nameEn: 'Metal',
    category: 'building',
    bgStyle: 'linear-gradient(135deg, #90A4AE 0%, #546E7A 50%, #90A4AE 100%)',
    borderColor: '#37474F',
    shadowLight: 'rgba(200,220,230,0.6)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '⚙️', minAge: 6,
  },
  {
    id: 'red_roof',
    name: 'Acoperiș', nameEn: 'Red Roof',
    category: 'building',
    bgStyle: 'linear-gradient(to bottom, #C62828 0%, #B71C1C 100%)',
    borderColor: '#7F0000',
    shadowLight: 'rgba(230,120,100,0.5)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🏠', minAge: 3,
  },
  {
    id: 'hay',
    name: 'Fân', nameEn: 'Hay',
    category: 'building',
    bgStyle: `
      repeating-linear-gradient(
        to bottom,
        #F9A825 0px, #F9A825 7px,
        #F57F17 7px, #F57F17 8px
      )
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#E65100',
    shadowLight: 'rgba(255,220,100,0.5)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '🌾', minAge: 3,
  },
  {
    id: 'cobblestone',
    name: 'Caldarâm', nameEn: 'Cobblestone',
    category: 'building',
    bgStyle: `
      radial-gradient(ellipse at 30% 30%, #78909C 0%, transparent 40%),
      radial-gradient(ellipse at 70% 70%, #607D8B 0%, transparent 40%),
      #546E7A
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#37474F',
    shadowLight: 'rgba(180,200,210,0.4)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '🗿', minAge: 3,
  },
]

// ─── CER ────────────────────────────────────────────────────────
export const SKY_BLOCKS: Block[] = [
  {
    id: 'cloud',
    name: 'Nor', nameEn: 'Cloud',
    category: 'sky',
    bgStyle: 'radial-gradient(ellipse at 50% 60%, #FAFAFA 50%, #E3F2FD 100%)',
    borderColor: '#BBDEFB',
    shadowLight: 'rgba(255,255,255,0.95)',
    shadowDark: 'rgba(100,150,220,0.2)',
    icon: '☁️', minAge: 3,
  },
  {
    id: 'sun',
    name: 'Soare', nameEn: 'Sun',
    category: 'sky',
    bgStyle: 'radial-gradient(circle, #FFD600 20%, #FF8F00 80%)',
    borderColor: '#E65100',
    shadowLight: 'rgba(255,230,50,0.7)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '☀️', minAge: 3,
  },
  {
    id: 'moon',
    name: 'Lună', nameEn: 'Moon',
    category: 'sky',
    bgStyle: 'radial-gradient(circle at 35% 35%, #FFF9C4 20%, #F9A825 80%)',
    borderColor: '#F57F17',
    shadowLight: 'rgba(255,250,180,0.7)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '🌙', minAge: 3,
  },
  {
    id: 'starry_sky',
    name: 'Cer înstelat', nameEn: 'Starry Sky',
    category: 'sky',
    bgStyle: 'linear-gradient(to bottom, #1A237E 0%, #311B92 100%)',
    borderColor: '#0D147A',
    shadowLight: 'rgba(160,130,240,0.4)',
    shadowDark: 'rgba(0,0,0,0.5)',
    icon: '⭐', minAge: 3,
  },
  {
    id: 'sky_blue',
    name: 'Cer albastru', nameEn: 'Blue Sky',
    category: 'sky',
    bgStyle: 'linear-gradient(to bottom, #29B6F6 0%, #4FC3F7 100%)',
    borderColor: '#0288D1',
    shadowLight: 'rgba(130,210,255,0.5)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '🌤️', minAge: 3,
  },
  {
    id: 'rainbow',
    name: 'Curcubeu', nameEn: 'Rainbow',
    category: 'sky',
    bgStyle: 'linear-gradient(to right, #F44336, #FF9800, #FFC107, #4CAF50, #2196F3, #9C27B0)',
    borderColor: '#7B1FA2',
    shadowLight: 'rgba(255,255,200,0.5)',
    shadowDark: 'rgba(0,0,0,0.2)',
    icon: '🌈', minAge: 3,
  },
]

// ─── MAGIC ──────────────────────────────────────────────────────
export const MAGIC_BLOCKS: Block[] = [
  {
    id: 'crystal',
    name: 'Cristal', nameEn: 'Crystal',
    category: 'magic',
    bgStyle: 'linear-gradient(135deg, #CE93D8 0%, #AB47BC 50%, #CE93D8 100%)',
    borderColor: '#7B1FA2',
    shadowLight: 'rgba(220,150,240,0.6)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '💎', minAge: 5,
  },
  {
    id: 'magic_flame',
    name: 'Foc magic', nameEn: 'Magic Flame',
    category: 'magic',
    bgStyle: 'linear-gradient(to top, #BF360C 0%, #FF6D00 40%, #FFD600 100%)',
    borderColor: '#870000',
    shadowLight: 'rgba(255,180,50,0.6)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🔥', minAge: 5,
  },
  {
    id: 'gold_block',
    name: 'Aur', nameEn: 'Gold Block',
    category: 'magic',
    bgStyle: 'linear-gradient(135deg, #FFD600 0%, #FF8F00 50%, #FFD600 100%)',
    borderColor: '#E65100',
    shadowLight: 'rgba(255,240,100,0.7)',
    shadowDark: 'rgba(0,0,0,0.3)',
    icon: '✨', minAge: 5,
    isRare: true,
  },
  {
    id: 'diamond',
    name: 'Diamant', nameEn: 'Diamond',
    category: 'magic',
    bgStyle: 'linear-gradient(135deg, #B2EBF2 0%, #00BCD4 50%, #E0F7FA 100%)',
    borderColor: '#0097A7',
    shadowLight: 'rgba(180,240,255,0.7)',
    shadowDark: 'rgba(0,0,0,0.25)',
    icon: '💠', minAge: 7,
    isRare: true,
  },
  {
    id: 'enchanted',
    name: 'Vrăjit', nameEn: 'Enchanted',
    category: 'magic',
    bgStyle: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 50%, #4A148C 100%)',
    borderColor: '#2D0060',
    shadowLight: 'rgba(180,100,250,0.5)',
    shadowDark: 'rgba(0,0,0,0.5)',
    icon: '🔮', minAge: 7,
    isRare: true,
  },
  {
    id: 'portal',
    name: 'Portal', nameEn: 'Portal',
    category: 'magic',
    bgStyle: 'linear-gradient(135deg, #00BFA5 0%, #1DE9B6 50%, #00BFA5 100%)',
    borderColor: '#00695C',
    shadowLight: 'rgba(100,255,220,0.6)',
    shadowDark: 'rgba(0,0,0,0.35)',
    icon: '🌀', minAge: 7,
    isRare: true,
  },
  {
    id: 'dragon_scale',
    name: 'Solzi de dragon', nameEn: 'Dragon Scale',
    category: 'magic',
    bgStyle: `
      repeating-linear-gradient(
        135deg,
        #1B5E20 0px, #1B5E20 5px,
        #2E7D32 5px, #2E7D32 10px
      )
    `.replace(/\s+/g, ' ').trim(),
    borderColor: '#003300',
    shadowLight: 'rgba(100,200,100,0.4)',
    shadowDark: 'rgba(0,0,0,0.45)',
    icon: '🐉', minAge: 7,
    isRare: true,
    geographyUnlock: 'china',
  },
  {
    id: 'star_dust',
    name: 'Praf de stele', nameEn: 'Star Dust',
    category: 'magic',
    bgStyle: 'linear-gradient(135deg, #FFD600 0%, #FF6F00 40%, #7B1FA2 100%)',
    borderColor: '#4A148C',
    shadowLight: 'rgba(255,230,100,0.6)',
    shadowDark: 'rgba(0,0,0,0.4)',
    icon: '🌠', minAge: 9,
    isRare: true,
  },
]

// ─── LISTA COMPLETĂ ──────────────────────────────────────────────
export const ALL_BLOCKS: Block[] = [
  ...GROUND_BLOCKS,
  ...WATER_BLOCKS,
  ...PLANT_BLOCKS,
  ...BUILDING_BLOCKS,
  ...SKY_BLOCKS,
  ...MAGIC_BLOCKS,
]

export const BLOCK_MAP = new Map<string, Block>(ALL_BLOCKS.map(b => [b.id, b]))

export function getBlocksForAge(age: number): Block[] {
  return ALL_BLOCKS.filter(b => !b.minAge || age >= b.minAge)
}

export function getBlocksByCategory(category: BlockCategory, age: number): Block[] {
  return getBlocksForAge(age).filter(b => b.category === category)
}

// ─── SCENE (înlocuiesc Rooms) ────────────────────────────────────

export interface BuildScene {
  id: string
  name: string
  nameEn: string
  emoji: string
  description: string
  skyGradient: string   // fundalul de sus
  groundColor: string   // bara de jos
  requiredCoins: number
}

export const BUILD_SCENES: BuildScene[] = [
  {
    id: 'magic_forest',
    name: 'Pădure Magică',
    nameEn: 'Magic Forest',
    emoji: '🌳',
    description: 'Construiește în inima unei păduri fermecate',
    skyGradient: 'linear-gradient(to bottom, #DCEDC8 0%, #C8E6C9 100%)',
    groundColor: '#8B6346',
    requiredCoins: 0,
  },
  {
    id: 'sunny_beach',
    name: 'Plajă Însorită',
    nameEn: 'Sunny Beach',
    emoji: '🏖️',
    description: 'Construiește castele de nisip lângă ocean',
    skyGradient: 'linear-gradient(to bottom, #B3E5FC 0%, #81D4FA 100%)',
    groundColor: '#F7D97A',
    requiredCoins: 60,
  },
  {
    id: 'snowy_mountain',
    name: 'Munți cu Zăpadă',
    nameEn: 'Snowy Mountain',
    emoji: '⛰️',
    description: 'Construiește în vârful munților înghețați',
    skyGradient: 'linear-gradient(to bottom, #ECEFF1 0%, #CFD8DC 100%)',
    groundColor: '#FAFAFA',
    requiredCoins: 100,
  },
  {
    id: 'night_city',
    name: 'Oraș de Noapte',
    nameEn: 'Night City',
    emoji: '🌃',
    description: 'Construiește un oraș strălucitor sub stele',
    skyGradient: 'linear-gradient(to bottom, #1A237E 0%, #283593 100%)',
    groundColor: '#37474F',
    requiredCoins: 150,
  },
  {
    id: 'ocean_depths',
    name: 'Adâncuri Oceanice',
    nameEn: 'Ocean Depths',
    emoji: '🌊',
    description: 'Construiește un oraș subacvatic',
    skyGradient: 'linear-gradient(to bottom, #0D47A1 0%, #01579B 100%)',
    groundColor: '#006064',
    requiredCoins: 220,
  },
  {
    id: 'cosmic_galaxy',
    name: 'Galaxie Cosmică',
    nameEn: 'Cosmic Galaxy',
    emoji: '🚀',
    description: 'Construiește o stație spațială în cosmos',
    skyGradient: 'linear-gradient(to bottom, #0A0A1E 0%, #1A0533 100%)',
    groundColor: '#1A237E',
    requiredCoins: 300,
  },
]

export const SCENE_MAP = new Map<string, BuildScene>(BUILD_SCENES.map(s => [s.id, s]))
