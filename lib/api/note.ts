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
} 