import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Profile, LioEmotion, LioMessage, World } from '@/types'

interface GameState {
  // Profil curent
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  updateCoins: (amount: number) => void

  // Lumea activă
  activeWorld: World | null
  setActiveWorld: (world: World | null) => void

  // Mascota Lio
  lioEmotion: LioEmotion
  lioMessage: LioMessage | null
  showLio: (message: LioMessage) => void
  hideLio: () => void

  // Reward animation
  pendingCoins: number
  setPendingCoins: (coins: number) => void
  clearPendingCoins: () => void

  // Confetti
  showConfetti: boolean
  triggerConfetti: () => void
  stopConfetti: () => void

  // Sunet
  soundEnabled: boolean
  toggleSound: () => void
}

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set) => ({
        // Profil
        profile: null,
        setProfile: (profile) => set({ profile }),
        updateCoins: (amount) =>
          set((state) => ({
            profile: state.profile
              ? { ...state.profile, coins: Math.max(0, state.profile.coins + amount) }
              : null,
          })),

        // Lumea activă
        activeWorld: null,
        setActiveWorld: (world) => set({ activeWorld: world }),

        // Lio
        lioEmotion: 'happy',
        lioMessage: null,
        showLio: (message) =>
          set({ lioMessage: message, lioEmotion: message.emotion }),
        hideLio: () => set({ lioMessage: null }),

        // Reward
        pendingCoins: 0,
        setPendingCoins: (coins) => set({ pendingCoins: coins }),
        clearPendingCoins: () => set({ pendingCoins: 0 }),

        // Confetti
        showConfetti: false,
        triggerConfetti: () => set({ showConfetti: true }),
        stopConfetti: () => set({ showConfetti: false }),

        // Sunet
        soundEnabled: false,
        toggleSound: () =>
          set((state) => ({ soundEnabled: !state.soundEnabled })),
      }),
      {
        name: 'playlio-game-store',
        partialize: (state) => ({
          soundEnabled: state.soundEnabled,
          activeWorld: state.activeWorld,
        }),
      }
    )
  )
)
