'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { jobSatisfactionApi } from '@/lib/api/job-satisfaction'

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

const SLIDER_COLORS = {
  업무: '#4F46E5', // 인디고
  보상: '#F59E0B', // 황색
  성장: '#10B981', // 에메랄드
  환경: '#EF4444', // 빨강
  관계: '#3B82F6', // 파랑
  가치: '#8B5CF6', // 보라
}

export default function ImportancePage() {
  const router = useRouter()
  const [values, setValues] = useState<ImportanceValues>({
    업무: 0,
    보상: 0,
    성장: 0,
    환경: 0,
    관계: 0,
    가치: 0
  })

  const calculateTotal = (currentValues: ImportanceValues) => {
    return Object.values(currentValues).reduce((sum, value) => sum + value, 0)
  }

  const handleChange = (key: keyof ImportanceValues, value: number) => {
    const newValues = { ...values, [key]: value }
    const total = calculateTotal(newValues)
    
    if (total > 100) {
      // 총합이 100을 초과하면 현재 변경하려는 값을 조정
      const adjustedValue = value - (total - 100)
      setValues({ ...values, [key]: adjustedValue })
    } else {
      setValues(newValues)
    }
  }

  const handleNext = async () => {
    if (calculateTotal(values) === 100) {
      try {
        await jobSatisfactionApi.createImportance({
          Workload: values.업무 || 0,
          Compensation: values.보상 || 0,
          Growth: values.성장 || 0,
          WorkEnvironment: values.환경 || 0,
          WorkRelationships: values.관계 || 0,
          WorkValues: values.가치 || 0,
        });
        router.push('/signup/satisfaction');
      } catch (error) {
        console.error('Error creating job satisfaction importance:', error);
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-10">
        <Link href="/signup" className="text-black">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <button 
          onClick={handleNext}
          className={cn(
            "font-medium transition-colors",
            calculateTotal(values) === 100 ? "text-[#007AFF]" : "text-[#007AFF]/30"
          )}
        >
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
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 leading-relaxed">
                  각 항목의 슬라이더를 조절하여 중요도를 설정해주세요.<br />
                  설정된 값은 향후 커리어 추천에 활용됩니다.
                </p>
                <div className="text-sm font-medium">
                  총합: <span className="text-[#007AFF]">{calculateTotal(values)}</span>/100
                </div>
              </div>
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
                        ${SLIDER_COLORS[key as keyof ImportanceValues]}30,
                        ${SLIDER_COLORS[key as keyof ImportanceValues]}10 30%,
                        ${SLIDER_COLORS[key as keyof ImportanceValues]}05 60%,
                        transparent
                      ),
                      linear-gradient(to bottom, 
                        transparent,
                        ${SLIDER_COLORS[key as keyof ImportanceValues]}05 100%
                      )
                    `,
                    backgroundBlendMode: 'overlay'
                  }} 
                />
                <div 
                  className="absolute top-0 left-0 w-full h-[2px] opacity-30"
                  style={{
                    background: `linear-gradient(to right, ${SLIDER_COLORS[key as keyof ImportanceValues]}, transparent)`
                  }}
                />
                <div className="space-y-4 relative">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: SLIDER_COLORS[key as keyof ImportanceValues] }}
                        />
                        <span className="font-medium text-[15px]">{key}</span>
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: SLIDER_COLORS[key as keyof ImportanceValues] }}
                      >
                        {value}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 ml-4">{IMPORTANCE_DESCRIPTIONS[key as keyof ImportanceValues]}</p>
                  </div>
                  <div className="relative px-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleChange(key as keyof ImportanceValues, Number(e.target.value))}
                      className="custom-slider"
                      style={{ 
                        '--value-percent': `${value}%`,
                        '--slider-color': SLIDER_COLORS[key as keyof ImportanceValues]
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