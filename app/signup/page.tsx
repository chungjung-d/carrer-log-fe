'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/useProfile'

export default function SignupPage() {
  const router = useRouter()
  const { createProfile, isCreating, createError } = useProfile()
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [nickname, setNickname] = useState('')

  const handleNext = async () => {
    if (name && organization && nickname) {
      try {
        await createProfile({
          name,
          organization,
          nickname,
        })
        router.push('/signup/importance')
      } catch (error) {
        console.error('프로필 생성 실패:', error)
      }
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <nav className="flex items-center justify-between px-4 py-3 border-b">
        <Link href="/login" className="text-black">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <button 
          className={cn(
            "font-medium transition-colors",
            name && organization && nickname ? "text-[#007AFF]" : "text-[#007AFF]/30"
          )}
          onClick={handleNext}
          disabled={isCreating}
        >
          {isCreating ? '처리 중...' : '다음'}
        </button>
      </nav>

      {/* 회원가입 폼 */}
      <div className="px-4 pt-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-[17px] font-medium">이름을 알려주세요</h2>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-0 py-2 text-base border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-[17px] font-medium">닉네임을 알려주세요</h2>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-0 py-2 text-base border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-[17px] font-medium">조직(회사)명을 알려주세요</h2>
            <input
              type="text"
              placeholder="조직명"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-0 py-2 text-base border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 placeholder:text-gray-400 text-gray-900"
            />
          </div>
        </div>

        {createError && (
          <div className="mt-4 text-red-500 text-sm">
            {createError.message}
          </div>
        )}
      </div>
    </main>
  )
} 