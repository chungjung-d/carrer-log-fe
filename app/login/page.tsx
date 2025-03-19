'use client'

import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px] space-y-6">
        {/* 로고나 타이틀 영역 */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Career Log</h1>
          <p className="text-sm text-muted-foreground">
            당신의 커리어를 기록하세요
          </p>
        </div>

        {/* 로그인 버튼 영역 */}
        <div className="space-y-4">
          <KakaoLoginButton />
        </div>
      </div>
    </main>
  )
} 