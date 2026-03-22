"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Compass, Cpu, Search, Sparkles, Network, Activity, ArrowRight, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// Discovery Week Lab Exploration Data
const labs = [
  {
    id: 'vlsi-lab',
    name: 'VLSI & Digital Design Lab',
    purpose: 'Explore chip design, FPGA prototyping, and ASIC verification.',
    projects: ['RISC-V Processor Core', 'CNN Hardware Accelerator', 'DSP Filter Pipeline'],
    industries: ['Semiconductors', 'AI Hardware', 'Automotive Electronics'],
    skills: ['Verilog/VHDL', 'Digital Logic', 'Computer Architecture'],
    courses: ['Digital Logic Design', 'Computer Architecture'],
    icon: Cpu,
    color: 'var(--accent-cyan)'
  },
  {
    id: 'ai-lab',
    name: 'Artificial Intelligence Lab',
    purpose: 'Build neural networks, train models, and deploy edge AI solutions.',
    projects: ['Real-time Object Detection', 'LLM Fine-tuning', 'Autonomous Navigation Agent'],
    industries: ['Autonomous Vehicles', 'Robotics', 'Software Tech'],
    skills: ['PyTorch/TensorFlow', 'Python', 'Machine Learning'],
    courses: ['Intro to AI', 'Machine Learning Fundamentals'],
    icon: Network,
    color: 'var(--accent-violet)'
  },
  {
    id: 'dsp-lab',
    name: 'Signal Processing Lab',
    purpose: 'Analyze physical signals, build radar systems, and process audio/video.',
    projects: ['Spectrum Analyzer', 'Active Noise Cancellation', 'Wireless Transceiver'],
    industries: ['Telecommunications', 'Defense & Aerospace', 'Consumer Audio'],
    skills: ['MATLAB/Python', 'Fourier Analysis', 'Filter Design'],
    courses: ['Signals and Systems', 'Digital Signal Processing'],
    icon: Activity,
    color: 'var(--accent-pink)'
  }
]

export default function DiscoveryLabPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & AI Recommendation Panel */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Discovery Week Lab Exploration
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Don&apos;t choose your specialization blindly. Explore what actually happens in out labs, 
            the real-world projects you&apos;ll build, and the industries they connect to.
          </p>
        </div>

        {/* AI Tracking & Recommendation Engine */}
        <Card className="bg-primary/5 border-primary/20 shrink-0 w-full md:w-80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-50">
            <Sparkles className="w-24 h-24 text-primary animate-pulse blur-xl" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Specialization Engine
            </CardTitle>
            <CardDescription>Based on your curiosity this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recommended Track</p>
              <p className="font-bold text-foreground">Edge AI Hardware + Embedded Systems</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Why?</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Strong engagement with Signal Processing</li>
                <li>High performance in digital logic puzzles</li>
                <li>Deep interest in AI accelerator projects</li>
              </ul>
            </div>
            <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20">
              Adopt this Track
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search labs, skills, or industries..." 
          className="pl-10 h-12 bg-card border-border/50 focus-visible:ring-primary/50 text-base rounded-xl"
        />
      </div>

      {/* Lab Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => {
          const Icon = lab.icon
          return (
            <Card key={lab.id} className="bg-card/40 border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl" 
                style={{ background: `radial-gradient(circle at center, ${lab.color}, transparent 70%)` }}
              />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `color-mix(in srgb, ${lab.color} 20%, transparent)` }}>
                  <Icon className="w-6 h-6" style={{ color: lab.color }} />
                </div>
                <CardTitle className="text-xl">{lab.name}</CardTitle>
                <CardDescription className="line-clamp-2">{lab.purpose}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> Real-World Projects
                  </p>
                  <ul className="text-sm space-y-1.5 text-foreground/80">
                    {lab.projects.map(p => <li key={p}>• {p}</li>)}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Industry Connections
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lab.industries.map(i => (
                      <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs font-normal border border-secondary">
                        {i}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Required Skills & Courses
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lab.skills.map(s => (
                      <Badge key={s} variant="outline" className="text-[10px] font-medium border-primary/20 text-primary/80 bg-primary/5">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-2 group/btn" variant="outline">
                  Enter Virtual Lab 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>

              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  )
}
