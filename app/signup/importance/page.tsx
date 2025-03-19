'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

type ImportanceValues = {
  업무: number
  보상: number
  성장: number
  환경: number
  관계: number
  가치: number
}

const IMPORTANCE_DESCRIPTIONS = {
  업무: '업무 내용과 난이도',
  보상: '급여 및 복리후생',
  성장: '성장 가능성과 자기계발',
  환경: '근무 환경과 문화',
  관계: '동료와의 관계',
  가치: '회사의 비전과 가치관'
}

export default function ImportancePage() {
  const [values, setValues] = useState<ImportanceValues>({
    업무: 0,
    보상: 0,
    성장: 0,
    환경: 0,
    관계: 0,
    가치: 0,
  })

  const handleChange = (key: keyof ImportanceValues, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-10">
        <Link href="/signup" className="text-black">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <button className="text-[#007AFF] font-medium">
          다음
        </button>
      </nav>

      {/* 중요도 입력 폼 */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-3">
              <div className="inline-block">
                <h2 className="text-xl font-semibold relative">
                  각 영역의 중요도를 설정해주세요
                  <div className="absolute bottom-0 left-0 w-full h-[6px] bg-blue-100 -z-10 translate-y-[2px]" />
                </h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                각 항목의 슬라이더를 조절하여 중요도를 설정해주세요.<br />
                설정된 값은 향후 커리어 추천에 활용됩니다.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-[15px]">{key}</span>
                      <span className="text-sm font-medium text-blue-500">{value}%</span>
                    </div>
                    <p className="text-sm text-gray-500">{IMPORTANCE_DESCRIPTIONS[key as keyof ImportanceValues]}</p>
                  </div>
                  <div className="relative px-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleChange(key as keyof ImportanceValues, Number(e.target.value))}
                      className="custom-slider"
                      style={{ '--value-percent': `${value}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 