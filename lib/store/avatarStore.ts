import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AvatarConfig } from '@/types'

const DEFAULT_AVATAR: AvatarConfig = {
  hair_color: '#3E2723',
  hair_style: 'short',
  skin_tone: '#FFCCBC',
  eye_color: '#1565C0',
  outfit_style: 'casual',
  outfit_color: '#4FC3F7',
  accessories: [],
}

interface AvatarState {
  config: AvatarConfig
  isDirty: boolean
  updateConfig: (partial: Partial<AvatarConfig>) => void
  resetConfig: () => void
  loadConfig: (config: AvatarConfig) => void
  markSaved: () => void
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      config: DEFAULT_AVATAR,
      isDirty: false,

      updateConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
          isDirty: true,
        })),

      resetConfig: () =>
        set({ config: DEFAULT_AVATAR, isDirty: false }),

      loadConfig: (config) =>
        set({ config, isDirty: false }),

      markSaved: () =>
        set({ isDirty: false }),
    }),
    {
      name: 'playlio-avatar-store',
    }
  )
)
