import { Card, CardContent } from "@/components/ui/card"

interface TotalScoreCardProps {
  score: number
  categories: Record<string, { color: string; score: number }>
}

export function TotalScoreCard({ score, categories }: TotalScoreCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg h-full">
      <CardContent className="p-8 flex flex-col items-center justify-center h-full">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0">
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl transform scale-150" />
            </div>
            <h2 className="text-8xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {score.toFixed(1)}
            </h2>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-xl font-medium">종합 평가 점수</p>
            <p className="text-sm text-gray-500 mt-2">전체 항목의 평균 점수입니다</p>
          </div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at center,
                transparent 0%,
                ${Object.values(categories).map((cat, i) => 
                  `${cat.color}05 ${(i + 1) * 15}%`
                ).join(', ')}
              )
            `
          }} />
        </div>
      </CardContent>
    </Card>
  )
} 