import axios from 'axios';
import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export interface Profile {
  id: string;
  name: string;
  nickname: string;
  organization: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileRequest {
  name: string;
  nickname?: string | null;
  organization: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<Profile>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('프로필 조회 실패:', error.response?.data || error.message);
      }
      throw error;
    }
  },

  createProfile: async (data: CreateProfileRequest): Promise<ApiResponse<Profile>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/profile`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('프로필 생성 실패:', error.response?.data || error.message);
      }
      throw error;
    }
  },
}; 