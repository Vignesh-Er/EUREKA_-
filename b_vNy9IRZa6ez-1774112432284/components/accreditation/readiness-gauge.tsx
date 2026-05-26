"use client"

import { useEffect, useState } from 'react'

export function ReadinessGauge({ score }: { score: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setValue(score), 300)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 80
  const strokeDashoffset = circumference - (value / 100) * circumference

  let color = "text-red-500"
  if (value >= 80) color = "text-emerald-500"
  else if (value >= 60) color = "text-amber-500"

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="80"
          className="text-secondary stroke-current"
          strokeWidth="16"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="128"
          cy="128"
          r="80"
          className={`${color} stroke-current transition-all duration-1500 ease-out`}
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {/* Score text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-5xl font-bold tracking-tighter ${color} drop-shadow-sm`}>
          {value}%
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Ready</span>
      </div>
    </div>
  )
}
