'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import Autoplay from 'embla-carousel-autoplay'
import { type CarouselApi } from "@/components/ui/carousel"

const CATEGORIES = {
  업무: { color: '#4F46E5', score: 76 },
  보상: { color: '#F59E0B', score: 65 },
  성장: { color: '#10B981', score: 82 },
  환경: { color: '#EF4444', score: 45 },
  관계: { color: '#3B82F6', score: 70 },
  가치: { color: '#8B5CF6', score: 68 }
}

export default function MyPage() {
  const [mounted, setMounted] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [activeSlide, setActiveSlide] = useState(0)
  const averageScore = Math.round(
    Object.values(CATEGORIES).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(CATEGORIES).length
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setActiveSlide(api.selectedScrollSnap())
    })
  }, [api])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              이주
            </div>
            <h1 className="text-xl font-bold">이주형님의<br/>현재 커리어 만족도는</h1>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Carousel 
          className="w-full" 
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          setApi={setApi}
          opts={{
            loop: true,
            align: 'start',
          }}
        >
          <CarouselContent className="h-[400px]">
            {/* 총점 카드 */}
            <CarouselItem className="h-full">
              <Card className="relative overflow-hidden bg-white border-0 shadow-lg h-full">
                <CardContent className="p-8 flex flex-col items-center justify-center h-full">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl transform scale-150" />
                      </div>
                      <h2 className="text-7xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {averageScore}
                      </h2>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 text-lg">종합 평가 점수</p>
                      <p className="text-sm text-gray-400 mt-1">전체 항목의 평균 점수입니다</p>
                    </div>
                  </div>
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
                    <div className="absolute inset-0" style={{
                      background: `
                        radial-gradient(circle at center,
                          transparent 0%,
                          ${Object.values(CATEGORIES).map((cat, i) => 
                            `${cat.color}05 ${(i + 1) * 15}%`
                          ).join(', ')}
                        )
                      `
                    }} />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            {/* 상세 점수 카드 */}
            <CarouselItem className="h-full">
              <Card className="bg-white border-0 shadow-lg h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-6">상세 항목 점수</h3>
                  <div className="space-y-6 flex-1 flex flex-col justify-center">
                    {Object.entries(CATEGORIES).map(([key, { color, score }]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            <span className="font-medium text-gray-700">{key}</span>
                          </div>
                          <span className="text-sm font-semibold" style={{ color }}>{score}점</span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={score} 
                            className="h-2 rounded-full overflow-hidden"
                            style={{ 
                              background: `linear-gradient(to right, ${color}15, ${color}05)`,
                              '--progress-foreground': color
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            {/* 레이더 차트 카드 */}
            <CarouselItem className="h-full">
              <Card className="bg-white border-0 shadow-lg h-full">
                <CardContent className="p-8 h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-6">밸런스 차트</h3>
                  <div className="flex-1 relative flex items-center justify-center">
                    <svg viewBox="-10 -10 120 120" className="w-full h-full max-h-[300px]">
                      {/* 배경 육각형들 - 여러 레벨 */}
                      {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
                        <polygon 
                          key={i}
                          points={`
                            ${50 + (40 * level) * Math.cos(Math.PI / 2)},${50 - (40 * level) * Math.sin(Math.PI / 2)}
                            ${50 + (40 * level) * Math.cos(Math.PI / 6)},${50 - (40 * level) * Math.sin(Math.PI / 6)}
                            ${50 + (40 * level) * Math.cos(-Math.PI / 6)},${50 - (40 * level) * Math.sin(-Math.PI / 6)}
                            ${50 + (40 * level) * Math.cos(-Math.PI / 2)},${50 - (40 * level) * Math.sin(-Math.PI / 2)}
                            ${50 + (40 * level) * Math.cos(-5 * Math.PI / 6)},${50 - (40 * level) * Math.sin(-5 * Math.PI / 6)}
                            ${50 + (40 * level) * Math.cos(-7 * Math.PI / 6)},${50 - (40 * level) * Math.sin(-7 * Math.PI / 6)}
                          `}
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />
                      ))}
                      
                      {/* 데이터 육각형 */}
                      <polygon 
                        points={`
                          ${50 + 40 * (CATEGORIES.업무.score / 100) * Math.cos(Math.PI / 2)},${50 - 40 * (CATEGORIES.업무.score / 100) * Math.sin(Math.PI / 2)}
                          ${50 + 40 * (CATEGORIES.보상.score / 100) * Math.cos(Math.PI / 6)},${50 - 40 * (CATEGORIES.보상.score / 100) * Math.sin(Math.PI / 6)}
                          ${50 + 40 * (CATEGORIES.성장.score / 100) * Math.cos(-Math.PI / 6)},${50 - 40 * (CATEGORIES.성장.score / 100) * Math.sin(-Math.PI / 6)}
                          ${50 + 40 * (CATEGORIES.환경.score / 100) * Math.cos(-Math.PI / 2)},${50 - 40 * (CATEGORIES.환경.score / 100) * Math.sin(-Math.PI / 2)}
                          ${50 + 40 * (CATEGORIES.관계.score / 100) * Math.cos(-5 * Math.PI / 6)},${50 - 40 * (CATEGORIES.관계.score / 100) * Math.sin(-5 * Math.PI / 6)}
                          ${50 + 40 * (CATEGORIES.가치.score / 100) * Math.cos(-7 * Math.PI / 6)},${50 - 40 * (CATEGORIES.가치.score / 100) * Math.sin(-7 * Math.PI / 6)}
                        `}
                        fill="rgba(59, 130, 246, 0.1)"
                        stroke="#3B82F6"
                        strokeWidth="1"
                      />

                      {/* 카테고리 라벨 */}
                      <text x="50" y="5" textAnchor="middle" className="text-[6px] font-medium">업무</text>
                      <text x="95" y="30" textAnchor="start" className="text-[6px] font-medium">보상</text>
                      <text x="95" y="70" textAnchor="start" className="text-[6px] font-medium">성장</text>
                      <text x="50" y="95" textAnchor="middle" className="text-[6px] font-medium">환경</text>
                      <text x="5" y="70" textAnchor="end" className="text-[6px] font-medium">관계</text>
                      <text x="5" y="30" textAnchor="end" className="text-[6px] font-medium">가치</text>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>

        {/* 페이지 인디케이터 */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all ${i === activeSlide ? 'bg-blue-500 w-4' : 'bg-gray-300'}`} 
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 