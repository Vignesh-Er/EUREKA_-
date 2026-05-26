"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { HeartHandshake, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, BookOpen, Clock, CalendarDays, BrainCircuit, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

// Mock Data for the Ward
const wardData = {
  name: "Alex",
  overallStatus: "improving", // 'improving', 'stagnant', 'down'
  strengths: ["Frontend Development", "Problem Solving", "Consistency"],
  areasToImprove: ["Advanced Algorithms", "Time Management in Quizzes"],
  scheduleAlert: "Placement Drives Active (Do not disturb - High Focus week)",
  assignments: {
    completed: 24,
    pending: 3,
    overdue: 0
  },
  learningGraph: [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 64 },
    { name: 'Week 4', score: 72 },
    { name: 'Week 5', score: 78 },
    { name: 'Week 6', score: 85 },
  ]
}

export default function ParentDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    toast({ title: 'Logged Out', description: 'You have been logged out of the Parent Portal.' })
    router.push('/parent-portal/login')
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <HeartHandshake className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {wardData.name}'s Progress
              </h1>
              <p className="text-muted-foreground text-sm">Parent support and summary dashboard</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-fit">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* High Alert / Schedule Banner */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-4">
          <div className="mt-0.5"><CalendarDays className="w-5 h-5 text-destructive" /></div>
          <div>
            <h3 className="font-semibold text-destructive">Crucial Period Active</h3>
            <p className="text-sm text-destructive-foreground mt-1">
              {wardData.name} is currently engaging in <strong>{wardData.scheduleAlert}</strong>. 
              Extra mental support and a distraction-free home environment will highly benefit their productivity right now.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Graph Card */}
          <Card className="md:col-span-2 bg-card/40 border-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Learning Velocity
              </CardTitle>
              <CardDescription>Overall performance trajectory over the recent weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wardData.learningGraph} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-secondary/30 rounded-lg text-sm">
                Status: 
                <span className="font-semibold text-eureka-success flex items-center gap-1">
                  Constantly Improving <TrendingUp className="w-4 h-4"/>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Work Completion */}
          <Card className="bg-card/40 border-white/5 backdrop-blur-md flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Assignment Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold">{wardData.assignments.completed}</div>
                <div className="text-sm text-muted-foreground">Successfully Completed</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-yellow-500"><Clock className="w-4 h-4"/> Pending Work</span>
                  <span className="font-bold">{wardData.assignments.pending}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-destructive"><AlertCircle className="w-4 h-4"/> Overdue</span>
                  <span className="font-bold">{wardData.assignments.overdue}</span>
                </div>
              </div>

              <div className="p-3 bg-secondary/30 rounded-lg text-xs leading-relaxed border border-border/50">
                {wardData.name} is keeping up with work well. No immediate interventions needed regarding submissions.
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <Card className="md:col-span-3 bg-card/40 border-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-5 h-5"/> Talent Map Summary</CardTitle>
              <CardDescription>Filtered psychological & academic strengths to help you encourage your ward</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4 p-4 rounded-xl border border-eureka-success/20 bg-eureka-success/5">
                <h3 className="font-semibold text-eureka-success flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5"/> What They Are Excelling At
                </h3>
                <ul className="space-y-2">
                  {wardData.strengths.map((str, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-eureka-success" />
                      {str}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Tip: Praise them for these specific skills when they share their day with you.
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
                <h3 className="font-semibold text-orange-500 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5"/> Areas Under Development
                </h3>
                <ul className="space-y-2">
                  {wardData.areasToImprove.map((area, i) => (
                    <li key={i} className="text-sm flex items-center gap-2 text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      {area}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Tip: Avoid putting pressure on these areas. Let them figure it out at their pace, offer comfort if they express frustration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}