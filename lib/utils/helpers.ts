import { COIN_REWARDS } from './constants'

/**
 * Generează o valoare aleatorie între min și max (inclusiv)
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Coins pentru un quest în funcție de dificultate
 */
export function getQuestCoins(
  difficulty: 'easy' | 'medium' | 'hard' | 'special'
): number {
  switch (difficulty) {
    case 'easy':
      return randomBetween(COIN_REWARDS.QUEST_EASY.min, COIN_REWARDS.QUEST_EASY.max)
    case 'medium':
      return randomBetween(COIN_REWARDS.QUEST_MEDIUM.min, COIN_REWARDS.QUEST_MEDIUM.max)
    case 'hard':
      return randomBetween(COIN_REWARDS.QUEST_HARD.min, COIN_REWARDS.QUEST_HARD.max)
    case 'special':
      return randomBetween(COIN_REWARDS.QUEST_SPECIAL.min, COIN_REWARDS.QUEST_SPECIAL.max)
  }
}

/**
 * Formatează coins cu separator de mii
 */
export function formatCoins(amount: number): string {
  return amount.toLocaleString('ro-RO')
}

/**
 * Formatează secunde în format MM:SS
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Formatează minute în text lizibil
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

/**
 * Calculează XP necesar pentru următorul nivel
 */
export function xpForNextLevel(level: number): number {
  return level * 100
}

/**
 * Calculează procentul de progres spre nivelul următor
 */
export function levelProgress(xp: number, level: number): number {
  const xpNeeded = xpForNextLevel(level)
  const xpPrev = level > 1 ? xpForNextLevel(level - 1) : 0
  return Math.min(100, Math.round(((xp - xpPrev) / (xpNeeded - xpPrev)) * 100))
}

/**
 * Returnează un salut bazat pe ora curentă
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bună dimineața'
  if (hour < 18) return 'Bună ziua'
  return 'Bună seara'
}

/**
 * Verifică dacă o dată este azi
 */
export function isToday(date: Date | string): boolean {
  const d = new Date(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Delay async util
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Truncat text la un număr de caractere
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}
