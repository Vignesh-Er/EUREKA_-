"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, ThumbsUp, ThumbsDown, Filter, AlertTriangle, ShieldCheck } from 'lucide-react'

// Simulated Anonymous Feedback System Data
const feedbackData = {
  categories: [
    { name: 'Teaching Quality', count: 42, color: 'text-chart-1' },
    { name: 'Course Difficulty', count: 18, color: 'text-accent' },
    { name: 'Infrastructure', count: 6, color: 'text-destructive' }
  ],
  recentFeedback: [
    {
      id: 1,
      course: 'Digital Design',
      category: 'Teaching Quality',
      sentiment: 'positive',
      text: 'The visual explanation of Verilog assign statements using water pipes really helped me grasp the concept of continuous assignment.',
      date: '2 hours ago'
    },
    {
      id: 2,
      course: 'Signals & Systems',
      category: 'Course Difficulty',
      sentiment: 'negative',
      text: 'The homework on Fourier series was extremely long. It felt like tedious math calculation rather than testing conceptual understanding.',
      date: '1 day ago'
    },
    {
      id: 3,
      course: 'Robotics Lab',
      category: 'Infrastructure',
      sentiment: 'negative',
      text: 'Three of the five robotic arms in Lab B have broken servo motors on the base joint, making Group 4 unable to complete the kinematics project.',
      date: '2 days ago'
    }
  ]
}

export default function FeedbackPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Anonymous Student Feedback
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            AI-categorized insights from students. Submissions are strictly anonymous and limited to 500 words 
            to ensure actionable, high-signal feedback across teaching, difficulty, and infrastructure.
          </p>
        </div>
        
        <Card className="bg-primary/5 border-primary/20 shrink-0 p-1 hidden md:block">
          <CardContent className="p-3 flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-primary" />
             <div>
               <p className="text-xs font-medium text-primary uppercase tracking-wider">Privacy Engine Active</p>
               <p className="text-[10px] text-muted-foreground">Identifiers Stripped • AI Sanitized</p>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Analytics (1/4 width) */}
        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" /> AI Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {feedbackData.categories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <span className={`text-sm font-medium ${cat.color}`}>{cat.name}</span>
                  <Badge variant="secondary" className="bg-background border border-border/50 text-foreground">
                    {cat.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border border-destructive/20 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Critical Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                The AI has flagged the Robotics Lab infrastructure issue for immediate administrative review.
              </p>
              <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                Route to Procurement
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Feed (3/4 width) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Incoming Feed</h2>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="h-8 text-xs">All Courses</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Recent</Button>
            </div>
          </div>

          {feedbackData.recentFeedback.map((fb) => (
            <Card key={fb.id} className="bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group">
              <div 
                className={`absolute top-0 left-0 w-1 h-full ${
                  fb.sentiment === 'positive' ? 'bg-eureka-success' : 'bg-destructive'
                }`} 
              />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {fb.sentiment === 'positive' ? (
                      <div className="p-2 bg-eureka-success/10 rounded-full text-eureka-success shrink-0"><ThumbsUp className="w-4 h-4" /></div>
                    ) : (
                      <div className="p-2 bg-destructive/10 rounded-full text-destructive shrink-0"><ThumbsDown className="w-4 h-4" /></div>
                    )}
                    <div>
                      <Badge variant="outline" className="text-xs bg-background/50 border-border/50 mb-1 pointer-events-none">
                        {fb.course}
                      </Badge>
                      <br/>
                      <span className="text-xs text-muted-foreground">{fb.date}</span>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="w-fit pointer-events-none">
                    {fb.category}
                  </Badge>
                </div>
                
                <p className="text-foreground/90 leading-relaxed font-light text-base bg-background/30 p-4 rounded-xl border border-border/30">
                  {fb.text}
                </p>

              </CardContent>
            </Card>
          ))}
          
          <Button variant="ghost" className="w-full text-muted-foreground mt-4">
            Load Older Feedback
          </Button>

        </div>

      </div>
    </div>
  )
}
