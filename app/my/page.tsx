'use client'

import { TotalScoreCard } from '@/components/charts/TotalScoreCard'
import { DetailScoreCard } from '@/components/charts/DetailScoreCard'
import { BalanceChartCard } from '@/components/charts/BalanceChartCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Plus, PenLine, Sparkles, ChevronRight, ArrowLeft, RefreshCw, MessageSquare, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jobSatisfactionApi, CurrentJobSatisfactionResponse } from '@/lib/api/job-satisfaction'
import { noteApi, PreChat, ChatListResponse } from '@/lib/api/note'
import { ApiResponse } from '@/lib/api/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '@/hooks/useProfile'
import type { EmblaCarouselType } from 'embla-carousel'
import { toast } from 'sonner'

export default function MyPage() {
  const router = useRouter()
  const { profile, isLoading: isProfileLoading } = useProfile()
  const [isTopicMode, setIsTopicMode] = useState(false)
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [api, setApi] = useState<EmblaCarouselType>()
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  const { data: preChatsResponse, isLoading: isPreChatsLoading, error: preChatsError } = useQuery<ApiResponse<{ pre_chats: PreChat[] }>>({
    queryKey: ['preChats'],
    queryFn: () => noteApi.getPreChats(),
    retry: 1,
  })

  const { data: jobSatisfactionResponse, isLoading: isJobSatisfactionLoading } = useQuery<ApiResponse<CurrentJobSatisfactionResponse>>({
    queryKey: ['jobSatisfaction'],
    queryFn: () => jobSatisfactionApi.getCurrentJobSatisfaction(),
  })

  const { data: chatListResponse, isLoading: isChatListLoading } = useQuery<ApiResponse<ChatListResponse[]>>({
    queryKey: ['chatList'],
    queryFn: () => noteApi.getChatList(),
  })

  const currentTopic = preChatsResponse?.data?.pre_chats[currentTopicIndex]

  const hasTodayChat = useCallback(() => {
    if (!chatListResponse?.data) return false
    const today = new Date().toISOString().split('T')[0]
    return chatListResponse.data.some(chat => {
      const chatDate = new Date(chat.createdAt).toISOString().split('T')[0]
      return chatDate === today
    })
  }, [chatListResponse?.data])

  const getTodayChat = useCallback(() => {
    if (!chatListResponse?.data) return null
    const today = new Date().toISOString().split('T')[0]
    return chatListResponse.data.find(chat => {
      const chatDate = new Date(chat.createdAt).toISOString().split('T')[0]
      return chatDate === today
    })
  }, [chatListResponse?.data])

  const handleRefreshTopic = useCallback(() => {
    if (!preChatsResponse?.data?.pre_chats) return
    setCurrentTopicIndex((prev) => (prev + 1) % preChatsResponse.data.pre_chats.length)
  }, [preChatsResponse?.data?.pre_chats])

  const handleCreateChat = useCallback(async (preChatId?: string) => {
    try {
      if (hasTodayChat()) {
        const todayChat = getTodayChat()
        if (todayChat) {
          router.push(`/chat/${todayChat.id}`)
        }
        return
      }

      setIsCreatingChat(true)
      const response = await noteApi.createChat({ pre_chat_id: preChatId })
      if (response.data) {
        router.push(`/chat/${response.data.id}`)
      }
    } catch (error) {
      console.error('채팅 생성 실패:', error)
    } finally {
      setIsCreatingChat(false)
    }
  }, [router, hasTodayChat, getTodayChat])

  const handleCardClick = useCallback(() => {
    if (currentTopic) {
      handleCreateChat(currentTopic.id)
    }
  }, [currentTopic, handleCreateChat])

  const handleDeleteChat = async (chatId: string, createdAt: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const chatDate = new Date(createdAt).toISOString().split('T')[0]
      
      if (chatDate !== today) {
        toast.error('당일에 생성된 채팅만 삭제할 수 있습니다.')
        return
      }

      // 삭제 확인 메시지 표시
      const isConfirmed = window.confirm('정말로 이 채팅을 삭제하시겠습니까?')
      if (!isConfirmed) return

      await noteApi.deleteChat(chatId)
      toast.success('채팅이 삭제되었습니다.')
      // 채팅 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    } catch (error) {
      console.error('채팅 삭제 실패:', error)
      toast.error('채팅 삭제에 실패했습니다.')
    }
  }

  if (isProfileLoading || isJobSatisfactionLoading || isPreChatsLoading || isChatListLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (preChatsError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">인증이 필요합니다. 다시 로그인해주세요.</p>
      </div>
    )
  }

  if (!profile || !jobSatisfactionResponse?.data || !preChatsResponse?.data?.pre_chats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
      </div>
    )
  }

  const jobSatisfaction = jobSatisfactionResponse.data

  const CATEGORIES = {
    업무: { 
      color: '#3B82F6', 
      score: jobSatisfaction.workload,
      importance: jobSatisfaction.workloadImportance
    },
    보상: { 
      color: '#10B981', 
      score: jobSatisfaction.compensation,
      importance: jobSatisfaction.compensationImportance
    },
    성장: { 
      color: '#F59E0B', 
      score: jobSatisfaction.growth,
      importance: jobSatisfaction.growthImportance
    },
    환경: { 
      color: '#EF4444', 
      score: jobSatisfaction.workEnvironment,
      importance: jobSatisfaction.workEnvironmentImportance
    },
    관계: { 
      color: '#8B5CF6', 
      score: jobSatisfaction.workRelationships,
      importance: jobSatisfaction.workRelationshipsImportance
    },
    가치: { 
      color: '#EC4899', 
      score: jobSatisfaction.workValues,
      importance: jobSatisfaction.workValuesImportance
    },
  }

  const AVERAGE_SCORE = jobSatisfaction.score

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
              {profile.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{profile.name}님의 현재 커리어 만족도</h1>
              <p className="text-sm text-gray-500 mt-1">{profile.organization}</p>
            </div>
          </div>
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
          setApi={setApi}
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
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => {
                if (api) {
                  api.scrollTo(index)
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-blue-500 w-4' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 채팅 리스트 */}
      {chatListResponse?.data && chatListResponse.data.length > 0 && (
        <div className="max-w-md mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 채팅 기록</h2>
          <div className="space-y-3">
            {chatListResponse.data.map((chat) => (
              <div
                key={chat.id}
                className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer group"
                onClick={() => router.push(`/chat/${chat.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{chat.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(chat.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.id, chat.createdAt)
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      <p className="text-sm text-gray-400">카드를 새로고침 해서 새로운 주제를 확인해보세요</p>
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
                        {currentTopic && (
                          <div 
                            className="relative bg-gradient-to-br from-white via-blue-50 to-gray-50 p-4 rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors min-h-[120px] flex flex-col transition-all duration-500 overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
                            onClick={handleCardClick}
                          >
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full shadow-lg" />
                            <div className="pl-4 flex flex-col flex-1 relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRefreshTopic()
                                }}
                                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <RefreshCw className="w-5 h-5" />
                              </button>
                              <p className="text-sm font-medium text-gray-900 mt-16">{currentTopic.content}</p>
                            </div>
                          </div>
                        )}
                      </CarouselItem>
                    </CarouselContent>
                  </Carousel>
                </>
              ) : (
                <>
                  <SheetTitle className="text-lg font-bold text-center mb-6">
                    {hasTodayChat() ? '오늘의 기록' : '기록 시작하기'}
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    {hasTodayChat() ? '오늘의 기록을 이어서 작성하거나 새로운 기록을 시작할 수 있습니다.' : '자유롭게 작성하거나 추천 주제로 기록할 수 있습니다.'}
                  </SheetDescription>
                  <div className="space-y-3">
                    {hasTodayChat() ? (
                      <button 
                        onClick={() => {
                          const todayChat = getTodayChat()
                          if (todayChat) {
                            router.push(`/chat/${todayChat.id}`)
                          }
                        }}
                        className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">오늘의 기록 이어하기</div>
                          <div className="text-sm text-gray-500">오늘 작성한 기록을 이어서 작성해보세요</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleCreateChat()}
                          disabled={isCreatingChat}
                          className="w-full p-4 text-left bg-white rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                      </>
                    )}
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