import { create } from 'zustand'
//持久化存储
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

export type ConfigState = {
  theme: string
  updateTheme: (theme: 'light' | 'dark') => void
}

const useConfigStore = create<ConfigState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        updateTheme: (theme: string) => set({ theme })
      }),
      {
        name: 'config-storage',
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
)

export default useConfigStore
