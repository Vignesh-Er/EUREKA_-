"use client"

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Swords, Trophy, Clock, Zap, Target, AlertTriangle, Send, UserX, UserCheck } from 'lucide-react'
import { useState } from 'react'

const leaderboard = [
  { rank: 1, name: "David K.", score: 98, streak: 14, tag: "AI Whisperer" },
  { rank: 2, name: "Sarah J.", score: 95, streak: 8, tag: "Prompt Engineer" },
  { rank: 3, name: "You", score: 88, streak: 3, tag: "Rising Star", isCurrentUser: true },
  { rank: 4, name: "Alex C.", score: 85, streak: 5, tag: "Creative Coder" },
]

const defaulters = [
  { id: '10293', name: 'John Doe', department: 'Mechanical', daysMissed: 3, status: 'Reported to Advisor' },
  { id: '10442', name: 'Emily Chen', department: 'Computer Science', daysMissed: 1, status: 'Warning Sent' }
]

export default function AIMasteryPage() {
  const { user } = useAuth()
  const isStudent = user?.role === 'student'
  const [submission, setSubmission] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (isStudent) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Swords className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
                AI Mastery Forge
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              AGI is the future. Regardless of your major, you must master AI tools within 2 semesters. 
              Complete this daily 10-minute micro-task to stay on the leaderboard and avoid default status.
            </p>
          </div>
          <Badge className="bg-destructive/10 text-destructive border-transparent shrink-0">
            <Clock className="w-4 h-4 mr-2" /> Closes in 4h 12m
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Daily Task Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/40 border-primary/30 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10" />
              <CardHeader>
                <Badge variant="outline" className="w-fit text-xs text-primary bg-primary/10 border-primary/30 mb-2">
                  Daily Challenge #142
                </Badge>
                <CardTitle className="text-2xl">Explain Quantum Entanglement to a 5-Year-Old</CardTitle>
                <CardDescription className="text-base mt-2 text-foreground/80">
                  Use any LLM. Your goal is to prompt it to produce the most intuitive, magical, yet scientifically accurate short story explaining quantum entanglement. Paste the prompt methodology and output below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!submitted ? (
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Paste your prompt chain and the resulting output here..." 
                      className="min-h-[200px] bg-background/50 border-border/50 text-base"
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                    />
                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/30">
                      <Zap className="w-4 h-4 text-accent" />
                      AI will evaluate your submission for creativity, constraint adherence, and prompt efficiency.
                    </div>
                  </div>
                ) : (
                  <div className="bg-eureka-success/10 border border-eureka-success/30 p-6 rounded-xl flex flex-col justify-center items-center text-center space-y-4 animate-in zoom-in-95 duration-500">
                    <Trophy className="w-12 h-12 text-eureka-success" />
                    <div>
                      <h3 className="text-xl font-bold text-eureka-success">Spectacular Work!</h3>
                      <p className="text-foreground/80 mt-1">The AI graded your submission relatively against your peers.</p>
                    </div>
                    <div className="flex items-end gap-2 bg-background p-4 rounded-lg border border-border/50">
                      <span className="text-5xl font-black text-foreground">88</span>
                      <span className="text-muted-foreground mb-1">/ 100 Score</span>
                    </div>
                  </div>
                )}
              </CardContent>
              {!submitted && (
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold"
                    onClick={() => setSubmitted(true)}
                  >
                    <Send className="w-4 h-4 mr-2" /> Submit for Evaluation
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Leaderboard Section */}
          <div className="space-y-6">
            <Card className="bg-card/40 border-border/50 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-accent" /> Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {leaderboard.map((user) => (
                  <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg border ${user.isCurrentUser ? 'bg-primary/10 border-primary/30' : 'bg-background/40 border-border/50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : user.rank === 2 ? 'bg-slate-300/20 text-slate-300' : user.rank === 3 ? 'bg-amber-600/20 text-amber-600' : 'bg-secondary text-muted-foreground'}`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-2">
                          {user.name} {user.isCurrentUser && <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded">YOU</span>}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user.tag}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-sm">{user.score}</p>
                      <p className="text-[10px] text-eureka-streak">🔥 {user.streak} days</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    )
  }

  // Admin/Prof View (Defaulters)
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              AI Mastery Defaulters
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Monitor students failing to engage with the mandatory daily AI tool specialization tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="bg-card/40 border-border/50 backdrop-blur-md md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Active Defaulter List
            </CardTitle>
            <CardDescription>Students marked as defaulters are automatically reported to their class advisors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {defaulters.map(def => (
              <div key={def.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-xl gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-background rounded-full border border-border/50 text-muted-foreground">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{def.name}</h4>
                    <p className="text-xs text-muted-foreground">{def.department} • ID: {def.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Days Missed</p>
                    <p className="font-bold text-destructive font-mono text-lg">{def.daysMissed}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Action</p>
                    <Badge variant="outline" className="text-[10px] border-destructive/50 text-destructive bg-destructive/10">
                      {def.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Cohort AI Mastery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center pt-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-eureka-success" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.94)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
                <span className="text-2xl font-bold">94%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Of students submitted today's challenge.</p>
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-center justify-center gap-2 text-sm text-primary">
              <UserCheck className="w-4 h-4" /> Participation up 5% this week
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
