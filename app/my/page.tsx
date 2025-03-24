'use client'

import { useUserStore } from '@/store/userStore'
import { TotalScoreCard } from '@/components/charts/TotalScoreCard'
import { DetailScoreCard } from '@/components/charts/DetailScoreCard'
import { BalanceChartCard } from '@/components/charts/BalanceChartCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Plus, PenLine, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const { userInfo } = useUserStore()
  const [isTopicMode, setIsTopicMode] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(MOCK_TOPICS[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pressIntensity, setPressIntensity] = useState(0)
  const [isExploding, setIsExploding] = useState(false)
  const [canNavigateToChat, setCanNavigateToChat] = useState(true)
  const animationTimer = useRef<number | null>(null)

  const handlePressStart = useCallback(() => {
    setPressIntensity(0)
    setIsExploding(false)
    setCanNavigateToChat(true)
    
    animationTimer.current = window.setInterval(() => {
      setPressIntensity(prev => {
        if (prev >= 100) {
          if (animationTimer.current) {
            window.clearInterval(animationTimer.current)
          }
          setIsExploding(true)
          setCanNavigateToChat(false)
          setTimeout(() => {
            setIsRefreshing(true)
            const currentIndex = MOCK_TOPICS.findIndex(t => t.id === currentTopic.id)
            const nextIndex = (currentIndex + 1) % MOCK_TOPICS.length
            setCurrentTopic(MOCK_TOPICS[nextIndex])
            setIsExploding(false)
            setIsRefreshing(false)
            // 1초 후에 채팅 이동 허용
            setTimeout(() => {
              setCanNavigateToChat(true)
            }, 1000)
          }, 300)
          return 0
        }
        return prev + 3
      })
    }, 20)
  }, [currentTopic])

  const handlePressEnd = useCallback(() => {
    if (animationTimer.current) {
      window.clearInterval(animationTimer.current)
      if (pressIntensity < 80 && canNavigateToChat) {
        // 터지기 전에 놓으면 채팅 페이지로 이동
        router.push('/chat/CHAT_1')
      }
      setPressIntensity(0)
    }
  }, [pressIntensity, router, canNavigateToChat])

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
                      <p className="text-sm text-gray-400">카드를 길게 눌러 새로운 주제를 확인해보세요</p>
                    </div>
                  </SheetHeader>
                  <Carousel
                    opts={{
                      align: "center",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      <CarouselItem className="pl-2 md:pl-4 basis-full">
                        <div 
                          className={`relative bg-white p-4 rounded-2xl border border-gray-100 min-h-[140px] flex flex-col transition-all duration-300 overflow-hidden
                            ${isExploding ? 'scale-105' : ''} 
                            ${isRefreshing ? 'scale-95 opacity-50' : ''}`}
                          onMouseDown={handlePressStart}
                          onMouseUp={handlePressEnd}
                          onMouseLeave={handlePressEnd}
                          onTouchStart={handlePressStart}
                          onTouchEnd={handlePressEnd}
                        >
                          <div 
                            className="absolute inset-0 bg-blue-500 transition-all duration-200"
                            style={{ 
                              opacity: pressIntensity / 100,
                            }} 
                          />
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                          <div className="pl-4 flex flex-col flex-1 relative">
                            <p className="text-base font-medium text-gray-900 mb-3 flex-1">{currentTopic.content}</p>
                            <button 
                              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                            >
                              이 주제로 기록하기
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
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
                    <button 
                      onClick={() => router.push('/chat/CHAT_1')}
                      className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group"
                    >
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