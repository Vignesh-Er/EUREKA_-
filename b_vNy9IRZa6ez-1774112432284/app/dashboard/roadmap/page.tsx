"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Map, Target, BookOpen, Code, Briefcase, Zap, CheckCircle2, Circle } from 'lucide-react'

const roadmapData = {
  currentFocus: "Edge AI Hardware + Embedded Systems",
  progress: 45,
  pillars: [
    {
      title: "Core Courses",
      icon: BookOpen,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      items: [
        { name: "Signals and Systems", status: "completed" },
        { name: "Control Systems", status: "in-progress" },
        { name: "VLSI Design", status: "upcoming" }
      ]
    },
    {
      title: "Industry Skills",
      icon: Code,
      color: "text-accent",
      bgColor: "bg-accent/10",
      items: [
        { name: "Verilog / SystemVerilog", status: "in-progress" },
        { name: "FPGA Development", status: "upcoming" },
        { name: "Machine Learning Fundamentals", status: "completed" }
      ]
    },
    {
      title: "Projects",
      icon: Zap,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      items: [
        { name: "RISC-V Implementation", status: "upcoming" },
        { name: "CNN Hardware Accelerator", status: "upcoming" },
        { name: "DSP Beamforming", status: "completed" }
      ]
    },
    {
      title: "Career Pathways",
      icon: Briefcase,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      items: [
        { name: "Semiconductor Industry", status: "target" },
        { name: "Robotics Companies", status: "target" },
        { name: "AI Hardware Startups", status: "target" }
      ]
    }
  ]
}

export default function RoadmapPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Personalized AI Learning Journey
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your customized academic roadmap designed to balance university syllabus, industry skill requirements, 
            research opportunities, and your personal interests.
          </p>
        </div>
        
        {/* Track Progress Card */}
        <Card className="bg-card/40 border-primary/20 shrink-0 w-full md:w-80 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              Current Track Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-bold text-foreground text-lg leading-tight">
              {roadmapData.currentFocus}
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Track Mastery</span>
                <span className="font-medium text-primary">{roadmapData.progress}%</span>
              </div>
              <Progress value={roadmapData.progress} className="h-2 bg-primary/10" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roadmapData.pillars.map((pillar) => {
          const Icon = pillar.icon
          return (
            <Card key={pillar.title} className="bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group hover:border-border transition-colors">
              <div className={`absolute top-0 right-0 w-32 h-32 ${pillar.bgColor} rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110 duration-500`} />
              
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${pillar.bgColor} ${pillar.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative z-10">
                  {pillar.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {item.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-eureka-success" />
                        ) : item.status === 'in-progress' ? (
                          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        ) : item.status === 'target' ? (
                          <Target className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-sm font-medium leading-tight ${item.status === 'completed' ? 'text-muted-foreground line-through decoration-muted-foreground/30' : 'text-foreground/90'}`}>
                          {item.name}
                        </p>
                        <Badge 
                          variant={item.status === 'target' ? 'outline' : 'secondary'} 
                          className={`text-[10px] px-1.5 py-0 capitalize ${
                            item.status === 'completed' ? 'bg-eureka-success/10 text-eureka-success' :
                            item.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                            item.status === 'target' ? 'border-border text-muted-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Visual Connection Line SVG (Desktop only abstract viz) */}
      <div className="hidden lg:block w-full h-24 relative opacity-40 mix-blend-screen pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path d="M 12.5% 10 C 25% 60, 37.5% -40, 37.5% 10 C 50% 60, 62.5% -40, 62.5% 10 C 75% 60, 87.5% -40, 87.5% 10" 
                fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeDasharray="4 4" />
          {/* Nodes */}
          <circle cx="12.5%" cy="10" r="4" className="fill-chart-1" />
          <circle cx="37.5%" cy="10" r="4" className="fill-accent" />
          <circle cx="62.5%" cy="10" r="4" className="fill-chart-5" />
          <circle cx="87.5%" cy="10" r="4" className="fill-chart-2" />
        </svg>
      </div>

    </div>
  )
}
