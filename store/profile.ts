import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { profileApi, UserProfile } from '@/lib/api/profile';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  createProfile: (data: {
    name: string;
    nickname?: string;
    organization: string;
  }) => Promise<void>;
  getProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,
      createProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const profile = await profileApi.createProfile(data);
          set({ profile, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '프로필 생성에 실패했습니다',
            isLoading: false 
          });
          throw error;
        }
      },
      getProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const profile = await profileApi.getProfile();
          set({ profile, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '프로필 조회에 실패했습니다',
            isLoading: false 
          });
          throw error;
        }
      },
      clearProfile: () => {
        set({ profile: null, error: null });
      },
    }),
    {
      name: 'profile-storage',
    }
  ) as any
); 