'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

type SatisfactionValues = {
  업무: number
  보상: number
  성장: number
  환경: number
  관계: number
  가치: number
}

const SATISFACTION_DESCRIPTIONS = {
  업무: '현재 업무 내용과 난이도에 대한 만족도',
  보상: '현재 급여와 복리후생에 대한 만족도',
  성장: '현재 성장 가능성과 자기계발 기회에 대한 만족도',
  환경: '현재 근무 환경과 문화에 대한 만족도',
  관계: '현재 동료와의 관계에 대한 만족도',
  가치: '현재 회사의 비전과 가치관에 대한 만족도'
}

// 파란색 계열의 차분한 색상으로 통일
const SLIDER_COLORS = {
  업무: '#4F46E5', // 인디고
  보상: '#F59E0B', // 황색
  성장: '#10B981', // 에메랄드
  환경: '#EF4444', // 빨강
  관계: '#3B82F6', // 파랑
  가치: '#8B5CF6', // 보라
}

export default function SatisfactionPage() {
  const [values, setValues] = useState<SatisfactionValues>({
    업무: 0,
    보상: 0,
    성장: 0,
    환경: 0,
    관계: 0,
    가치: 0,
  })

  const handleChange = (key: keyof SatisfactionValues, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-10">
        <Link href="/signup/importance" className="text-black">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <button className="text-[#007AFF] font-medium">
          다음
        </button>
      </nav>

      {/* 만족도 입력 폼 */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-3">
              <div className="inline-block">
                <h2 className="text-xl font-semibold relative">
                  현재 회사에 대한 만족도를 평가해주세요
                  <div className="absolute bottom-0 left-0 w-full h-[6px] bg-blue-100 -z-10 translate-y-[2px]" />
                </h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                각 항목에 대한 현재 만족도를 설정해주세요.<br />
                이 정보는 더 나은 커리어 제안을 위해 활용됩니다.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {Object.entries(values).map(([key, value]) => (
              <div 
                key={key} 
                className="bg-white rounded-xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] relative overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 opacity-[0.03] transition-opacity duration-200 group-hover:opacity-[0.07]"
                  style={{ 
                    background: `
                      linear-gradient(to right, 
                        ${SLIDER_COLORS[key as keyof SatisfactionValues]}30,
                        ${SLIDER_COLORS[key as keyof SatisfactionValues]}10 30%,
                        ${SLIDER_COLORS[key as keyof SatisfactionValues]}05 60%,
                        transparent
                      ),
                      linear-gradient(to bottom, 
                        transparent,
                        ${SLIDER_COLORS[key as keyof SatisfactionValues]}05 100%
                      )
                    `,
                    backgroundBlendMode: 'overlay'
                  }} 
                />
                <div 
                  className="absolute top-0 left-0 w-full h-[2px] opacity-30"
                  style={{
                    background: `linear-gradient(to right, ${SLIDER_COLORS[key as keyof SatisfactionValues]}, transparent)`
                  }}
                />
                <div className="space-y-4 relative">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: SLIDER_COLORS[key as keyof SatisfactionValues] }}
                        />
                        <span className="font-medium text-[15px]">{key}</span>
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: SLIDER_COLORS[key as keyof SatisfactionValues] }}
                      >
                        {value}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 ml-4">{SATISFACTION_DESCRIPTIONS[key as keyof SatisfactionValues]}</p>
                  </div>
                  <div className="relative px-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleChange(key as keyof SatisfactionValues, Number(e.target.value))}
                      className="custom-slider"
                      style={{ 
                        '--value-percent': `${value}%`,
                        '--slider-color': SLIDER_COLORS[key as keyof SatisfactionValues]
                      } as React.CSSProperties}
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