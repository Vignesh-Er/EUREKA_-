"use client"

import { useAuth } from '@/lib/auth-context'
import { sampleRoadmap, contextCards, sampleAssessment, badges, courses } from '@/lib/data'
import { xpProgress, xpForNextLevel } from '@/lib/data'
import type { StudentProfile } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Flame, 
  Zap, 
  Trophy, 
  BookOpen, 
  Target, 
  ArrowRight, 
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  Calendar,
  MapPin,
  BrainCircuit,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  Route,
  Layers3
} from 'lucide-react'
import Link from 'next/link'

export function StudentDashboard() {
  const { user } = useAuth()
  const student = user as StudentProfile

  if (!student) return null

  const progress = xpProgress(student.xp, student.level)
  const nextLevelXp = xpForNextLevel(student.level)
  const currentSemester = sampleRoadmap.semesters.find(s => s.status === 'current')

  // Today's items mock data
  const todayItems = [
    { id: 1, type: 'lecture', title: 'Control Systems - PID Tuning', time: '09:00 AM', status: 'upcoming', xp: 50 },
    { id: 2, type: 'assessment', title: 'Fourier Transform Micro-test', time: '11:00 AM', status: 'ready', xp: 100 },
    { id: 3, type: 'self-study', title: 'PyTorch Basics - Chapter 3', time: '2:00 PM', status: 'pending', xp: 30 },
    { id: 4, type: 'lab', title: 'VLSI Lab - Project Work', time: '4:00 PM', status: 'upcoming', xp: 75 },
  ]

  const featuredContextCard = contextCards[0]
  const intelligenceSignals = [
    {
      engine: 'Evaluation',
      status: 'Risk detected',
      summary: 'Fourier quiz readiness is trending down after two missed practice loops.',
      action: 'Take Micro-Test',
      href: '/dashboard/assessments',
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      icon: AlertCircle,
    },
    {
      engine: 'Context',
      status: 'Opportunity',
      summary: 'PID Controllers now maps to 4 lab demos and 3 target companies.',
      action: 'Open Context',
      href: '/dashboard/context',
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
      icon: Layers3,
    },
    {
      engine: 'Journey',
      status: 'Path updated',
      summary: 'Cloud fundamentals moved earlier to improve placement fit by 18%.',
      action: 'Review Roadmap',
      href: '/dashboard/roadmap',
      color: 'text-eureka-success',
      bg: 'bg-eureka-success/10',
      icon: Route,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {student.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Keep up the great work. You&apos;re making excellent progress this semester.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-eureka-streak/10 border border-eureka-streak/20">
            <Flame className="w-5 h-5 text-eureka-streak" />
            <div>
              <p className="text-lg font-bold text-eureka-streak">{student.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
          {/* XP & Level */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <Zap className="w-5 h-5 text-primary" />
            <div>
              <p className="text-lg font-bold text-primary">{student.xp.toLocaleString()} XP</p>
              <p className="text-xs text-muted-foreground">Level {student.level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Progress */}
          <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Level Progress</span>
              <Trophy className="w-4 h-4 text-chart-3" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">Level {student.level}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {nextLevelXp - student.xp} XP to Level {student.level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Semester Progress */}
          <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Semester Progress</span>
              <Calendar className="w-4 h-4 text-chart-1" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{sampleRoadmap.progress}%</span>
                <span className="text-sm text-muted-foreground">Sem {student.currentSemester}</span>
              </div>
              <Progress value={sampleRoadmap.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {currentSemester?.courses.filter(c => c.status === 'completed').length || 0}/{currentSemester?.courses.length || 0} courses completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mastery Score */}
          <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Avg Mastery</span>
              <TrendingUp className="w-4 h-4 text-eureka-success" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">78%</span>
                <Badge variant="secondary" className="bg-eureka-success/10 text-eureka-success text-xs">+5%</Badge>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Across all enrolled courses
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badges Earned */}
          <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Badges Earned</span>
              <Trophy className="w-4 h-4 text-chart-4" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{student.badges.length}</span>
                <span className="text-sm text-muted-foreground">/ {badges.length}</span>
              </div>
              <div className="flex -space-x-1">
                {student.badges.slice(0, 5).map((badge, i) => (
                  <div 
                    key={badge.id} 
                    className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                    title={badge.name}
                  >
                    <span className="text-xs">{badge.icon === 'compass' ? '🧭' : badge.icon === 'flame' ? '🔥' : '⏰'}</span>
                  </div>
                ))}
                {student.badges.length > 5 && (
                  <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{student.badges.length - 5}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/achievements" className="text-primary hover:underline">View all badges</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-primary/25 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Intelligence Orchestration
              </CardTitle>
              <CardDescription>One prioritized view across your evaluation, context, and journey engines</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit border-primary/30 bg-primary/10 text-primary">
              Live academic twin
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {intelligenceSignals.map((signal) => {
              const Icon = signal.icon
              return (
                <Link
                  key={signal.engine}
                  href={signal.href}
                  className="group rounded-lg border border-border bg-secondary/20 p-4 transition-colors hover:border-primary/40 hover:bg-secondary/35"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${signal.bg}`}>
                      <Icon className={`h-5 w-5 ${signal.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                      {signal.engine}
                    </Badge>
                  </div>
                  <p className={`text-sm font-semibold ${signal.color}`}>{signal.status}</p>
                  <p className="mt-2 min-h-12 text-sm text-muted-foreground">{signal.summary}</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                    {signal.action}
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Action Center */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-card to-primary/5 border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-50">
            <Sparkles className="w-24 h-24 text-primary animate-pulse blur-xl" />
          </div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">Smart Action Center</CardTitle>
                </div>
                <CardDescription>AI-generated priorities based on your Digital Twin & Placement goals</CardDescription>      
              </div>
              <Badge variant="outline" className="w-fit bg-primary/10 text-primary border-primary/30 uppercase tracking-widest text-[10px]">
                <BrainCircuit className="w-3 h-3 mr-1" /> Auto-Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            
            {/* Top Priority */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group hover:bg-destructive/15 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive" className="text-[10px]">Top Priority</Badge>
                    <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1"/> Due in 4 hours</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Complete AI Mastery Challenge</h4>
                  <p className="text-sm text-muted-foreground mt-1">Your streak is at risk. 94% of your cohort has already submitted.</p>
                </div>
              </div>
              <Button size="sm" className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20" asChild>
                <Link href="/dashboard/ai-mastery">Start Challenge <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>

            {/* Smart Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/dashboard/digital-twin" className="p-4 rounded-xl bg-card border border-white/5 hover:border-primary/50 transition-all group flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-chart-1/20 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-chart-1" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-chart-1 border-chart-1/30">Weak Link</Badge>
                  </div>
                  <h4 className="font-medium text-sm">Review Laplace Transforms</h4>
                  <p className="text-xs text-muted-foreground mt-1">Your Digital Twin predicts an 85% chance of struggling in tomorrow's quiz.</p>
                </div>
                <div className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Fix Knowledge Gap <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
              
              <Link href="/dashboard/placement" className="p-4 rounded-xl bg-card border border-white/5 hover:border-accent/50 transition-all group flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-accent" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-accent border-accent/30">Career Goal</Badge>
                  </div>
                  <h4 className="font-medium text-sm">Start AWS Cloud Practitioner</h4>
                  <p className="text-xs text-muted-foreground mt-1">Closes a 45% skill gap for your target role: Distributed Systems Engineer.</p>
                </div>
                <div className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Placement Path <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>

          </CardContent>
        </Card>

        {/* Featured Context Card */}
          <Card className="bg-card border-primary/25 overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Featured Context</CardTitle>
            </div>
            <CardDescription>Understanding the &quot;why&quot; behind concepts</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">{featuredContextCard.topicName}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {featuredContextCard.whyItExists}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry Applications</p>
              <div className="flex flex-wrap gap-2">
                {featuredContextCard.industryApplications.slice(0, 3).map((app, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {app.industry}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Companies Hiring</p>
              <div className="flex flex-wrap gap-2">
                {featuredContextCard.companiesHiring.slice(0, 3).map((company, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {company.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/dashboard/context">
                Explore Full Context
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses & Progress */}
      <Card className="bg-card border-primary/25">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Current Courses</CardTitle>
              <CardDescription>Semester {student.currentSemester} progress</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/courses">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSemester?.courses.map((course) => (
              <div 
                key={course.courseId}
                className="p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{course.courseName}</p>
                    <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{course.credits} cr</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mastery</span>
                    <span className="font-medium">{course.masteryLevel || 0}%</span>
                  </div>
                  <Progress value={course.masteryLevel || 0} className="h-1.5" />
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {course.relevanceTags?.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/discovery">
            <Target className="w-6 h-6 text-primary" />
            <span>Explore Labs</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/assessments">
            <CheckCircle2 className="w-6 h-6 text-eureka-success" />
            <span>Take Assessment</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/context">
            <Sparkles className="w-6 h-6 text-accent" />
            <span>Context Cards</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/roadmap">
            <TrendingUp className="w-6 h-6 text-chart-1" />
            <span>My Roadmap</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
