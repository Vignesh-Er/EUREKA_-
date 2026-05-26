"use client"

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import { useTheme } from 'next-themes'

interface Props {
  data: number[]
  trendType: 'improving' | 'stable' | 'declining'
}

export function TrendingSparkline({ data, trendType }: Props) {
  const chartData = data.map((val, i) => ({ index: i, value: val }))
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  let color = isDark ? "#4f46e5" : "#3b82f6" // stable/primary
  if (trendType === 'improving') color = isDark ? "#10b981" : "#059669"
  if (trendType === 'declining') color = isDark ? "#ef4444" : "#dc2626"

  return (
    <div className="w-full h-full flex flex-col justify-end">
      <div className="text-[10px] text-muted-foreground font-medium mb-1 pl-1">Score Trend</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <YAxis domain={['auto', 'auto']} hide />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 3, fill: color, strokeWidth: 0 }} 
            activeDot={{ r: 5 }} 
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
