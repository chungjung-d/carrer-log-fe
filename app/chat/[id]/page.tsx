'use client'

import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h1 className="text-xl font-bold mb-4">Chat {chatId}</h1>
          <div className="space-y-4">
            {/* 여기에 채팅 UI가 들어갈 예정입니다 */}
            <div className="text-gray-500 text-center">채팅 UI 준비 중...</div>
          </div>
        </div>
      </div>
    </div>
  )
} 