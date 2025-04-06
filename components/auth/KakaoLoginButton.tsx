'use client'

import { useAuthStore } from '@/store/auth';

export const KakaoLoginButton = () => {
  const login = useAuthStore((state) => state.login);

  return (
    <button
      onClick={login}
      className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4C6.48 4 2 7.48 2 12C2 14.9 3.75 17.4 6.5 18.7C6.2 17.7 6 16.6 6 15.5C6 12.4 8.4 9.9 11.5 9.9C14.6 9.9 17 12.4 17 15.5C17 16.6 16.8 17.7 16.5 18.7C19.25 17.4 21 14.9 21 12C21 7.48 16.52 4 12 4Z"
          fill="currentColor"
        />
      </svg>
      <span>카카오로 로그인</span>
    </button>
  );
}; 