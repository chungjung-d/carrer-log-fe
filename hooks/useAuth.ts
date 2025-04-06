import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import Cookies from 'js-cookie'

interface AuthUser {
  id: string
  email: string
}

interface AuthData {
  token: string
  user: AuthUser
}

interface AuthState {
  token: string | null
}

export const useAuth = () => {
  const queryClient = useQueryClient()

  const { data: authData } = useQuery<AuthState>({
    queryKey: ['auth'],
    queryFn: () => {
      const token = localStorage.getItem('access_token') || Cookies.get('access_token')
      if (!token) return { token: null }
      return { token }
    },
    staleTime: Infinity,
  })

  const loginMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await authApi.startKakaoLogin()
    },
  })

  const handleCallbackMutation = useMutation<AuthData, Error, string>({
    mutationFn: async (code: string) => {
      const response = await authApi.handleKakaoCallback(code)
      localStorage.setItem('access_token', response.token)
      Cookies.set('access_token', response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      return response
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], { token: data.token })
    },
  })

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      localStorage.removeItem('access_token')
      Cookies.remove('access_token')
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth'], { token: null })
    },
  })

  return {
    token: authData?.token,
    isAuthenticated: !!authData?.token,
    login: loginMutation.mutate,
    handleCallback: handleCallbackMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: handleCallbackMutation.isPending,
    error: handleCallbackMutation.error,
  }
} 