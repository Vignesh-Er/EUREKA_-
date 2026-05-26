"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { mockTeachingScore, mockStaffTrends } from '@/lib/data'
import { TeachingScoreCard } from '@/components/staff/teaching-score-card'

export default function StaffPerformancePage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Staff Intelligence
          </h2>
          <p className="text-muted-foreground mt-1">
            Data-backed teaching quality insights and performance tracking.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search faculty..."
              className="pl-8 w-64 border-sidebar-border bg-sidebar"
            />
          </div>
          <Badge variant="outline" className="flex items-center gap-2 px-3 hover:bg-sidebar-accent cursor-pointer transition-colors bg-sidebar text-foreground">
            <Filter className="w-4 h-4" /> Filter
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-sm bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl text-primary font-bold">8.4</CardTitle>
            <CardDescription className="text-primary/80 font-medium">Institution Average (TI Score)</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl">78%</CardTitle>
            <CardDescription>Average Syllabus Coverage</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl">92%</CardTitle>
            <CardDescription>Positive Feedback Rate</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-4xl text-emerald-600 dark:text-emerald-500">+12%</CardTitle>
            <CardDescription>YoY Performance Improvement</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          Faculty Performance Directory
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TeachingScoreCard 
            professor={{ id: 'prof-1', name: 'Dr. Alice Smith', department: 'Computer Science' }}
            score={mockTeachingScore}
            trend={mockStaffTrends[0]}
          />
          <TeachingScoreCard 
            professor={{ id: 'prof-2', name: 'Dr. Bob Jones', department: 'Electrical Engineering' }}
            score={{
              ...mockTeachingScore,
              compositeScore: 9.1,
              components: { syllabusCoverage: 9.5, studentComprehension: 8.8, feedbackSentiment: 9.2, activity: 9.0 }
            }}
            trend={mockStaffTrends[1]}
          />
          <TeachingScoreCard 
            professor={{ id: 'prof-3', name: 'Dr. Carol White', department: 'Data Science' }}
            score={{
              ...mockTeachingScore,
              compositeScore: 7.2,
              components: { syllabusCoverage: 6.5, studentComprehension: 7.0, feedbackSentiment: 7.8, activity: 7.5 }
            }}
            trend={{ professorId: 'prof-3', trend: 'declining', historicalScores: [8.0, 7.5, 7.2] }}
          />
        </div>
      </div>
    </div>
  )
}
