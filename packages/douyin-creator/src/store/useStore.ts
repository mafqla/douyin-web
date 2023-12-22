import { create } from 'zustand'

interface GlobalState {
  userInfo?: {
    name?: string
    avatar?: string
    job?: string
    organization?: string
    location?: string
    email?: string
    permissions: Record<string, string[]>
  }
  userLoading?: boolean
}

const useStore = create<GlobalState>((set) => ({
  userInfo: {
    permissions: {},
  },
  userLoading: false,
  updateUserInfo: (payload) => set({ ...payload }),
}))

export default useStore
