"use client"

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart3, AlertTriangle, Lightbulb, Users, TrendingUp, Target, Brain, LineChart } from 'lucide-react'

// Simulated University Intelligence Layer Data
const adminAnalytics = {
  strugglingMetrics: [
    { subject: 'Laplace Transform', course: 'Engineering Mathematics', weakStudents: 42, severity: 'High' },
    { subject: 'Verilog FSMs', course: 'Digital Design', weakStudents: 28, severity: 'Medium' },
    { subject: 'Nyquist Theorem', course: 'Signals & Systems', weakStudents: 15, severity: 'Low' }
  ],
  labUsage: [
    { name: 'AI Software Lab', usage: 92 },
    { name: 'VLSI Prototyping Lab', usage: 78 },
    { name: 'Communications Lab', usage: 35 }, // Underutilized
    { name: 'Power Electronics', usage: 45 }
  ]
}

const studentAnalytics = {
  personalWeaknesses: [
    { subject: 'Verilog FSMs', course: 'Digital Design', mastery: 45, recommendedAction: 'Review state transition diagrams.' },
    { subject: 'Dynamic Programming', course: 'Data Structures', mastery: 55, recommendedAction: 'Practice memoization problems.' }
  ],
  learningVelocity: 85, // 85% compared to cohort avg
  studyTimeBreakdown: [
    { type: 'Conceptual Learning', hours: 12 },
    { type: 'Hands-on Labs', hours: 8 },
    { type: 'Assessments', hours: 4 }
  ],
  peerComparison: {
    percentile: 78,
    engagementScore: 92
  }
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const isStudent = user?.role === 'student'

  if (isStudent) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LineChart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              My Learning Analytics
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Deep dive into your cognitive twin data to uncover hidden weaknesses and track your learning velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Weaknesses */}
          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-destructive" /> Knowledge Gaps
              </CardTitle>
              <CardDescription>Topics where you are currently underperforming.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {studentAnalytics.personalWeaknesses.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground">{metric.subject}</h4>
                      <p className="text-xs text-muted-foreground">{metric.course}</p>
                    </div>
                    <span className="text-sm font-bold text-destructive">{metric.mastery}% Mastery</span>
                  </div>
                  <Progress value={metric.mastery} className="h-2 [&>div]:bg-destructive bg-destructive/20" />
                  <p className="text-xs text-muted-foreground pt-1">
                    <span className="font-semibold text-primary">Next Step:</span> {metric.recommendedAction}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Learning Velocity */}
            <Card className="bg-card/40 border-border/50 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-accent" /> Learning Velocity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl font-bold text-foreground">{studentAnalytics.learningVelocity}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are learning 85% faster than the historical baseline for these topics. Keep up the momentum!
                </p>
              </CardContent>
            </Card>

            {/* Peer Comparison Segment */}
            <Card className="bg-card/40 border-border/50 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-4 h-4 text-chart-2" /> Cohort Standing (Anonymized)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance Percentile</span>
                    <span>Top {100 - studentAnalytics.peerComparison.percentile}%</span>
                  </div>
                  <Progress value={studentAnalytics.peerComparison.percentile} className="h-2 bg-chart-2/20 [&>div]:bg-chart-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Engagement Score</span>
                    <span>{studentAnalytics.peerComparison.engagementScore}/100</span>
                  </div>
                  <Progress value={studentAnalytics.peerComparison.engagementScore} className="h-2 bg-chart-1/20 [&>div]:bg-chart-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Admin / Professor View
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
            University Intelligence Layer
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Aggregated insights from the Student Digital Twins. Identify syllabus gaps,
          predict mass failure rates before exams, and reallocate underutilized campus resources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Course Risk Analytics */}
        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> High-Risk Knowledge Concepts
            </CardTitle>
            <CardDescription>Based on real-time micro-test evaluations across the cohort.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {adminAnalytics.strugglingMetrics.map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground">{metric.subject}</h4>
                    <p className="text-xs text-muted-foreground">{metric.course}</p>
                  </div>
                  <Badge variant={metric.severity === 'High' ? 'destructive' : 'secondary'} className={metric.severity === 'High' ? 'bg-destructive/10 text-destructive border border-destructive/20' : ''}>
                    {metric.weakStudents} Students Struggling
                  </Badge>
                </div>
                <Progress
                  value={(metric.weakStudents / 60) * 100}
                  className={`h-2 ${metric.severity === 'High' ? '[&>div]:bg-destructive bg-destructive/20' : 'bg-primary/20'}`}
                />
              </div>
            ))}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-6 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />    
              <div>
                <h5 className="text-sm font-medium text-primary mb-1">AI Recommendation</h5>
                <p className="text-xs text-foreground/80 leading-relaxed">      
                  Schedule a remedial session for Laplace Transforms before the midterm. The AI has prepared a visual-first presentation format based on the cohort&apos;s cognitive twin profiles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Allocation Analytics */}
        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50 backdrop-blur-md">       
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-chart-1" /> Lab Utilization Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {adminAnalytics.labUsage.map((lab, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground">{lab.name}</span>
                    <span className={`font-mono ${lab.usage < 40 ? 'text-destructive' : 'text-chart-1'}`}>{lab.usage}% Cap</span>
                  </div>
                  <Progress 
                    value={lab.usage} 
                    className={`h-1.5 ${lab.usage < 40 ? '[&>div]:bg-destructive bg-destructive/20' : '[&>div]:bg-chart-1 bg-chart-1/20'}`} 
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/10">
                <span className="font-semibold text-destructive">Insight:</span> The Communications Lab is severely underutilized. Consider integrating SDR (Software Defined Radio) projects into the Phase 1 Discovery Week.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-accent" /> Industry Skill Alignment Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="flex items-end gap-3 mb-2">
                 <span className="text-5xl font-bold text-foreground">72</span>
                 <span className="text-muted-foreground pb-1">/ 100</span>
               </div>
               <p className="text-sm text-muted-foreground">
                 Your institution&apos;s curriculum matches 72% of current required skills posted in top-tier semiconductor and AI job descriptions.
               </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
