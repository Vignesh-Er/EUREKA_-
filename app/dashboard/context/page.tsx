"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Factory, Microchip, Briefcase, Zap, AlertCircle } from 'lucide-react'

// Curriculum Context Engine Data
const contextCards = [
  {
    topic: 'Fourier Transform',
    course: 'Signals & Systems',
    whyItExists: 'To convert complex signals from the time domain (what you see on an oscilloscope) into the frequency domain (the exact frequencies making up the signal). Without this, analyzing complex data like audio or radar is nearly impossible.',
    applications: ['Radar Systems target tracking', 'Image Compression (JPEG)', 'Wireless Communication (OFDM)', 'Audio Processing & Noise Cancellation'],
    labConnection: {
      lab: 'Signal Processing Lab',
      experiment: 'Spectrum Analysis of Filtered Waves'
    },
    companiesHiring: ['Qualcomm', 'Lockheed Martin', 'Apple (Audio Dept)', 'Ericsson'],
    status: 'learning-now',
    color: 'var(--accent-cyan)'
  },
  {
    topic: 'PID Controllers',
    course: 'Control Systems',
    whyItExists: 'To continuously calculate a mathematical error value as the difference between a desired setpoint and a measured process variable and apply a correction. It is the gold standard for maintaining exact physical states.',
    applications: ['Drone/Quadcopter stabilization', 'Industrial temperature control', 'Cruise control in vehicles', 'Robotic arm positioning'],
    labConnection: {
      lab: 'Automation & Control Lab',
      experiment: 'Inverted Pendulum Stabilization'
    },
    companiesHiring: ['Tesla', 'Boston Dynamics', 'Siemens', 'Honeywell'],
    status: 'upcoming',
    color: 'var(--accent-violet)'
  },
  {
    topic: 'Laplace Transform',
    course: 'Engineering Mathematics',
    whyItExists: 'Translates difficult differential equations in the time domain into simple algebraic equations in the complex frequency domain (s-domain), allowing engineers to analyze system stability.',
    applications: ['Circuit analysis (RLC)', 'Mechanical vibration damping', 'Process control engineering'],
    labConnection: {
      lab: 'Systems Simulation Lab',
      experiment: 'Transient Response Modeling'
    },
    companiesHiring: ['Texas Instruments', 'NASA', 'General Electric'],
    status: 'struggling',
    color: 'var(--accent-pink)'
  }
]

export default function ContextCardsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
            Curriculum Context Cards
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl">
          The &quot;Why Does This Exist&quot; layer. Never memorize a theory without understanding 
          exactly where it&apos;s used in the real world and which companies pay you to know it.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contextCards.map((card, i) => (
          <Card key={i} className="bg-card/40 border-border/50 backdrop-blur-md flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="pb-3 border-b border-border/10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                  {card.course}
                </Badge>
                {card.status === 'learning-now' ? (
                  <Badge variant="secondary" className="bg-chart-1/10 text-chart-1 text-[10px]"><Zap className="w-3 h-3 mr-1" /> Active</Badge>
                ) : card.status === 'struggling' ? (
                  <Badge variant="destructive" className="bg-destructive/10 border-destructive text-destructive text-[10px]"><AlertCircle className="w-3 h-3 mr-1" /> Weak Concept</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-[10px]">Upcoming</Badge>
                )}
              </div>
              <CardTitle className="text-2xl" style={{ color: card.color }}>{card.topic}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4 space-y-6 flex-1">
              {/* Why it exists */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent" /> Why It Exists
                </h4>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {card.whyItExists}
                </p>
              </div>

              {/* Industry Applications */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Factory className="w-4 h-4 text-chart-1" /> Industry Applications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {card.applications.map(app => (
                    <Badge key={app} variant="secondary" className="bg-chart-1/5 text-xs text-foreground/70 font-normal">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Lab Connection */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Microchip className="w-4 h-4 text-chart-5" /> Campus Lab Demo
                </h4>
                <div className="bg-chart-5/5 border border-chart-5/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-chart-5">{card.labConnection.lab}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Exp: {card.labConnection.experiment}</p>
                </div>
              </div>

              {/* Companies Hiring */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-chart-2" /> Hiring Companies
                </h4>
                <p className="text-sm text-chart-2/80">
                  {card.companiesHiring.join(', ')}
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-0 border-t border-border/10">
              <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10">
                Explore Full Topic Tree
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
