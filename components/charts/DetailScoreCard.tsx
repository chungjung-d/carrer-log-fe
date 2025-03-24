import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DetailScoreCardProps {
  categories: Record<string, { color: string; score: number }>
}

export function DetailScoreCard({ categories }: DetailScoreCardProps) {
  return (
    <Card className="bg-white border-0 shadow-lg h-full">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="relative mb-6">
          <div className="absolute -left-8 top-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
          <h3 className="text-xl font-semibold text-gray-900">상세 항목 점수</h3>
          <p className="text-sm text-gray-500 mt-1">각 항목별 만족도를 확인해보세요</p>
        </div>
        <div className="space-y-6 flex-1 overflow-y-auto">
          {Object.entries(categories).map(([key, { color, score }]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-medium text-gray-800 text-base">{key}</span>
                </div>
                <span className="text-base font-semibold" style={{ color }}>{score}점</span>
              </div>
              <div className="relative">
                <Progress 
                  value={score} 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ 
                    background: `linear-gradient(to right, ${color}15, ${color}05)`,
                    '--progress-foreground': color
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 