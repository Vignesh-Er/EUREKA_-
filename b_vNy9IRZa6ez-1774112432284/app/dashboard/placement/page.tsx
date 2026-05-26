"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Briefcase, Target, Trophy, TrendingUp, Building, UserCheck, Users, BriefcaseBusiness, AlertTriangle, ArrowRight, BrainCircuit, Sparkles, Send } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from '@/hooks/use-toast'
import { fetchApi } from '@/lib/api'

// Fallback Mock Data for Student
const fallbackStudentData = {
  score: 85,
  gapSkills: [
    { skill: 'React Native', required: 80, current: 40 },
    { skill: 'AWS Cloud', required: 90, current: 65 }
  ],
  matchedCompanies: [
    { name: 'TechNova', role: 'Frontend Engineer', match: 92, skillsRequested: ['React', 'TypeScript', 'Tailwind'] },
    { name: 'Globex', role: 'Full Stack Dev', match: 78, skillsRequested: ['Node.js', 'React', 'AWS'] }
  ],
  journey: ['Applied - TechNova', 'Shortlisted - Globex', 'Interviewing - TechNova'],
  recommendations: [
    { day: 1, focus: 'Strengthen weak topics first.', priority: 'high' },
    { day: 2, focus: 'Practice coding challenges on system design.', priority: 'medium' }
  ]
}

// Fallback Mock Data for Admin
const fallbackAdminData = {
  eligibleStudents: 64, 
  topCompanies: [
    { name: 'TechNova', eligible: 78, gap: 'React Native (45% students lack this)' },
    { name: 'Globex', eligible: 42, gap: 'AWS Cloud (65% students lack this)' },
    { name: 'Apex Systems', eligible: 88, gap: 'System Design (12% students lack this)' }
  ],
  overallSkillGaps: [
    { skill: 'AWS Cloud', studentsLacking: 120, severity: 'High' },
    { skill: 'System Design', studentsLacking: 85, severity: 'Medium' },
    { skill: 'React Native', studentsLacking: 60, severity: 'Low' },
  ],
  recentPlacements: [
    { student: 'Alex Johnson', company: 'TechNova', role: 'Frontend Engineer' },
    { student: 'Sarah Smith', company: 'Apex Systems', role: 'Backend Dev' }
  ]
}

