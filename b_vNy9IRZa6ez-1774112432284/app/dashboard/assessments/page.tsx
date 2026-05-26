"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ClipboardCheck, PlayCircle, AlertTriangle, ArrowRight, Activity, BrainCircuit } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { QuizModal } from '@/components/quiz-modal'

// Continuous Understanding Evaluation
const assessments = [
  {
    title: 'Micro-Test: LTI Systems',
    course: 'Signals & Systems',
    status: 'pending',
    module: 'Module 2',
    questions: 5,
    estimatedTime: '10 mins',
    insights: 'Focus on convolution integrals.',
    color: 'var(--accent-cyan)'
  },
  {
    title: 'Application Quiz: PID Tuning',
    course: 'Control Systems',
    status: 'failed',
    score: 45,
    module: 'Module 4',
    weakConcept: 'Integral Windup',
    color: 'var(--destructive)'
  },
  {
    title: 'Conceptual Check: MOSFET Biasing',
    course: 'VLSI Design',
    status: 'completed',
    score: 92,
    module: 'Module 1',
    color: 'var(--eureka-success)'
  }
]

export default function AssessmentsPage() {
  const [selectedTest, setSelectedTest] = useState<{title: string, duration: number} | null>(null)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Continuous Evaluation
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Exams shouldn&apos;t be surprises. We continuously evaluate your understanding through short, 
            application-based micro-tests to catch learning gaps immediately.
          </p>
        </div>

        {/* Global Understanding Score */}
        <Card className="bg-card/40 border-primary/20 shrink-0 w-full md:w-72 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <BrainCircuit className="w-4 h-4" />
              Global Understanding Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="font-bold text-4xl text-foreground">84</span>
              <span className="text-muted-foreground text-sm mb-1">/ 100</span>
            </div>
            <Progress value={84} className="h-2 bg-primary/10" />
            <p className="text-xs text-muted-foreground">Top 15% in your cohort</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((test, i) => (
          <Card key={i} className={`bg-card/40 backdrop-blur-md border-t-4 transition-all hover:-translate-y-1 duration-300`} style={{ borderTopColor: test.color }}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs opacity-70">
                  {test.course} • {test.module}
                </Badge>
                {test.status === 'completed' && <Badge variant="secondary" className="bg-eureka-success/10 text-eureka-success">Score: {test.score}%</Badge>}
                {test.status === 'failed' && <Badge variant="destructive" className="bg-destructive/10 text-destructive">Score: {test.score}%</Badge>}
                {test.status === 'pending' && <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">Ready</Badge>}
              </div>
              <CardTitle className="text-xl">{test.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {test.status === 'pending' && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-secondary/20 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> {test.questions} Qs</div>
                  <div className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {test.estimatedTime}</div>
                </div>
              )}

              {test.status === 'failed' && (
                <div className="bg-destructive/5 border border-destructive/20 p-3 rounded-lg space-y-2">
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Weak Concept Detected
                  </p>
                  <p className="text-sm text-foreground/80">{test.weakConcept}</p>
                </div>
              )}

              {test.status === 'completed' && (
                <div className="bg-eureka-success/5 border border-eureka-success/20 p-3 rounded-lg">
                  <p className="text-sm text-eureka-success/80">Concept mastered. Excellent algorithmic thinking applied.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {test.status === 'pending' ? (
                <Button 
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30 group"
                  onClick={() => setSelectedTest({ title: test.title, duration: parseInt(test.estimatedTime ?? '10', 10) || 10 })}
                >
                  Start Micro-Test <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : test.status === 'failed' ? (
                <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 group" onClick={() => toast({ title: "Tutorial Loaded", description: "Opening adaptive review micro-course..." })}>
                  Review Simplified Tutorial <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button variant="outline" className="w-full text-muted-foreground opacity-50 cursor-default" disabled>
                  Completed
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <QuizModal 
        isOpen={!!selectedTest} 
        onClose={() => setSelectedTest(null)} 
        title={selectedTest?.title ?? 'AI Assessment'}
        testDurationMinutes={selectedTest?.duration || 10}
      />
    </div>
  )
}
