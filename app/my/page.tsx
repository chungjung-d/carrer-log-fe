'use client'

import { useUserStore } from '@/store/userStore'
import { TotalScoreCard } from '@/components/charts/TotalScoreCard'
import { DetailScoreCard } from '@/components/charts/DetailScoreCard'
import { BalanceChartCard } from '@/components/charts/BalanceChartCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Plus, PenLine, Sparkles, ChevronRight, ArrowLeft, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet'
import { useState } from 'react'

// 모킹 데이터
const MOCK_TOPICS = [
  {
    id: 1,
    content: "오늘 업무에서 성취감을 느꼈던 적은 언제인가요?",
  },
  {
    id: 2,
    content: "최근 동료와의 관계에서 어려움을 겪은 적이 있나요?",
  },
  {
    id: 3,
    content: "현재 업무 환경에서 개선되었으면 하는 점은 무엇인가요?",
  },
  {
    id: 4,
    content: "자신의 성장을 위해 최근 시도한 것이 있다면 무엇인가요?",
  }
]

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
  const [isTopicMode, setIsTopicMode] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(() => 
    MOCK_TOPICS[Math.floor(Math.random() * MOCK_TOPICS.length)]
  )

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
        <Sheet onOpenChange={() => setIsTopicMode(false)}>
          <SheetTrigger asChild>
            <button className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[45vh] rounded-t-3xl px-4 animate-slide-up">
            <div className="pt-6">
              {isTopicMode ? (
                <>
                  <SheetHeader className="relative mb-6 text-left space-y-0">
                    <button 
                      onClick={() => setIsTopicMode(false)}
                      className="absolute -left-1 top-1/2 -translate-y-1/2 p-1 hover:text-blue-500 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="pl-7">
                      <SheetTitle className="text-base font-medium text-gray-500">오늘의 주제</SheetTitle>
                      <p className="text-sm text-gray-400">좌우로 스와이프하여 다른 주제를 확인해보세요</p>
                    </div>
                  </SheetHeader>
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                    onMouseEnter={() => {
                      const guide = document.getElementById('swipe-guide')
                      if (guide) guide.style.opacity = '1'
                    }}
                    onMouseLeave={() => {
                      const guide = document.getElementById('swipe-guide')
                      if (guide) guide.style.opacity = '0'
                    }}
                  >
                    <div className="relative">
                      <CarouselContent>
                        {MOCK_TOPICS.map((topic) => (
                          <CarouselItem key={topic.id}>
                            <div className="relative bg-white p-6 rounded-2xl border border-gray-100">
                              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                              <div className="pl-4">
                                <p className="text-lg font-medium text-gray-900 mb-4">{topic.content}</p>
                                <button 
                                  onClick={() => setCurrentTopic(topic)}
                                  className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                                >
                                  이 주제로 기록하기
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div 
                        id="swipe-guide"
                        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 ease-in-out"
                        style={{
                          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0) 15%, rgba(255, 255, 255, 0) 85%, rgba(59, 130, 246, 0.1) 100%)'
                        }}
                      >
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 animate-pulse">
                          <ChevronLeft className="w-6 h-6" />
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 animate-pulse">
                          <ChevronRightIcon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-1">
                      {MOCK_TOPICS.map((topic, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            topic.id === currentTopic.id ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </Carousel>
                </>
              ) : (
                <>
                  <SheetTitle className="text-xl font-bold text-center mb-6">
                    기록 시작하기
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    자유롭게 작성하거나 추천 주제로 기록할 수 있습니다.
                  </SheetDescription>
                  <div className="space-y-3">
                    <button className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <PenLine className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">자유롭게 기록하기</div>
                        <div className="text-sm text-gray-500">나만의 방식으로 기록해보세요</div>
                      </div>
                    </button>
                    <button 
                      className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group"
                      onClick={() => setIsTopicMode(true)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">추천 주제로 기록하기</div>
                        <div className="text-sm text-gray-500">오늘의 추천 주제로 시작해보세요</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
} 