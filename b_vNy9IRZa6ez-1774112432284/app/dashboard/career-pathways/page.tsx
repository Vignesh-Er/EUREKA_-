"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BrainCircuit, BookOpen, Target, Briefcase, TrendingUp, Sparkles, Map, ChevronRight, Building } from 'lucide-react'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

// Mock Data for Career Pathways
const careerPaths = [
  {
    id: "ai-hardware",
    name: "AI Hardware Accelerator Designer",
    salary: "$120k - $160k",
    demand: "High",
    matchScrore: 92,
    nodes: [
      { type: "course", name: "Digital Logic Design", status: "completed" },
      { type: "course", name: "Computer Architecture", status: "completed" },
      { type: "course", name: "VLSI Design", status: "in-progress" },
      { type: "skill", name: "Verilog / VHDL", status: "completed" },
      { type: "skill", name: "FPGA Prototyping", status: "in-progress" },
      { type: "job", name: "AI Silicon Engineer", companies: ["NVIDIA", "Google", "Apple"] }
    ]
  },
  {
    id: "embedded-systems",
    name: "Embedded Systems Architect",
    salary: "$95k - $140k",
    demand: "Very High",
    matchScrore: 85,
    nodes: [
      { type: "course", name: "Microprocessors", status: "completed" },
      { type: "course", name: "Control Systems", status: "in-progress" },
      { type: "course", name: "Real-Time OS", status: "planned" },
      { type: "skill", name: "C / C++", status: "completed" },
      { type: "skill", name: "FreeRTOS", status: "planned" },
      { type: "job", name: "Embedded Firmware Engineer", companies: ["Tesla", "Bosch", "SpaceX"] }
    ]
  },
  {
    id: "dsp-engineer",
    name: "DSP Systems Engineer",
    salary: "$105k - $150k",
    demand: "Medium",
    matchScrore: 72,
    nodes: [
      { type: "course", name: "Signals and Systems", status: "completed" },
      { type: "course", name: "Digital Signal Processing", status: "in-progress" },
      { type: "skill", name: "MATLAB", status: "completed" },
      { type: "skill", name: "Filter Design", status: "planned" },
      { type: "job", name: "Radar/Comm Engineer", companies: ["Qualcomm", "Lockheed Martin", "Ericsson"] }
    ]
  }
]

export default function CareerPathwaysPage() {
  const [selectedPath, setSelectedPath] = useState(careerPaths[0].id)
  const path = careerPaths.find(p => p.id === selectedPath)!

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Career Pathways Visualizer
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            See exactly how your current coursework maps to real-world skills, high-paying jobs, and target companies. Driven by the Global Knowledge Graph.
          </p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest px-3 py-1">
          <BrainCircuit className="w-4 h-4 mr-2" /> Graph Sync Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Path Selector */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Predicted Best Fits</h3>
          {careerPaths.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedPath(p.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedPath === p.id ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(168,85,247,0.15)] scale-105' : 'bg-card/40 border-border/50 hover:border-primary/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold ${selectedPath === p.id ? 'text-primary' : 'text-foreground'}`}>{p.name}</h4>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Target className="w-3 h-3 text-eureka-success"/> {p.matchScrore}% Match</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-chart-2"/> {p.demand} Demand</span>
              </div>
            </div>
          ))}
          
          <Card className="mt-8 bg-card/40 border border-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 opacity-50" />
            <CardContent className="p-4 relative z-10 space-y-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium">Want to pivot?</p>
              <p className="text-xs text-muted-foreground">Ask Eureka AI how to change your pathway to Software Engineering or Quant Finance.</p>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast({ title: "Opening Chatbot...", description: "Connecting to Eureka AI" })}>
                Ask Eureka AI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Visualization Graph */}
        <div className="col-span-1 lg:col-span-3">
          <Card className="border-border/50 bg-card/20 backdrop-blur-md h-full overflow-hidden">
            <CardHeader className="bg-card/40 border-b border-border/10">
              <CardTitle className="flex justify-between items-center">
                <span>Pathway: {path.name}</span>
                <Badge variant="secondary" className="bg-eureka-success/10 text-eureka-success text-sm font-mono border-eureka-success/20">
                  Avg Salary: {path.salary}
                </Badge>
              </CardTitle>
              <CardDescription>Follow the nodes from theory to employment</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              
              <div className="relative">
                {/* Visual Connector Line */}
                <div className="absolute top-8 left-[23px] bottom-12 w-0.5 bg-gradient-to-b from-primary via-accent to-eureka-success opacity-30" />
                
                <div className="space-y-12">
                  {/* COURSES SECTION */}
                  <div className="relative">
                    <div className="absolute -left-[5px] top-6 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10" />
                    <div className="pl-12">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                        <BookOpen className="w-4 h-4" /> Academic Foundation
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {path.nodes.filter(n => n.type === 'course').map((n, i) => (
                          <div key={i} className={`p-3 rounded-lg border ${n.status === 'completed' ? 'bg-primary/5 border-primary/20' : n.status === 'in-progress' ? 'bg-accent/5 border-accent/20' : 'bg-background/50 border-border/50'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-semibold">{n.name}</span>
                            </div>
                            <span className={`text-[10px] uppercase tracking-wide ${n.status === 'completed' ? 'text-primary' : n.status === 'in-progress' ? 'text-accent' : 'text-muted-foreground'}`}>{n.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SKILLS SECTION */}
                  <div className="relative">
                    <div className="absolute -left-[5px] top-6 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(14,165,233,0.5)] z-10" />
                    <div className="pl-12">
                      <h3 className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Target className="w-4 h-4" /> Hard Skills Unlocked
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {path.nodes.filter(n => n.type === 'skill').map((n, i) => (
                          <div key={i} className={`px-4 py-2 rounded-full border text-sm flex items-center gap-2 ${n.status === 'completed' ? 'bg-accent/10 border-accent/30 text-accent font-medium' : 'bg-background border-border/50 text-muted-foreground'}`}>
                            <BrainCircuit className="w-3.5 h-3.5" /> {n.name}
                          </div>
                        ))}
                      </div>
                      {path.nodes.filter(n => n.type === 'skill').some(n => n.status !== 'completed') && (
                        <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-white/5 text-sm text-muted-foreground flex items-start gap-2 max-w-lg">
                          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <p>You have missing skills for this role. Check your <strong>Smart Action Center</strong> for recommended mini-projects to close this gap.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* JOB SECTION */}
                  <div className="relative">
                    <div className="absolute -left-[5px] top-6 w-3 h-3 rounded-full bg-eureka-success shadow-[0_0_10px_rgba(34,197,94,0.5)] z-10" />
                    <div className="pl-12">
                      <h3 className="text-sm font-bold text-eureka-success uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Briefcase className="w-4 h-4" /> Career Destination
                      </h3>
                      <div className="p-6 rounded-xl bg-gradient-to-br from-eureka-success/10 to-transparent border border-eureka-success/30 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-5 h-5 text-eureka-success" />
                            <h2 className="text-xl font-bold text-foreground">{path.nodes.filter(n => n.type === 'job')[0].name}</h2>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                            <Building className="w-4 h-4" /> Top Hiring Partners:
                          </div>
                          <div className="flex gap-2 mt-2">
                            {path.nodes.filter(n => n.type === 'job')[0].companies?.map(c => (
                              <Badge key={c} variant="secondary" className="bg-background border-border">{c}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button className="bg-eureka-success text-white hover:bg-eureka-success/90 shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                          View Active Placements <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
