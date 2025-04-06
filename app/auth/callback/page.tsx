'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');
    const authType = searchParams.get('auth_type');

    if (!token || !userId) {
      router.push('/');
      return;
    }

    // 인증 상태 저장
    setAuth({
      token,
      user: {
        id: userId,
        email: email || '',
      },
      isAuthenticated: true,
    });

    // auth_type에 따른 리다이렉트 처리
    switch (authType) {
      case 'register':
      case 'profile':
        router.push('/signup');
        break;
      case 'importance':
        router.push('/signup/importance');
        break;
      case 'satisfaction':
        router.push('/signup/satisfaction');
        break;
      case 'login':
        router.push('/my');
        break;
      default:
        router.push('/');
        break;
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">로그인 처리 중...</h1>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
} 