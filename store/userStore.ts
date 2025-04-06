import { create } from 'zustand'
import { profileApi } from '@/lib/api/profile'

interface UserInfo {
  name: string
  organization: string
}

interface UserStore {
  userInfo: UserInfo | null
  isLoading: boolean
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
  fetchUserInfo: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  isLoading: true,
  setUserInfo: (info: UserInfo) => set({ userInfo: info, isLoading: false }),
  clearUserInfo: () => set({ userInfo: null, isLoading: false }),
  fetchUserInfo: async () => {
    try {
      set({ isLoading: true })
      const profile = await profileApi.getProfile()
      set({ 
        userInfo: {
          name: profile.data.name,
          organization: profile.data.organization,
        },
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
      set({ isLoading: false })
    }
  }
})) 