import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  login: () => void;
  handleCallback: (code: string) => Promise<void>;
  logout: () => void;
  setAuth: (auth: {
    token: string;
    user: {
      id: string;
      email: string;
    };
    isAuthenticated: boolean;
  }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: () => {
        authApi.startKakaoLogin();
      },
      handleCallback: async (code: string) => {
        try {
          const response = await authApi.handleKakaoCallback(code);
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setAuth: (auth) => {
        set(auth);
      },
    }),
    {
      name: 'auth-storage',
    }
  ) as any
); 