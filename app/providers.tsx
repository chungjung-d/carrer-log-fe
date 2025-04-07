'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnWindowFocus: false,
    },
  },
})

function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // 루트 경로로 접근했을 때 로그인 페이지로 리다이렉트
    if (pathname === '/') {
      router.push('/login')
      return
    }

    // 인증이 필요하지 않은 경로들
    const publicPaths = ['/login', '/auth/callback']
    
    // 현재 경로가 public paths에 포함되어 있다면 체크 스킵
    if (publicPaths.some(path => pathname.startsWith(path))) {
      return
    }

    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('access_token')
    
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      router.push('/login')
    }
  }, [pathname, router])

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthCheck>
        {children}
      </AuthCheck>
    </QueryClientProvider>
  )
} 