import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  organization: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileRequest {
  name: string;
  organization: string;
  nickname?: string;
}

export const profileApi = {
  // 프로필 생성
  createProfile: async (data: CreateProfileRequest): Promise<UserProfile> => {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Request data:', data);
    console.log('Access token:', token);

    if (!token) {
      throw new Error('No access token found');
    }

    try {
      const response = await axios.post<UserProfile>(
        `${API_BASE_URL}/user/profile`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response);
        console.error('Error config:', error.config);
      }
      throw error;
    }
  },

  // 프로필 조회
  getProfile: async (): Promise<UserProfile> => {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Access token:', token);

    if (!token) {
      throw new Error('No access token found');
    }

    try {
      const response = await axios.get<UserProfile>(
        `${API_BASE_URL}/user/profile`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response);
        console.error('Error config:', error.config);
      }
      throw error;
    }
  },
}; 