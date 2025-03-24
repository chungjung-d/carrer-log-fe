'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Chat, Message } from '@/types/chat'
import { Send, User, Bot, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// 임시 데이터 (나중에 API로 대체)
const MOCK_CHAT: Chat = {
  id: 'CHAT_1',
  userId: 'user1',
  title: '자유로운 기록',
  chatData: {
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: '안녕하세요! 오늘 하루는 어떠셨나요? 자유롭게 이야기를 나눠보세요.',
        timestamp: new Date(),
      },
    ],
    metadata: {
      message_count: 1,
      last_message_at: new Date(),
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string
  const [chat, setChat] = useState<Chat>(MOCK_CHAT)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [composing, setComposing] = useState(false)

  useEffect(() => {
    // TODO: API 연동 후 실제 데이터 가져오기
    // const fetchChat = async () => {
    //   const response = await fetch(`/api/chats/${chatId}`)
    //   const data = await response.json()
    //   setChat(data)
    // }
    // fetchChat()
    
    // 임시로 MOCK_CHAT 사용
    setChat(MOCK_CHAT)
  }, [chatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat.chatData.messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || composing) return

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    }

    setChat(prev => ({
      ...prev,
      chatData: {
        messages: [...prev.chatData.messages, newMsg],
        metadata: {
          message_count: prev.chatData.metadata.message_count + 1,
          last_message_at: new Date(),
        },
      },
    }))

    setNewMessage('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* 헤더 */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <Link 
          href="/my" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="font-semibold text-gray-900">{chat.title}</h1>
          <p className="text-xs text-gray-500">마지막 메시지: {formatTime(chat.chatData.metadata.last_message_at)}</p>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {chat.chatData.messages.map((message, index) => {
          const isLastInSequence = index === chat.chatData.messages.length - 1 || 
            chat.chatData.messages[index + 1].role !== message.role

          return (
            <div
              key={message.id}
              className={`flex items-end gap-1 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {isLastInSequence && (
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} shrink-0`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gray-200'
                        : 'bg-gray-200'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </div>
              )}
              <div
                className={`group relative max-w-[75%] ${
                  !isLastInSequence ? (message.role === 'user' ? 'mr-10' : 'ml-10') : ''
                }`}
              >
                <div
                  className={`px-3 py-2 break-words ${
                    message.role === 'user'
                      ? 'bg-[#4C83FF] text-white rounded-t-[22px] rounded-l-[22px] rounded-br-[4px]'
                      : 'bg-white border border-gray-200 rounded-t-[22px] rounded-r-[22px] rounded-bl-[4px]'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                {isLastInSequence && (
                  <p className={`text-[11px] mt-1 ${
                    message.role === 'user' ? 'text-right' : ''
                  } text-gray-500`}>
                    {formatTime(message.timestamp)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="p-2">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => setComposing(false)}
                placeholder="메시지를 입력하세요..."
                className="w-full resize-none rounded-[22px] border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 pr-12 min-h-[44px] max-h-32 text-[15px] transition-colors"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !composing) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-8 h-8 text-[#4C83FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newMessage.trim() || composing}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 