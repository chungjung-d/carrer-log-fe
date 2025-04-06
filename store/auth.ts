import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import Cookies from 'js-cookie';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: () => void;
  handleCallback: (code: string) => Promise<void>;
  logout: () => void;
  setAuth: (auth: {
    token: string;
    user: AuthUser;
    isAuthenticated: boolean;
  }) => void;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

export const useAuthStore = create<AuthState>()(
  (persist as AuthPersist)(
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
          // localStorage와 쿠키에 토큰 저장
          localStorage.setItem('access_token', response.token);
          Cookies.set('access_token', response.token, { 
            expires: 7, // 7일 후 만료
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
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
        // localStorage와 쿠키에서 토큰 삭제
        localStorage.removeItem('access_token');
        Cookies.remove('access_token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setAuth: (auth: {
        token: string;
        user: AuthUser;
        isAuthenticated: boolean;
      }) => {
        // localStorage와 쿠키에 토큰 저장
        localStorage.setItem('access_token', auth.token);
        Cookies.set('access_token', auth.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        set(auth);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const state = JSON.parse(str);
          // localStorage와 쿠키에서 토큰을 가져와서 상태와 동기화
          const token = localStorage.getItem('access_token') || Cookies.get('access_token');
          if (token) {
            state.state.token = token;
          }
          return JSON.stringify(state);
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
); 