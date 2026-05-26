"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CoverageHeatmap({ data }: { data: Record<string, number> }) {
  const getColor = (val: number) => {
    if (val === 100) return 'bg-emerald-500 dark:bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
    if (val >= 70) return 'bg-amber-400 dark:bg-amber-500 shadow-[0_4px_12px_rgba(251,191,36,0.3)]'
    if (val > 0) return 'bg-orange-400 dark:bg-orange-500 shadow-[0_4px_12px_rgba(251,146,60,0.3)]'
    return 'bg-sidebar-border/50 dark:bg-sidebar-accent'
  }

  return (
    <div className="space-y-4 pt-2">
      {Object.entries(data).map(([unit, percentage]) => (
        <div key={unit} className="flex items-center gap-4 group cursor-pointer">
          <div className="w-16 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {unit}
          </div>
          
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1 h-8 rounded-md bg-sidebar-border/20 overflow-hidden relative">
                  <div 
                    className={`absolute top-0 left-0 h-full ${getColor(percentage)} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {percentage > 0 ? `${percentage}%` : ''}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p><strong>{unit}</strong></p>
                <p className="text-sm text-muted-foreground">{percentage}% completed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}

      <div className="flex items-center justify-center gap-4 pt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" /> Completed
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-400" /> In Progress
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border border-sidebar-border/50" /> Pending
        </div>
      </div>
    </div>
  )
}
