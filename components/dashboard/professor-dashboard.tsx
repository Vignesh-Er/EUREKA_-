"use client"

import { useAuth } from '@/lib/auth-context'
import { courses, sampleFeedback } from '@/lib/data'
import type { ProfessorProfile } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Users,
  BarChart3,
  MessageSquare,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  FileText,
  Video,
  Star
} from 'lucide-react'
import Link from 'next/link'

export function ProfessorDashboard() {
  const { user } = useAuth()
  const professor = user as ProfessorProfile

  if (!professor) return null

  // Mock analytics data
  const courseStats = [
    { id: 'course-signals', name: 'Signals and Systems', code: 'ECE301', students: 45, avgScore: 78, trend: 'up', atRisk: 3 },
    { id: 'course-vlsi', name: 'VLSI Design', code: 'ECE401', students: 32, avgScore: 82, trend: 'up', atRisk: 1 },
  ]

  const recentUploads = [
    { id: 1, name: 'Lecture 12 - PID Control', type: 'slides', status: 'processed', date: '2 hours ago' },
    { id: 2, name: 'Lab Manual - FPGA Setup', type: 'pdf', status: 'processing', date: '1 day ago' },
    { id: 3, name: 'Tutorial Recording', type: 'video', status: 'processed', date: '3 days ago' },
  ]

  const pendingFeedback = sampleFeedback.filter(f => f.status === 'pending')

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {professor.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {professor.department} | {professor.courses.length} Active Courses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
            <Star className="w-5 h-5 text-chart-3" />
            <div>
              <p className="text-lg font-bold text-chart-3">{professor.rating}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">77</p>
              </div>
              <Users className="w-8 h-8 text-primary/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">79%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-eureka-success/20" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-eureka-success" />
              <p className="text-xs text-eureka-success">+3% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At-Risk Students</p>
                <p className="text-2xl font-bold text-eureka-warning">4</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-eureka-warning/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/25">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Feedback</p>
                <p className="text-2xl font-bold">{pendingFeedback.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-chart-1/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Unreviewed responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Overview */}
        <Card className="lg:col-span-2 bg-card border-primary/25">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Course Overview</CardTitle>
                <CardDescription>Performance metrics for your courses</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/analytics">
                  View Analytics
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseStats.map((course) => (
              <div 
                key={course.id}
                className="p-4 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.atRisk > 0 && (
                      <Badge variant="secondary" className="bg-eureka-warning/10 text-eureka-warning">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {course.atRisk} at risk
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="text-lg font-semibold">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-semibold">{course.avgScore}%</p>
                      {course.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-eureka-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <p className="text-lg font-semibold">68%</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Topic Coverage</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upload Hub */}
        <Card className="bg-card border-primary/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Hub
            </CardTitle>
            <CardDescription>Recent uploads and AI processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Upload */}
            <Button className="w-full" asChild>
              <Link href="/dashboard/upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Content
              </Link>
            </Button>

            {/* Recent Uploads */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</p>
              {recentUploads.map((upload) => (
                <div 
                  key={upload.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    upload.type === 'slides' ? 'bg-chart-1/10 text-chart-1' :
                    upload.type === 'pdf' ? 'bg-chart-5/10 text-chart-5' :
                    'bg-chart-2/10 text-chart-2'
                  }`}>
                    {upload.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{upload.name}</p>
                    <p className="text-xs text-muted-foreground">{upload.date}</p>
                  </div>
                  {upload.status === 'processed' ? (
                    <CheckCircle2 className="w-4 h-4 text-eureka-success" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Feedback & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback */}
        <Card className="bg-card border-primary/25">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Student Feedback</CardTitle>
                <CardDescription>Anonymous feedback from your courses</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/feedback">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleFeedback.map((feedback) => (
              <div 
                key={feedback.id}
                className="p-3 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className={
                    feedback.sentiment === 'positive' ? 'bg-eureka-success/10 text-eureka-success' :
                    feedback.sentiment === 'negative' ? 'bg-destructive/10 text-destructive' :
                    'bg-muted text-muted-foreground'
                  }>
                    {feedback.category}
                  </Badge>
                  <Badge variant="outline" className={
                    feedback.urgency === 'high' ? 'border-eureka-warning text-eureka-warning' :
                    'border-border'
                  }>
                    {feedback.urgency}
                  </Badge>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{feedback.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {feedback.createdAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-card border-primary/25 overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Teaching Insights
            </CardTitle>
            <CardDescription>Automated analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="p-3 rounded-lg bg-eureka-info/10 border border-eureka-info/20">
              <p className="text-sm font-medium text-eureka-info">Topic Difficulty Alert</p>
              <p className="text-sm text-foreground mt-1">
                Students in ECE301 are struggling with Laplace Transform. Consider adding more worked examples.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-eureka-success/10 border border-eureka-success/20">
              <p className="text-sm font-medium text-eureka-success">Positive Trend</p>
              <p className="text-sm text-foreground mt-1">
                Fourier Transform understanding improved by 15% after adding Context Cards.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <p className="text-sm font-medium text-chart-3">Recommendation</p>
              <p className="text-sm text-foreground mt-1">
                3 students would benefit from additional lab sessions on PID tuning.
              </p>
            </div>

            <Button variant="outline" className="w-full">
              View All Insights
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