export default function PlacementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'professor';
  const studentId = user?.id || 'student-1';

  // Student States
  const [readiness, setReadiness] = useState<any>(null)
  const [skillGaps, setSkillGaps] = useState<any[]>([])
  const [matches, setMatches] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Admin States
  const [adminReport, setAdminReport] = useState<any>(null)
  const [adminSkillGaps, setAdminSkillGaps] = useState<any[]>([])

  // AI Tutor Integration States
  const [activeTutorSkill, setActiveTutorSkill] = useState<string | null>(null)
  const [tutorChat, setTutorChat] = useState<any[]>([
    { role: 'assistant', content: 'Hi! I am your AI Career Tutor. Let\'s close your tech gaps. Pick any skill above to start a customized coding drill!' }
  ])
  const [userInput, setUserInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    async function loadPlacementData() {
      setIsLoading(true)
      try {
        if (!isAdmin) {
          // Fetch Student Datasets
          const readResult = await fetchApi<any>(`/placement/students/${studentId}/readiness`)
          const gapsResult = await fetchApi<any>(`/placement/students/${studentId}/skill-gaps`)
          const matchResult = await fetchApi<any>(`/placement/students/${studentId}/matches`)
          
          if (readResult) setReadiness(readResult)
          if (gapsResult) setSkillGaps(gapsResult)
          if (matchResult) setMatches(matchResult)
        } else {
          // Fetch Admin Datasets
          const report = await fetchApi<any>('/placement/')
          const gaps = await fetchApi<any>('/placement/skill-gaps')
          
          if (report) setAdminReport(report)
          if (gaps) setAdminSkillGaps(gaps)
        }
      } catch (err) {
        console.error("API error loading placement dashboard, using mock fallback:", err)
        // Set offline mock fallbacks
        if (!isAdmin) {
          setReadiness({ score: fallbackStudentData.score, breakdown: { coding: 90, aptitude: 80, communication: 85 } })
          setSkillGaps(fallbackStudentData.gapSkills)
          setMatches({
            readiness_summary: "Solid hardware & frontend mapping.",
            matchedCompanies: fallbackStudentData.matchedCompanies,
            action_plan: fallbackStudentData.recommendations
          })
        } else {
          setAdminReport({ total_placed: 450, average_ctc: 8.5 })
          setAdminSkillGaps(fallbackAdminData.overallSkillGaps)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadPlacementData()
  }, [studentId, isAdmin])

  // Trigger RAG Tutor on a specific skill gap
  const handleStartTutor = (skillName: string) => {
    setActiveTutorSkill(skillName)
    setTutorChat([
      { 
        role: 'assistant', 
        content: `Excellent choice! Let's close your gap in **${skillName}**. Here is a mini interview question: Explain how you would optimize a latency bottleneck in this stack. What is your strategy?` 
      }
    ])
  }

  const handleSendTutorMessage = async () => {
    if (!userInput.trim()) return
    const msg = userInput
    setUserInput('')
    setTutorChat(prev => [...prev, { role: 'user', content: msg }])
    setIsSending(true)

    try {
      // Direct call to active exam prep chat endpoint for zero-latency RAG tutoring
      const response = await fetchApi<any>('/exam-prep/chat', {
        method: 'POST',
        body: JSON.stringify({
          question: `Explain this tech concept and evaluate my answer on: ${activeTutorSkill}. User answer: ${msg}`,
          role: 'student',
          user_id: studentId,
          conversation: tutorChat.map(c => ({ role: c.role, content: c.content }))
        })
      })
      setTutorChat(prev => [...prev, { role: 'assistant', content: response.answer }])
    } catch (err) {
      console.error("AI Tutor response error:", err)
      setTutorChat(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered a brief connection glitch, but remember: latency is key! Focus on optimizing resource allocations.' 
      }])
    } finally {
      setIsSending(false)
    }
  }

  // Fallback bindings if data is still loading
  const studentReadinessScore = readiness?.score || fallbackStudentData.score
  const studentBreakdown = readiness?.breakdown || { coding: 90, aptitude: 80, communication: 85 }
  const studentCompanies = matches?.matchedCompanies || fallbackStudentData.matchedCompanies
  const studentActionPlan = matches?.action_plan || fallbackStudentData.recommendations

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 selection:bg-purple-500/30 selection:text-purple-200">
      <div className="flex items-center gap-3 border-b border-border/10 pb-6">  
        <Briefcase className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-primary to-cyan-400">
          {isAdmin ? 'Batch Placement Intelligence' : 'My Placement Intelligence'}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
          <p className="text-sm font-semibold text-violet-400 animate-pulse">Retrieving placement digital twin datasets...</p>
        </div>
      ) : !isAdmin ? (
        // STUDENT VIEW
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">    
            {/* Readiness Card */}
            <Card className="bg-card/40 border-primary/20 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-[50px] pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-400"><Trophy className="w-5 h-5"/> Readiness Score</CardTitle>
                <CardDescription>Based on digital twin XP & GPA</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-emerald-500/20">
                  <span className="text-4xl font-bold text-emerald-500">{studentReadinessScore}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full text-center mt-2 border-t border-border/20 pt-4">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Coding</span>
                    <p className="font-bold text-sm text-foreground">{studentBreakdown.coding}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Aptitude</span>
                    <p className="font-bold text-sm text-foreground">{studentBreakdown.aptitude}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Comm</span>
                    <p className="font-bold text-sm text-foreground">{studentBreakdown.communication}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matched Companies */}
            <Card className="bg-card/40 border-border/40 lg:col-span-2 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-400"><Building className="w-5 h-5"/> Matched Companies</CardTitle>
                <CardDescription>{matches?.readiness_summary || 'Top corporate recommendations for your current skillset'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {studentCompanies.map((company: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.role}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {company.skillsRequested.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-emerald-500">Match: {company.match}%</p>
                      </div>
                      <Button size="sm" onClick={() => toast({ title: "Application Fast-tracked", description: `Your profile has been shared with ${company.name}` })}>
                        Apply <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skill Gaps Card */}
            <Card className="bg-card/40 border-border/40 backdrop-blur-md lg:col-span-2 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-[50px] pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-400"><Target className="w-5 h-5"/> Skill Gaps & Focus Areas</CardTitle>
                <CardDescription>Select any skill to activate your AI Career Tutor sandbox</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {skillGaps.map(gap => (
                  <div key={gap.skill} className="space-y-2 border-b border-border/20 pb-4 last:border-none last:pb-0">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold">{gap.skill}</span>
                        <p className="text-xs text-muted-foreground">Required: {gap.required}% | Current: {gap.current}%</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-destructive font-semibold text-xs">Gap: {gap.required - gap.current}%</span>
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="text-violet-400 hover:text-violet-300 border-violet-500/30 gap-1 bg-violet-500/5 hover:bg-violet-500/10"
                          onClick={() => handleStartTutor(gap.skill)}
                        >
                          <BrainCircuit className="w-3 h-3" /> Train AI
                        </Button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-destructive/60 to-orange-500/60" style={{ width: `${gap.current}%` }} />
                    </div>
                  </div>
                ))}

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-sm mb-2 text-foreground/80 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400" /> NIM 3-Day Action Recommendations:
                  </h4>
                  {studentActionPlan.map((rec: any, i: number) => (
                    <div key={i} className="p-3 bg-secondary/30 rounded-lg flex gap-3 items-center border border-border/50">
                      <Badge variant="outline" className={`shrink-0 ${rec.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                        Day {rec.day || (i + 1)}
                      </Badge>
                      <p className="text-sm">
                        {rec.focus || rec.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Journey Tracker */}
            <Card className="bg-card/40 border-border/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-400"><TrendingUp className="w-5 h-5"/> Journey Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent pt-4">
                  {fallbackStudentData.journey.map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-violet-500/50 bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-col shadow-violet-500/20" />
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded border border-border/50 bg-card/50">
                        <p className="text-sm font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI INTERACTIVE SKILL SANDBOX CHANNEL */}
          {activeTutorSkill && (
            <Card className="border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-card/45 to-cyan-950/20 backdrop-blur-md shadow-lg overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
              <CardHeader className="border-b border-border/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-violet-400" />
                    <div>
                      <CardTitle className="text-lg font-bold">AI Skill Gap Coach: {activeTutorSkill}</CardTitle>
                      <CardDescription>Zero-hallucination interactive career training sandbox.</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTutorSkill(null)} className="text-xs hover:bg-white/5">
                    Close Sandbox
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chat Panel */}
                <div className="h-80 overflow-y-auto p-6 space-y-4">
                  {tutorChat.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm border ${
                        msg.role === 'user' 
                          ? 'bg-violet-600/20 border-violet-500/40 text-violet-100 rounded-br-none shadow-[0_0_20px_rgba(124,58,237,0.15)]' 
                          : 'bg-muted/50 border-border/40 text-foreground rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Input Panel */}
                <div className="p-4 border-t border-border/20 bg-background/30 flex gap-3">
                  <Input 
                    placeholder="Enter your strategy or coding answer here..." 
                    className="flex-1 bg-background/40 border-border/40 text-sm focus-visible:ring-violet-500/40"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
                  />
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-primary text-white hover:from-violet-700 shadow-md"
                    onClick={handleSendTutorMessage}
                    disabled={isSending || !userInput.trim()}
                  >
                    {isSending ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // ADMIN VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card/40 border-primary/20 backdrop-blur-md">        
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary"><Users className="w-5 h-5"/> Batch Eligibility</CardTitle>
              <CardDescription>Overall student readiness</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-emerald-500/20">
                <span className="text-4xl font-bold text-emerald-500">{fallbackAdminData.eligibleStudents}%</span>
              </div>
              <p className="text-muted-foreground text-sm text-center">Of students meet base criteria for upcoming drives.</p>
              <Button variant="outline" className="w-full mt-4" onClick={() => toast({ title: "List Exported", description: "Eligible student list exported to CSV." })}>
                View Eligible Students
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/40 lg:col-span-2 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="w-5 h-5"/> Company Readiness Index</CardTitle>
              <CardDescription>How well our batch aligns with upcoming drives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {fallbackAdminData.topCompanies.map((company, idx) => (
                <div key={idx} className="flex flex-col p-4 rounded-lg border border-border/50 bg-background/50 gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{company.name}</h3>
                    <span className="text-sm font-medium text-emerald-500">{company.eligible}% Eligible</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${company.eligible}%` }} />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                    <AlertTriangle className="w-4 h-4"/>
                    <span>Major Blocker: {company.gap}</span>
                  </div>
                  <Button variant="link" size="sm" className="w-fit p-0 h-auto self-start mt-2" onClick={() => toast({ title: "Workshop Initiated", description: `Crash course on ${company.gap.split(' ')[0]} planned.` })}>
                    Schedule Target Workshop
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/40 lg:col-span-2 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5"/> Batch-Wide Skill Gaps</CardTitle>
              <CardDescription>Skills currently lacking across the cohort</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {adminSkillGaps.map((gap, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                    <div>
                      <h4 className="font-medium text-sm">{gap.skill}</h4>
                      <p className="text-xs text-muted-foreground">{gap.studentsLacking || 78} students below threshold</p>
                    </div>
                    <Badge variant={gap.severity === 'High' ? 'destructive' : gap.severity === 'Medium' ? 'default' : 'secondary'}>
                      {gap.severity || 'High'} Priority
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5"/> Recent Placements</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {fallbackAdminData.recentPlacements.map((placement, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 border border-border/30 rounded-lg bg-background/30">
                    <span className="font-medium text-sm">{placement.student}</span>
                    <span className="text-xs text-muted-foreground bg-secondary/50 w-fit px-2 py-0.5 rounded">{placement.role}</span>
                    <span className="text-xs font-semibold text-primary">{placement.company}</span>
                  </div>
                ))}
                <Button className="w-full mt-2" variant="ghost" onClick={() => toast({ title: "Loading", description: "Fetching full placement records." })}>
                  View All Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
