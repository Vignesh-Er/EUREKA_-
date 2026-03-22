"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CalendarCheck, ArrowRight, ArrowDown, ArrowUp, Zap, Clock, ThumbsUp, ThumbsDown } from 'lucide-react'

// Simulated AI Dynamic Timetable Data
const timetableAdjustments = [
  {
    id: 1,
    course: 'Digital Logic Design',
    professor: 'Dr. Alan Oppenheim',
    completionPct: 88,
    feedbackScore: 4.8,
    originalPeriods: 4,
    newPeriods: 2,
    adjustment: -2,
    reason: 'Syllabus ahead of schedule with excellent student understanding.',
    color: 'var(--eureka-success)',
    priority: 'Low'
  },
  {
    id: 2,
    course: 'Electromagnetic Theory',
    professor: 'Dr. Michael Chang',
    completionPct: 35,
    feedbackScore: 2.1,
    originalPeriods: 3,
    newPeriods: 6,
    adjustment: 3,
    reason: 'Critical lag in completion. High failure risk detected. Priority periods allocated.',
    color: 'var(--destructive)',
    priority: 'Critical'
  },
  {
    id: 3,
    course: 'Signals & Systems',
    professor: 'Dr. Sarah Jenkins',
    completionPct: 62,
    feedbackScore: 3.9,
    originalPeriods: 3,
    newPeriods: 4,
    adjustment: 1,
    reason: 'Approaching complex Fourier Analysis unit. Predictive engine requested 1 extra period/week.',
    color: 'var(--chart-1)',
    priority: 'Medium'
  }
]

export default function DynamicTimetablePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              AI Dynamic Timetable Engine
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Schedules are no longer static. The AI constantly monitors syllabus completion rates and student comprehension feedback. 
            It automatically deducts periods from subjects that are ahead and redirects them to subjects where students are struggling.
          </p>
        </div>
        <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-primary/10 border-primary text-primary shrink-0">
          <Zap className="w-3.5 h-3.5 mr-2" /> Live Schedule Optimization
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {timetableAdjustments.map((adj) => (
          <Card key={adj.id} className="bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group">
            
            {/* Status Background Indicator */}
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: adj.color }}
            />

            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Course Info */}
                <div className="w-full lg:w-1/3">
                  <Badge variant="outline" className="mb-2 uppercase tracking-wider text-[10px] text-muted-foreground border-border/50">
                    {adj.priority} Priority
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">{adj.course}</h3>
                  <p className="text-sm text-muted-foreground">{adj.professor}</p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-8 w-full lg:w-1/3 p-4 bg-background/50 rounded-xl border border-border/50">
                  <div className="w-1/2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-bold">{adj.completionPct}%</span>
                    </div>
                    <Progress value={adj.completionPct} className="h-1.5" indicatorColor={adj.completionPct > 80 ? 'var(--eureka-success)' : adj.completionPct < 50 ? 'var(--destructive)' : 'var(--primary)'} />
                  </div>
                  
                  <div className="w-1 px-px h-8 bg-border/50" />
                  
                  <div className="w-1/2 flex items-center gap-3">
                    {adj.feedbackScore >= 4.0 ? (
                       <ThumbsUp className="w-5 h-5 text-eureka-success" />
                    ) : (
                       <ThumbsDown className="w-5 h-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Feedback</p>
                      <p className={`font-bold ${adj.feedbackScore >= 4.0 ? 'text-eureka-success' : 'text-destructive'}`}>{adj.feedbackScore} / 5.0</p>
                    </div>
                  </div>
                </div>

                {/* Period Adjustment */}
                <div className="w-full lg:w-1/3 flex items-center justify-between xl:justify-end gap-6">
                  
                  <div className="hidden xl:block max-w-[200px]">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">AI Logic: </span>
                      {adj.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-secondary/30 p-3 rounded-xl border border-border/30">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Old</p>
                      <p className="text-lg font-mono text-muted-foreground opacity-50 line-through">{adj.originalPeriods} <span className="text-xs">hrs</span></p>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    
                    <div className="text-center">
                      <p className="text-[10px] text-primary uppercase tracking-wider font-bold mb-1">Allocated</p>
                      <div className="flex items-center justify-center gap-1">
                        <p className={`text-2xl font-black ${adj.adjustment > 0 ? 'text-destructive' : 'text-eureka-success'}`}>{adj.newPeriods}</p>
                        <p className="text-xs text-muted-foreground font-medium">hrs/wk</p>
                      </div>
                    </div>
                    
                    {adj.adjustment !== 0 && (
                      <div className={`flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-bold ${adj.adjustment > 0 ? 'bg-destructive/20 text-destructive' : 'bg-eureka-success/20 text-eureka-success'}`}>
                        {adj.adjustment > 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                        {Math.abs(adj.adjustment)}
                      </div>
                    )}
                  </div>

                </div>

              </div>
              
              {/* Mobile AI Logic (Hidden on large screens) */}
              <div className="xl:hidden mt-4 pt-4 border-t border-border/10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">AI Logic: </span>
                  {adj.reason}
                </p>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
         <div className="bg-primary/5 border border-primary/20 px-6 py-4 rounded-xl max-w-2xl text-center">
            <h4 className="text-sm font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> Schedule Synchronization Complete
            </h4>
            <p className="text-xs text-foreground/80 leading-relaxed">
              The AI has successfully balanced the university timetable. Students will now receive 3 extra hours of Electromagnetic Theory per week until the cohort's mastery score reaches the baseline required to clear the syllabus bottleneck.
            </p>
         </div>
      </div>

    </div>
  )
}
