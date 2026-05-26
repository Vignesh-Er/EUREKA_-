"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TeachingIntelligenceScore, StaffPerformanceOverview } from '@/lib/types'
import { TrendingSparkline } from '@/components/staff/trend-sparkline'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  professor: { id: string; name: string; department: string }
  score: TeachingIntelligenceScore
  trend: StaffPerformanceOverview
}

export function TeachingScoreCard({ professor, score, trend }: Props) {
  const getScoreColor = (val: number) => {
    if (val >= 9.0) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
    if (val >= 8.0) return 'text-primary border-primary/20 bg-primary/10'
    if (val >= 7.0) return 'text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10'
    return 'text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/10'
  }

  return (
    <Card className="shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/5 text-primary">
                {professor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base text-foreground">{professor.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{professor.department}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md border text-lg font-bold ${getScoreColor(score.compositeScore)}`}>
            {score.compositeScore.toFixed(1)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-4">
        {/* Trend line */}
        <div className="h-12 w-full">
          <TrendingSparkline data={trend.historicalScores} trendType={trend.trend} />
        </div>

        {/* Component breakdown */}
        <div className="grid grid-cols-2 gap-3 pt-2">
           <div className="space-y-1">
             <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Coverage</div>
             <div className="flex items-center gap-2">
               <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                 <div className="bg-primary h-full" style={{ width: `${(score.components.syllabusCoverage / 10) * 100}%` }} />
               </div>
               <span className="text-xs font-medium w-6">{score.components.syllabusCoverage}</span>
             </div>
           </div>
           
           <div className="space-y-1">
             <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Comprehension</div>
             <div className="flex items-center gap-2">
               <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                 <div className="bg-accent h-full" style={{ width: `${(score.components.studentComprehension / 10) * 100}%` }} />
               </div>
               <span className="text-xs font-medium w-6">{score.components.studentComprehension}</span>
             </div>
           </div>

           <div className="space-y-1">
             <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Feedback</div>
             <div className="flex items-center gap-2">
               <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                 <div className="bg-teal-500 h-full" style={{ width: `${(score.components.feedbackSentiment / 10) * 100}%` }} />
               </div>
               <span className="text-xs font-medium w-6">{score.components.feedbackSentiment}</span>
             </div>
           </div>

           <div className="space-y-1">
             <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Activity</div>
             <div className="flex items-center gap-2">
               <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                 <div className="bg-amber-500 h-full" style={{ width: `${(score.components.activity / 10) * 100}%` }} />
               </div>
               <span className="text-xs font-medium w-6">{score.components.activity}</span>
             </div>
           </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-sidebar-border mt-2 bg-sidebar rounded-b-xl px-4 py-3">
        <Button variant="ghost" className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground hover:bg-sidebar-accent gap-2 h-8 text-xs px-2">
          <span>AI Talking Points</span>
          <MessageSquarePlus className="w-4 h-4 text-primary" />
        </Button>
      </CardFooter>
    </Card>
  )
}
