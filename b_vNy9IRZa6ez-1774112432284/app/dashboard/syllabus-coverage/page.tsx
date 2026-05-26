"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Map, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { mockSyllabusCoverage, mockComprehension } from '@/lib/data'
import { CoverageHeatmap } from '@/components/syllabus/coverage-heatmap'
import { TimelineChart } from '@/components/syllabus/timeline-chart'

export default function SyllabusCoveragePage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Map className="w-8 h-8 text-primary" />
            Syllabus Coverage
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time curriculum progression vs. student comprehension mapping.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Upload Triggered", description: "Waiting for external service to process syllabus PDF..." })}>
            Upload Master Syllabus
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => toast({ title: "Progress Synced", description: "Successfully updated mapping with today's lecture schedule." })}>
            Log Lecture Progress
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Aggregate Coverage</CardDescription>
            <CardTitle className="text-4xl">{mockSyllabusCoverage.overallCoverage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              On track with academic calendar
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Class Comprehension</CardDescription>
            <CardTitle className="text-4xl text-amber-600 dark:text-amber-500">{mockComprehension.comprehension}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              {mockComprehension.gap}% trailing gap
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm col-span-2 bg-sidebar border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Critical Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">Lagging Domains</span>
                <span className="text-muted-foreground">Unit 4 & 5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">Weak Comprehension Areas</span>
                <div className="flex gap-2">
                  {mockComprehension.weakTopics.map(topic => (
                    <Badge key={topic} variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 px-1 py-0 text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Unit-wise Heatmap</CardTitle>
            <CardDescription>Visual completion status by syllabus unit</CardDescription>
          </CardHeader>
          <CardContent>
            <CoverageHeatmap data={mockSyllabusCoverage.unitCoverage} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Expected vs. Actual Completion</CardTitle>
            <CardDescription>Timeline correlation tracking for the semester</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pb-0">
            <TimelineChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
