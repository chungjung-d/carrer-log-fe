'use client'

import { useUserStore } from '@/store/userStore'
import { TotalScoreCard } from '@/components/charts/TotalScoreCard'
import { DetailScoreCard } from '@/components/charts/DetailScoreCard'
import { BalanceChartCard } from '@/components/charts/BalanceChartCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Plus } from 'lucide-react'

const CATEGORIES = {
  업무: { color: '#3B82F6', score: 85 },
  보상: { color: '#10B981', score: 75 },
  성장: { color: '#F59E0B', score: 90 },
  환경: { color: '#EF4444', score: 80 },
  관계: { color: '#8B5CF6', score: 85 },
  가치: { color: '#EC4899', score: 70 },
}

const AVERAGE_SCORE = Math.round(
  Object.values(CATEGORIES).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(CATEGORIES).length
)

export default function MyPage() {
  const { userInfo } = useUserStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {userInfo.name[0]}
            </div>
            <h1 className="text-xl font-bold">{userInfo.name}님의<br/>현재 커리어 만족도는</h1>
          </div>
          {userInfo.organization && (
            <p className="text-sm text-gray-500 ml-13">{userInfo.organization}</p>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <TotalScoreCard score={AVERAGE_SCORE} categories={CATEGORIES} />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <DetailScoreCard categories={CATEGORIES} />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <BalanceChartCard categories={CATEGORIES} />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* 플로팅 추가 버튼 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
} 