"use client"

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Users, Clock, Languages, ArrowRight, PlayCircle, BarChart3, PlusCircle } from 'lucide-react'
import { ContextTooltip } from '@/components/context-tooltip'

// --- Context Engine Knowledge ---
const topicContext: Record<string, { whyItExists: string; applications: string[]; companies: string[] }> = {
  'Neural Network Architectures': {
    whyItExists: 'To mathematically model how the human brain processes information, enabling machines to learn complex patterns without explicit programming.',
    applications: ['Computer Vision', 'NLP', 'Self-driving Cars'],
    companies: ['OpenAI', 'Google DeepMind', 'Tesla']
  },
  'Sequential Circuits: FSMs': {
    whyItExists: 'Because combinational logic has no memory. FSMs allow hardware to remember past states, making complex operations like processors and traffic lights possible.',
    applications: ['CPU Control Units', 'Vending Machines', 'Network Protocols'],
    companies: ['Intel', 'AMD', 'NVIDIA']
  },
  'Bode Plots & Stability': {
    whyItExists: 'To determine if a system will safely reach its target or wildly spin out of control when subjected to varying frequencies of input.',
    applications: ['Audio Amplifiers', 'Flight Control', 'Power Supplies'],
    companies: ['SpaceX', 'Sony', 'Texas Instruments']
  }
}

// --- Student Data ---
const studentCourses = [
  {
    id: 'CS401',
    name: 'Intro to Artificial Intelligence',
    professor: 'Dr. Sarah Jenkins',
    progress: 75,
    nextLecture: 'Neural Network Architectures',
    time: 'Tomorrow, 10:00 AM',
    translatedNotesStatus: 'translated to Español',
    color: 'var(--accent-violet)'
  },
  {
    id: 'EC302',
    name: 'Digital Logic Design',
    professor: 'Dr. Alan Oppenheim',
    progress: 40,
    nextLecture: 'Sequential Circuits: FSMs',
    time: 'Today, 2:00 PM',
    translatedNotesStatus: 'translated to Español',
    color: 'var(--chart-1)'
  },
  {
    id: 'EE450',
    name: 'Signals & Systems',
    professor: 'Dr. Michael Chang',
    progress: 92,
    nextLecture: 'Bode Plots & Stability',
    time: 'Friday, 1:00 PM',
    translatedNotesStatus: 'translated to Español',
    color: 'var(--accent-cyan)'
  }
]

// --- Professor Data ---
const professorCourses = [
  {
    id: 'CS401',
    name: 'Intro to Artificial Intelligence',
    students: 142,
    engagement: 88,
    lastUpload: '2 hours ago',
    originalLang: 'English',
    color: 'var(--accent-violet)'
  },
  {
    id: 'CS502',
    name: 'Advanced Machine Learning',
    students: 45,
    engagement: 94,
    lastUpload: 'Yesterday',
    originalLang: 'English',
    color: 'var(--chart-5)'
  }
]

export default function CoursesPage() {
  const { user } = useAuth()
  const isStudent = user?.role === 'student'

  // ---------------- STUDENT VIEW ----------------
  if (isStudent) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-2 border-b border-border/10 pb-6">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              My Active Enrolments
            </h1>
            <p className="text-muted-foreground text-lg mt-1">Track your progress and access translated study materials.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {studentCourses.map(course => (
            <Card key={course.id} className="bg-card/40 border-border/50 backdrop-blur-md hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-3 border-b border-border/10">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-border/50 text-muted-foreground font-mono">{course.id}</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                    <Clock className="w-3 h-3 mr-1 inline" /> {course.time}
                  </Badge>
                </div>
                <CardTitle className="text-xl" style={{ color: course.color }}>{course.name}</CardTitle>
                <CardDescription>Taught by {course.professor}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/80 font-medium">Syllabus Completion</span>
                    <span className="font-mono text-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5 bg-background/50" indicatorColor={course.color} />
                </div>

                <div className="bg-background/40 p-3 rounded-lg border border-border/50 flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 flex-wrap">
                    Up Next: 
                    <ContextTooltip 
                      topic={course.nextLecture}
                      whyItExists={topicContext[course.nextLecture]?.whyItExists || 'Essential curriculum topic.'}
                      applications={topicContext[course.nextLecture]?.applications || []}
                      companies={topicContext[course.nextLecture]?.companies || []}
                    >
                      {course.nextLecture}
                    </ContextTooltip>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Languages className="w-4 h-4 text-accent" />
                    Lecture materials automatically {course.translatedNotesStatus} based on your global settings.
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-3">
                <Button className="flex-1 bg-primary/20 text-primary hover:bg-primary/30" onClick={() => toast({ title: "Virtual Class", description: `Joining ${course.title} environment...` })}>
                  <PlayCircle className="w-4 h-4 mr-2" /> Enter Virtual Class
                </Button>
                <Button variant="outline" className="flex-1 border-border/50" onClick={() => toast({ title: "Materials Reqs", description: "Loading synced course documents & slides..." })}>
                  Notes & Materials
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // ---------------- PROFESSOR VIEW ----------------
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Course Management Hub
            </h1>
            <p className="text-muted-foreground text-lg mt-1">Monitor engagement and broadcast knowledge globally.</p>
          </div>
        </div>
        <Button className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20" onClick={() => toast({ title: "New Course Builder", description: "Opening the AI Syllabus generation tool..." })}>
          <PlusCircle className="w-4 h-4 mr-2" /> Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {professorCourses.map(course => (
          <Card key={course.id} className="bg-card/40 border-border/50 backdrop-blur-md hover:border-border transition-all duration-300">
            <CardHeader className="pb-3 border-b border-border/10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="border-border/50 text-muted-foreground font-mono">{course.id}</Badge>
              </div>
              <CardTitle className="text-xl" style={{ color: course.color }}>{course.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/40 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center">
                  <Users className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-2xl font-bold text-foreground">{course.students}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Enrolled</span>
                </div>
                <div className="bg-background/40 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center">
                  <BarChart3 className={`w-6 h-6 mb-2 ${course.engagement > 90 ? 'text-eureka-success' : 'text-chart-1'}`} />
                  <span className="text-2xl font-bold text-foreground">{course.engagement}%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Engagement</span>
                </div>
              </div>

              <div className="bg-secondary/20 p-3 rounded-lg border border-border/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Last Knowledge Broadcast</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.lastUpload}</p>
                </div>
                <Badge variant="outline" className="text-[10px]"><Languages className="w-3 h-3 mr-1 inline" /> Orig: {course.originalLang}</Badge>
              </div>

            </CardContent>
            <CardFooter className="pt-0 border-t border-border/10 mt-4">
                <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10" onClick={() => toast({ title: "Course Dashboard", description: "Redirecting to detailed syllabus and cohort view..." })}>
                Manage Syllabus & Cohort <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
