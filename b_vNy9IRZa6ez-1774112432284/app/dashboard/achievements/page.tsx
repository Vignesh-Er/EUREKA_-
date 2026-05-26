"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Medal, Hexagon, Star, Flame, Zap, BrainCircuit, Rocket } from 'lucide-react'

const achievements = [
  {
    id: 1,
    title: "Knowledge Graph Pioneer",
    description: "Mapped 50+ concepts across 3 different engineering domains.",
    icon: NetworkIcon,
    color: "var(--accent-cyan)",
    date: "Achieved Oct 12, 2026",
    rarity: "Epic"
  },
  {
    id: 2,
    title: "Algorithmic Thinker",
    description: "Passed 10 consecutive micro-tests without syntax hints.",
    icon: BrainCircuit,
    color: "var(--accent-violet)",
    date: "Achieved Sep 28, 2026",
    rarity: "Rare"
  },
  {
    id: 3,
    title: "Lab Virtuoso",
    description: "Explored all Discovery Week virtual lab environments.",
    icon: Rocket,
    color: "var(--chart-1)",
    date: "Achieved Sep 05, 2026",
    rarity: "Uncommon"
  },
  {
    id: 4,
    title: "Polymath Scholar",
    description: "Maintained >85% mastery score across multiple disconnected syllabus tracks.",
    icon: Medal,
    color: "var(--chart-2)",
    date: "In Progress (82%)",
    rarity: "Legendary",
    locked: true
  }
]

// Just a custom icon wrapper for Network since we need 3 distinct shapes
function NetworkIcon({ className, style }: { className?: string, style?: any }) {
  return <Hexagon className={className} style={style} />
}

export default function AchievementsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Stats Strip */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Academic Milestones
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Education isn&apos;t just about grades. It&apos;s about building a unique cognitive profile. 
            Track your achievements across different dimensions of learning.
          </p>
        </div>

        <div className="flex gap-4 shrink-0">
          <Card className="bg-primary/5 border-primary/20 shrink-0 w-32 p-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20"><Flame className="w-12 h-12 text-eureka-streak" /></div>
            <CardContent className="p-4 flex flex-col items-center justify-center relative z-10 text-center">
              <span className="text-3xl font-bold text-eureka-streak">14</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Day Streak</span>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/5 border-accent/20 shrink-0 w-32 p-1 relative overflow-hidden hidden md:block">
            <div className="absolute top-0 right-0 opacity-20"><Zap className="w-12 h-12 text-accent" /></div>
            <CardContent className="p-4 flex flex-col items-center justify-center relative z-10 text-center">
              <span className="text-3xl font-bold text-accent">2.4k</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">XP Earned</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {achievements.map(ach => (
          <Card 
            key={ach.id} 
            className={`bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group transition-all duration-500 ${ach.locked ? 'opacity-60 grayscale hover:grayscale-0' : 'hover:-translate-y-2 hover:border-border'}`}
          >
            {/* Glowing Backdrop */}
            {!ach.locked && (
               <div 
                 className="absolute inset-0 opacity-10 blur-xl transition-opacity duration-500 group-hover:opacity-30" 
                 style={{ backgroundColor: ach.color }}
               />
            )}
            
            <CardHeader className="text-center pb-2 relative z-10">
              <div 
                className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 border shadow-2xl transition-transform duration-500 group-hover:scale-110 ${ach.locked ? 'bg-background border-border/50' : ''}`}
                style={!ach.locked ? { backgroundColor: `color-mix(in srgb, ${ach.color} 15%, transparent)`, borderColor: `color-mix(in srgb, ${ach.color} 40%, transparent)` } : {}}
              >
                <ach.icon 
                  className={`w-10 h-10 ${ach.locked ? 'text-muted-foreground' : 'drop-shadow-lg'}`} 
                  style={!ach.locked ? { color: ach.color } : {}} 
                />
              </div>
              
              <Badge 
                variant="outline" 
                className={`mx-auto mb-2 text-[10px] uppercase tracking-widest ${
                  ach.rarity === 'Legendary' ? 'border-chart-2/50 text-chart-2 bg-chart-2/10' :
                  ach.rarity === 'Epic' ? 'border-accent/50 text-accent bg-accent/10' :
                  ach.rarity === 'Rare' ? 'border-accent-violet/50 text-[#8B5CF6] bg-[#8B5CF6]/10' :
                  'border-muted-foreground/50 text-muted-foreground bg-muted/10'
                }`}
              >
                {ach.rarity}
              </Badge>
              
              <CardTitle className="text-lg leading-tight mt-1">{ach.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6 relative z-10">
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">{ach.description}</p>
              
              {!ach.locked ? (
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground bg-background/50 py-1.5 px-3 rounded-full border border-border/50 inline-flex">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  {ach.date}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{ach.date}</span>
                  <Progress value={82} className="h-1.5 w-2/3 bg-background/50" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
