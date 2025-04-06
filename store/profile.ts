import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { profileApi, UserProfile } from '@/lib/api/profile';

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'profile-storage',
    }
  )
); 