import { Card, CardContent } from "@/components/ui/card"

interface BalanceChartCardProps {
  categories: Record<string, { color: string; score: number }>
}

export function BalanceChartCard({ categories }: BalanceChartCardProps) {
  return (
    <Card className="bg-white border-0 shadow-lg h-full">
      <CardContent className="p-8 h-full flex flex-col">
        <div className="relative mb-6">
          <div className="absolute -left-8 top-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
          <h3 className="text-xl font-semibold text-gray-900">밸런스 차트</h3>
          <p className="text-sm text-gray-500 mt-1">전체적인 만족도의 균형을 한눈에 확인해보세요</p>
        </div>
        <div className="flex-1 relative flex items-center justify-center">
          <svg viewBox="-10 -10 120 120" className="w-full h-full max-h-[350px]">
            {/* 배경 육각형들 - 여러 레벨 */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
              <polygon 
                key={i}
                points={`
                  ${50 + (40 * level) * Math.cos(Math.PI / 2)},${50 - (40 * level) * Math.sin(Math.PI / 2)}
                  ${50 + (40 * level) * Math.cos(Math.PI / 6)},${50 - (40 * level) * Math.sin(Math.PI / 6)}
                  ${50 + (40 * level) * Math.cos(-Math.PI / 6)},${50 - (40 * level) * Math.sin(-Math.PI / 6)}
                  ${50 + (40 * level) * Math.cos(-Math.PI / 2)},${50 - (40 * level) * Math.sin(-Math.PI / 2)}
                  ${50 + (40 * level) * Math.cos(-5 * Math.PI / 6)},${50 - (40 * level) * Math.sin(-5 * Math.PI / 6)}
                  ${50 + (40 * level) * Math.cos(-7 * Math.PI / 6)},${50 - (40 * level) * Math.sin(-7 * Math.PI / 6)}
                `}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            ))}
            
            {/* 데이터 육각형 */}
            <polygon 
              points={`
                ${50 + 40 * (categories.업무.score / 100) * Math.cos(Math.PI / 2)},${50 - 40 * (categories.업무.score / 100) * Math.sin(Math.PI / 2)}
                ${50 + 40 * (categories.보상.score / 100) * Math.cos(Math.PI / 6)},${50 - 40 * (categories.보상.score / 100) * Math.sin(Math.PI / 6)}
                ${50 + 40 * (categories.성장.score / 100) * Math.cos(-Math.PI / 6)},${50 - 40 * (categories.성장.score / 100) * Math.sin(-Math.PI / 6)}
                ${50 + 40 * (categories.환경.score / 100) * Math.cos(-Math.PI / 2)},${50 - 40 * (categories.환경.score / 100) * Math.sin(-Math.PI / 2)}
                ${50 + 40 * (categories.관계.score / 100) * Math.cos(-5 * Math.PI / 6)},${50 - 40 * (categories.관계.score / 100) * Math.sin(-5 * Math.PI / 6)}
                ${50 + 40 * (categories.가치.score / 100) * Math.cos(-7 * Math.PI / 6)},${50 - 40 * (categories.가치.score / 100) * Math.sin(-7 * Math.PI / 6)}
              `}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3B82F6"
              strokeWidth="1"
            />

            {/* 카테고리 라벨 */}
            <text x="50" y="5" textAnchor="middle" className="text-[7px] font-medium fill-gray-600">업무</text>
            <text x="95" y="30" textAnchor="start" className="text-[7px] font-medium fill-gray-600">보상</text>
            <text x="95" y="70" textAnchor="start" className="text-[7px] font-medium fill-gray-600">성장</text>
            <text x="50" y="95" textAnchor="middle" className="text-[7px] font-medium fill-gray-600">환경</text>
            <text x="5" y="70" textAnchor="end" className="text-[7px] font-medium fill-gray-600">관계</text>
            <text x="5" y="30" textAnchor="end" className="text-[7px] font-medium fill-gray-600">가치</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
} 