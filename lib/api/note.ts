import axios from 'axios';
import { ApiResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface PreChat {
  id: string
  content: string
  created_at: string
  updated_at: string
}

export interface ListPreChatsResponse {
  pre_chats: PreChat[]
}

export interface ChatListResponse {
  id: string
  title: string
  createdAt: string
}

export interface CreateChatRequest {
  pre_chat_id?: string
}

export interface CreateChatResponse {
  id: string
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface ChatMetadata {
  message_count: number
  last_message_at: string
}

export interface ChatData {
  messages: Message[]
  metadata: ChatMetadata
}

export interface GetChatResponse {
  id: string
  userId: string
  title: string
  chatData: ChatData
  createdAt: string
  updatedAt: string
}

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  content: string
  role: MessageRole
  created_at: string
  updated_at: string
}

export interface ChatMessageRequest {
  message: string
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('No access token found')
  }
  return { Authorization: `Bearer ${token}` }
}

export const noteApi = {
  getPreChats: async (): Promise<ApiResponse<ListPreChatsResponse>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/note/chat/pre-chats`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('프리챗 조회 실패:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  getChatList: async (): Promise<ApiResponse<ChatListResponse[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/note/chat`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('채팅 목록 조회 실패:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  createChat: async (data: CreateChatRequest): Promise<ApiResponse<CreateChatResponse>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/note/chat`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('채팅 생성 실패:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  getChat: async (id: string): Promise<ApiResponse<GetChatResponse>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/note/chat/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('채팅 조회 실패:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  sendChatMessage: async (chatId: string, message: string): Promise<EventSource> => {
    const authHeader = getAuthHeader()
    const token = authHeader.Authorization.split(' ')[1]
    const url = `${API_BASE_URL}/note/chat/${chatId}/stream?message=${encodeURIComponent(message)}&token=${encodeURIComponent(token)}`
    console.log('Request URL:', url)
    console.log('Current cookies:', document.cookie)

    try {
      // 쿠키로 토큰 전달 (공통 상위 도메인 사용)
      document.cookie = `access_token=${token}; path=/; domain=.chungjung.click; SameSite=Lax`
      console.log('After setting cookie:', document.cookie)

      const eventSource = new EventSource(url, {
        withCredentials: true
      })

      // EventSource 연결 상태 로깅
      eventSource.onopen = () => {
        console.log('EventSource connection opened')
        console.log('Current cookies on open:', document.cookie)
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        console.log('Current cookies on error:', document.cookie)
      }

      return eventSource
    } catch (error) {
      console.error('EventSource 생성 중 오류:', {
        message: error instanceof Error ? error.message : String(error),
        url,
        cookies: document.cookie
      })
      throw error
    }
  },
} 