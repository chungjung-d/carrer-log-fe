'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import Autoplay from 'embla-carousel-autoplay'
import { type CarouselApi } from "@/components/ui/carousel"
import { TotalScoreCard } from "@/components/charts/TotalScoreCard"
import { DetailScoreCard } from "@/components/charts/DetailScoreCard"
import { BalanceChartCard } from "@/components/charts/BalanceChartCard"

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
          <CarouselContent className="h-[450px]">
            {/* 총점 카드 */}
            <CarouselItem className="h-full">
              <TotalScoreCard score={averageScore} categories={CATEGORIES} />
            </CarouselItem>

            {/* 상세 점수 카드 */}
            <CarouselItem className="h-full">
              <DetailScoreCard categories={CATEGORIES} />
            </CarouselItem>

            {/* 레이더 차트 카드 */}
            <CarouselItem className="h-full">
              <BalanceChartCard categories={CATEGORIES} />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>

        {/* 페이지 인디케이터 */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all cursor-pointer ${i === activeSlide ? 'bg-blue-500 w-6' : 'bg-gray-300 w-2'}`} 
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 