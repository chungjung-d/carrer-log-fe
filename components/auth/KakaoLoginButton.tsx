'use client'

import { useAuthStore } from '@/store/auth';

export const KakaoLoginButton = () => {
  const login = useAuthStore((state) => state.login);

  return (
    <button
      onClick={login}
      className="group flex items-center justify-center w-full px-6 py-3 space-x-3 text-[#3A1D1D] bg-[#FEE500] rounded-xl hover:bg-[#FEE500]/90 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <svg 
        width="22" 
        height="21" 
        viewBox="0 0 22 21" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M11 0C5.0748 0 0 4.0534 0 9.0566C0 12.0952 1.9782 14.7433 5.0106 16.2384L3.7582 20.5672C3.68814 20.8072 3.98508 21.0077 4.19092 20.8728L9.2942 17.5163C9.8518 17.5723 10.4214 17.6021 11 17.6021C16.9252 17.6021 22 13.5487 22 8.54552C22 3.54231 16.9252 0 11 0Z" 
          fill="currentColor"
        />
      </svg>
      <span className="font-medium text-[15px]">카카오톡으로 시작하기</span>
    </button>
  );
}; 