'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')

  const handleNext = () => {
    if (name && organization) {
      router.push('/signup/importance')
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
            name && organization ? "text-[#007AFF]" : "text-[#007AFF]/30"
          )}
          onClick={handleNext}
        >
          다음
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
              className="w-full px-0 py-2 text-base border-0 border-b border-gray-300 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-[17px] font-medium">조직(회사)명을 알려주세요</h2>
            <input
              type="text"
              placeholder="조직명"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-0 py-2 text-base border-0 border-b border-gray-300 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    </main>
  )
} 