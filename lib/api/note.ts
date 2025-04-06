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

export interface GetChatResponse {
  id: string
  userId: string
  title: string
  chatData: {
    messages: Array<{
      role: string
      content: string
    }>
  }
  createdAt: string
  updatedAt: string
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
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
} 