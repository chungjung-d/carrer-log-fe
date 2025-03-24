'use client'

import { useUserStore } from '@/store/userStore'
import { TotalScoreCard } from '@/components/charts/TotalScoreCard'
import { DetailScoreCard } from '@/components/charts/DetailScoreCard'
import { BalanceChartCard } from '@/components/charts/BalanceChartCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Plus, PenLine, Sparkles } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'

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
            <CarouselItem>
              <TotalScoreCard score={AVERAGE_SCORE} categories={CATEGORIES} />
            </CarouselItem>
            <CarouselItem>
              <DetailScoreCard categories={CATEGORIES} />
            </CarouselItem>
            <CarouselItem>
              <BalanceChartCard categories={CATEGORIES} />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* 플로팅 추가 버튼 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl px-4">
            <div className="pt-8">
              <SheetTitle className="text-xl font-bold text-center mb-6">
                오늘 업무에서 성취감을 느꼈던 적은 언제인가요?
              </SheetTitle>
              <SheetDescription className="sr-only">
                자유롭게 작성하거나 AI의 도움을 받아 작성할 수 있습니다.
              </SheetDescription>
              <div className="space-y-3">
                <button className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <PenLine className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">자유롭게 작성하기</div>
                    <div className="text-sm text-gray-500">나만의 방식으로 기록해보세요</div>
                  </div>
                </button>
                <button className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">AI의 도움받기</div>
                    <div className="text-sm text-gray-500">AI와 대화하며 기록해보세요</div>
                  </div>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
} 