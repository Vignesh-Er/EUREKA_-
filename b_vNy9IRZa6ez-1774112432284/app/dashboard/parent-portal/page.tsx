"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, AlertCircle, BookOpen } from 'lucide-react'

// Mock Data
const parentData = {
  studentName: "Alex Johnson",
  attendance: 88,
  academicTrend: "Improving",
  recentAchievements: ["Top 10% in ML Midterm", "Completed AWS Cloud Basics"],
  flags: ["Missed two subsequent physics lectures"]
}

export default function ParentPortalPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-border/10 pb-6">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Parent Portal: {parentData.studentName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-eureka-success"/> Academic Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Overall Attendance</span>
              <span className="font-bold text-lg">{parentData.attendance}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Performance Trend</span>
              <Badge variant="outline" className="bg-eureka-success/10 text-eureka-success border-eureka-success/20">{parentData.academicTrend}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5"/> Attention Required</CardTitle>
          </CardHeader>
          <CardContent>
            {parentData.flags.length > 0 ? (
              <ul className="space-y-3">
                {parentData.flags.map((flag, i) => (
                  <li key={i} className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {flag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground p-4 text-center bg-secondary/20 rounded-lg">No active alerts.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 md:col-span-2 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {parentData.recentAchievements.map((achievement, i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary/20 border border-border/50 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
