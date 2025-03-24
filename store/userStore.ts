import { create } from 'zustand'

interface UserInfo {
  name: string
  organization: string
}

interface UserStore {
  userInfo: UserInfo
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: {
    name: '이주형',
    organization: '',
  },
  setUserInfo: (info: UserInfo) => set({ userInfo: info }),
  clearUserInfo: () => set({ userInfo: { name: '', organization: '' } }),
})) 