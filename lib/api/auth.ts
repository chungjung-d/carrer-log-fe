import axios from 'axios';
// import Cookies from 'js-cookie';
import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface KakaoLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  is_new_user: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  // 카카오 로그인 시작
  startKakaoLogin: () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  },

  // 카카오 로그인 콜백 처리
  handleKakaoCallback: async (code: string): Promise<KakaoLoginResponse> => {
    const response = await axios.get<KakaoLoginResponse>(
      `${API_BASE_URL}/auth/kakao/callback?code=${code}`
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}/auth/login`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          response: error.response,
          config: error.config
        });
        throw error;
      }
      throw error;
    }
  },
}; 