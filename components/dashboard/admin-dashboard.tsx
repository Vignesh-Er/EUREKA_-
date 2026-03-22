"use client"

import { useAuth } from '@/lib/auth-context'
import { sampleFeedback, hardwareRequests, professors } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  MessageSquare,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock,
  TrendingUp,
  DollarSign,
  UserCheck,
  XCircle,
  BarChart3,
  PieChart
} from 'lucide-react'
import Link from 'next/link'

export function AdminDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Mock data for admin view
  const substituteRequests = [
    { id: 1, professor: 'Dr. Kumar', course: 'ECE301', date: 'Tomorrow', reason: 'Conference', status: 'pending' },
    { id: 2, professor: 'Dr. Zhang', course: 'CS421', date: 'Mar 25', reason: 'Medical', status: 'pending' },
    { id: 3, professor: 'Dr. Patel', course: 'ECE350', date: 'Mar 28', reason: 'Travel', status: 'pending' },
  ]

  const feedbackSummary = {
    total: 47,
    positive: 28,
    neutral: 12,
    negative: 7,
    critical: 2,
    categories: [
      { name: 'Teaching Quality', count: 18 },
      { name: 'Infrastructure', count: 12 },
      { name: 'Course Content', count: 9 },
      { name: 'Lab Equipment', count: 8 },
    ]
  }

  const pendingFeedback = sampleFeedback.filter(f => f.status === 'pending')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
        <p className="text-muted-foreground mt-1">
          Administrative overview and action items
        </p>
      </div>

      {/* Action Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-primary/25 border-l-4 border-l-eureka-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Substitute Requests</p>
                <p className="text-2xl font-bold text-eureka-warning">{substituteRequests.length}</p>
              </div>
              <Users className="w-8 h-8 text-eureka-warning/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pending assignment</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/25 border-l-4 border-l-chart-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feedback Pending</p>
                <p className="text-2xl font-bold text-chart-1">{pendingFeedback.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-chart-1/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{feedbackSummary.critical} critical</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/25 border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hardware Requests</p>
                <p className="text-2xl font-bold text-accent">{hardwareRequests.length}</p>
              </div>
              <Wrench className="w-8 h-8 text-accent/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/25 border-l-4 border-l-eureka-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-eureka-success">98%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-eureka-success/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Substitute Requests */}
        <Card className="lg:col-span-2 bg-card border-primary/25">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Substitute Assignments</CardTitle>
                <CardDescription>AI-recommended substitute teachers</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/substitutes">
                  Manage All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {substituteRequests.map((request) => (
              <div 
                key={request.id}
                className="p-4 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{request.professor}</h3>
                    <p className="text-sm text-muted-foreground">{request.course} - {request.date}</p>
                  </div>
                  <Badge variant="secondary" className="bg-eureka-warning/10 text-eureka-warning">
                    <Clock className="w-3 h-3 mr-1" />
                    {request.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">Reason: {request.reason}</p>

                {/* AI Recommendations */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Recommendations</p>
                  {professors.slice(0, 2).map((prof, i) => (
                    <div key={prof.id} className="flex items-center justify-between p-2 rounded bg-background">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">{prof.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{prof.name}</p>
                          <p className="text-xs text-muted-foreground">{prof.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {95 - i * 8}% match
                        </Badge>
                        <Button size="sm" variant="default">Assign</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Feedback Overview */}
        <Card className="bg-card border-primary/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Feedback Summary</CardTitle>
            <CardDescription>This month&apos;s student feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sentiment Distribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Positive</span>
                <span className="text-sm font-medium text-eureka-success">{feedbackSummary.positive}</span>
              </div>
              <Progress value={(feedbackSummary.positive / feedbackSummary.total) * 100} className="h-2 bg-secondary" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Neutral</span>
                <span className="text-sm font-medium">{feedbackSummary.neutral}</span>
              </div>
              <Progress value={(feedbackSummary.neutral / feedbackSummary.total) * 100} className="h-2 bg-secondary" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Negative</span>
                <span className="text-sm font-medium text-destructive">{feedbackSummary.negative}</span>
              </div>
              <Progress value={(feedbackSummary.negative / feedbackSummary.total) * 100} className="h-2 bg-secondary" />
            </div>

            {/* Categories */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Top Categories</p>
              <div className="space-y-2">
                {feedbackSummary.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="text-sm">{cat.name}</span>
                    <Badge variant="secondary">{cat.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/feedback">
                View All Feedback
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Hardware Requests */}
      <Card className="bg-card border-primary/25">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Hardware Procurement Queue</CardTitle>
              <CardDescription>Student equipment requests with AI evaluation</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/procurement">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hardwareRequests.map((request) => (
              <div 
                key={request.id}
                className="p-4 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{request.equipmentName}</h3>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${request.estimatedCost.toLocaleString()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Beneficiaries</p>
                    <p className="text-sm font-medium">{request.estimatedBeneficiaries} students</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Relevant Courses</p>
                    <p className="text-sm font-medium">{request.relevantCourses.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Recommendation</p>
                    <Badge className={
                      request.aiEvaluation?.recommendation === 'approve' 
                        ? 'bg-eureka-success text-white' 
                        : request.aiEvaluation?.recommendation === 'reject'
                        ? 'bg-destructive text-white'
                        : 'bg-eureka-warning text-white'
                    }>
                      {request.aiEvaluation?.recommendation.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* AI Scores */}
                {request.aiEvaluation && (
                  <div className="grid grid-cols-3 gap-4 p-3 rounded bg-background mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{request.aiEvaluation.benefitScore}%</p>
                      <p className="text-xs text-muted-foreground">Benefit</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-accent">{request.aiEvaluation.relevanceScore}%</p>
                      <p className="text-xs text-muted-foreground">Relevance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-chart-3">{request.aiEvaluation.costEffectivenessScore}%</p>
                      <p className="text-xs text-muted-foreground">Cost Efficiency</p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-4">{request.aiEvaluation?.reasoning}</p>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 bg-eureka-success hover:bg-eureka-success/90 text-white">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    Defer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/analytics">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span>View Analytics</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/substitutes">
            <UserCheck className="w-6 h-6 text-eureka-warning" />
            <span>Manage Substitutes</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/feedback">
            <MessageSquare className="w-6 h-6 text-chart-1" />
            <span>Review Feedback</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link href="/dashboard/procurement">
            <Wrench className="w-6 h-6 text-accent" />
            <span>Procurement</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
