"use client"

import { useTheme } from "next-themes"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

const chartData = [
  { week: "W1", expected: 5, actual: 5 },
  { week: "W2", expected: 10, actual: 12 },
  { week: "W3", expected: 20, actual: 18 },
  { week: "W4", expected: 30, actual: 30 },
  { week: "W5", expected: 40, actual: 35 },
  { week: "W6", expected: 50, actual: 45 },
  { week: "W7", expected: 60, actual: 50 },
  { week: "W8", expected: 70, actual: 55 },
  { week: "W9", expected: 80, actual: 68 },
  { week: "W10", expected: 90, actual: null },
  { week: "W11", expected: 100, actual: null },
]

export function TimelineChart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const expectedColor = isDark ? "#4f46e5" : "#3b82f6"
  const actualColor = isDark ? "#10b981" : "#059669"

  return (
    <div className="h-[350px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={expectedColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={expectedColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={actualColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={actualColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#333" : "#eee"} />
          <XAxis 
            dataKey="week" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? "#888" : "#666", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? "#888" : "#666", fontSize: 12 }}
            dx={-10}
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="expected"
            name="Expected Coverage"
            stroke={expectedColor}
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorExpected)"
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual Coverage"
            stroke={actualColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorActual)"
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
