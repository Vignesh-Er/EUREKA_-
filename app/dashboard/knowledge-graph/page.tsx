"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, Laptop, Factory, Briefcase, ChevronRight, Zap } from 'lucide-react'

// Simulated Knowledge Graph paths
const graphPaths = [
  {
    concept: "Fourier Transform",
    domain: "Signal Processing",
    application: "Radar Systems",
    career: "Defense Industry",
    color: "var(--accent-cyan)",
    icon: Network,
    status: "Mastered"
  },
  {
    concept: "Verilog / HDL",
    domain: "Digital Logic Design",
    application: "Hardware Acceleration",
    career: "AI Semiconductor Engineering",
    color: "var(--chart-1)",
    icon: Laptop,
    status: "Developing"
  },
  {
    concept: "PID Tuning",
    domain: "Control Systems",
    application: "Automotive Cruise Control",
    career: "Autonomous Vehicles",
    color: "var(--accent-violet)",
    icon: Factory,
    status: "Weak"
  }
]

export default function KnowledgeGraphPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[80vh]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Network className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Global Knowledge Graph
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            See exactly how mathematical concepts map to campus labs, real-world applications, and high-paying careers. 
            The graph calculates the shortest path from what you are learning today to where you want to be tomorrow.
          </p>
        </div>
        <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-primary/10 border-primary text-primary">
          <Zap className="w-3.5 h-3.5 mr-2" /> Graph Synced
        </Badge>
      </div>

      {/* Visual Graph Representation */}
      <div className="space-y-12 py-8 relative">
        
        {/* Background connecting line */}
        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border/50 -z-10 hidden md:block" />

        {graphPaths.map((path, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-6 relative">
            
            {/* Concept Node */}
            <Card className="w-full md:w-1/3 bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group hover:border-border transition-colors z-10">
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl" 
                style={{ background: `radial-gradient(circle at center, ${path.color}, transparent 70%)` }}
              />
              <CardHeader className="pb-3 text-center">
                <Badge 
                  variant="outline" 
                  className={`mx-auto mb-2 text-[10px] uppercase tracking-wider ${
                    path.status === 'Mastered' ? 'border-eureka-success/50 text-eureka-success bg-eureka-success/10' :
                    path.status === 'Developing' ? 'border-chart-1/50 text-chart-1 bg-chart-1/10' :
                    'border-destructive/50 text-destructive bg-destructive/10'
                  }`}
                >
                  {path.status}
                </Badge>
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 shadow-lg" style={{ backgroundColor: `color-mix(in srgb, ${path.color} 20%, transparent)` }}>
                  <path.icon className="w-6 h-6" style={{ color: path.color }} />
                </div>
                <CardTitle className="text-xl" style={{ color: path.color }}>{path.concept}</CardTitle>
                <CardDescription>Academic Concept</CardDescription>
              </CardHeader>
            </Card>

            {/* Connecting Arrow (Desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center w-12 text-muted-foreground z-10 bg-background rounded-full p-2 border border-border/50 shadow-sm">
              <ChevronRight className="w-6 h-6" />
            </div>
            
            <div className="md:hidden flex flex-col items-center justify-center h-8 text-muted-foreground">
              <div className="w-0.5 h-full bg-border/50" />
            </div>

            {/* Domain & Application Node */}
            <Card className="w-full md:w-1/3 bg-card/40 border-border/50 backdrop-blur-md z-10">
              <CardContent className="p-6 text-center space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Campus Lab Domain</p>
                  <p className="font-medium text-foreground">{path.domain}</p>
                </div>
                <div className="w-full h-px bg-border/50 max-w-[100px] mx-auto" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Industry Application</p>
                  <p className="font-medium text-foreground">{path.application}</p>
                </div>
              </CardContent>
            </Card>

            {/* Connecting Arrow (Desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center w-12 text-muted-foreground z-10 bg-background rounded-full p-2 border border-border/50 shadow-sm">
              <ChevronRight className="w-6 h-6" />
            </div>

            <div className="md:hidden flex flex-col items-center justify-center h-8 text-muted-foreground">
              <div className="w-0.5 h-full bg-border/50" />
            </div>

            {/* Career Node */}
            <Card className="w-full md:w-1/3 bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group hover:border-border transition-colors z-10">
              <CardHeader className="pb-3 text-center">
                <div className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-2 bg-primary/10 shadow-lg">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{path.career}</CardTitle>
                <CardDescription>Target Industry</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="w-full justify-center bg-primary/5 text-primary border border-primary/20">
                  Matches Tracking Profile
                </Badge>
              </CardContent>
            </Card>

          </div>
        ))}

      </div>
    </div>
  )
}
