import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface KakaoLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  is_new_user: boolean;
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
}; 