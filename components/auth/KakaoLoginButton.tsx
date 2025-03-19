import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

type KakaoLoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function KakaoLoginButton({ className, ...props }: KakaoLoginButtonProps) {
  return (
    <button
      className={cn(
        "w-full relative flex items-center justify-center gap-2 px-4 py-3 text-black bg-[#FEE500] hover:bg-[#FEE500]/90 rounded-lg font-medium transition-colors",
        className
      )}
      {...props}
    >
      <KakaoIcon className="w-6 h-6" />
      카카오로 로그인
    </button>
  )
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12 2.5C6.47715 2.5 2 6.08789 2 10.5C2 13.3194 3.90591 15.7871 6.77575 17.1729L5.65322 21.3802C5.59853 21.5891 5.77563 21.7769 5.97816 21.6988L10.9182 19.1409C11.2744 19.1799 11.6347 19.2 12 19.2C17.5228 19.2 22 15.6121 22 11.2C22 6.78789 17.5228 2.5 12 2.5Z" 
        fill="currentColor"
      />
    </svg>
  )
} 