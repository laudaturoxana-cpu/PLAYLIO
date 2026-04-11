export type Lang = 'ro' | 'en'

export const translations = {
  ro: {
    // ── Nav ──
    nav_home: 'Acasă',
    nav_letters: 'Litere',
    nav_numbers: 'Cifre',
    nav_adventure: 'Aventură',
    nav_builder: 'Builder',
    nav_jump: 'Jump',

    // ── Worlds page ──
    worlds_greeting: 'Salut, {name}! 👋',
    worlds_subtitle: 'În ce lume ne aventurăm azi?',
    worlds_playing_as: '🦁 Joci ca {name}',
    worlds_tip_title: 'SFATUL ZILEI',
    worlds_tip_body: 'Joacă 10 minute pe zi în Lumea Literelor ca să avansezi rapid!',
    worlds_parent_btn: 'Părinți',
    label_level: 'NIVEL',

    // ── World names ──
    world_letters_name: 'Litere',
    world_letters_sub: 'Fonică & Citire',
    world_adventure_name: 'Aventură',
    world_adventure_sub: 'Explorează & Stele',
    world_builder_name: 'Builder',
    world_builder_sub: 'Construiește & Creează',
    world_numbers_name: 'Cifre',
    world_numbers_sub: 'Matematică & Numărare',
    world_jump_name: 'Jump!',
    world_jump_sub: 'Sari & Aleargă',

    // ── Common buttons ──
    btn_continue: 'Continuă →',
    btn_back: '←',
    btn_save: 'Salvează',
    btn_explore: 'Să explorăm! 🚀',
  },

  en: {
    // ── Nav ──
    nav_home: 'Home',
    nav_letters: 'Letters',
    nav_numbers: 'Numbers',
    nav_adventure: 'Adventure',
    nav_builder: 'Builder',
    nav_jump: 'Jump',

    // ── Worlds page ──
    worlds_greeting: 'Hi, {name}! 👋',
    worlds_subtitle: 'Which world are we exploring today?',
    worlds_playing_as: '🦁 Playing as {name}',
    worlds_tip_title: 'DAILY TIP',
    worlds_tip_body: 'Play 10 minutes a day in Letters World to level up fast!',
    worlds_parent_btn: 'Parents',
    label_level: 'LEVEL',

    // ── World names ──
    world_letters_name: 'Letters',
    world_letters_sub: 'Phonics & Reading',
    world_adventure_name: 'Adventure',
    world_adventure_sub: 'Explore & Stars',
    world_builder_name: 'Builder',
    world_builder_sub: 'Decorate & Create',
    world_numbers_name: 'Numbers',
    world_numbers_sub: 'Math & Counting',
    world_jump_name: 'Jump!',
    world_jump_sub: 'Platforms & Jumps',

    // ── Common buttons ──
    btn_continue: 'Continue →',
    btn_back: '←',
    btn_save: 'Save',
    btn_explore: 'Let\'s explore! 🚀',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type TranslationKey = keyof typeof translations.ro

export function t(
  lang: Lang,
  key: TranslationKey,
  vars?: Record<string, string>,
): string {
  let str: string = translations[lang][key]
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, v)
    }
  }
  return str
}
