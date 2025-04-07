'use client'

import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-[400px] space-y-8">
        {/* 로고나 타이틀 영역 */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Career Log</h1>
            <p className="text-base text-gray-500">
              당신의 커리어를 기록하세요
            </p>
          </div>
        </div>

        {/* 로그인 버튼 영역 */}
        <div className="space-y-4">
          <KakaoLoginButton />
        </div>
      </div>
    </main>
  )
} 