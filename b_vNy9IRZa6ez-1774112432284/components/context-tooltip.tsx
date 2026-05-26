"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Briefcase, Factory } from "lucide-react"

interface ContextTooltipProps {
  children: React.ReactNode
  topic: string
  whyItExists: string
  applications: string[]
  companies: string[]
}

export function ContextTooltip({ children, topic, whyItExists, applications, companies }: ContextTooltipProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="font-medium text-emerald-400 border-b border-emerald-400/30 border-dashed cursor-help hover:text-emerald-300 hover:border-emerald-300 transition-colors">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 space-y-4 bg-background/95 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-900/20" sideOffset={8}>
        
        {/* Header */}
        <div className="flex items-start gap-2 border-b border-border/50 pb-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">{topic}</h4>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Context Engine Active</p>
          </div>
        </div>

        {/* Why it exists */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
             Why It Exists
          </h5>
          <p className="text-sm leading-relaxed text-foreground/80">
            {whyItExists}
          </p>
        </div>

        {/* Industry Applications & Companies */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
               <Factory className="w-3.5 h-3.5 text-chart-1" /> Uses
            </h5>
            <ul className="text-xs text-foreground/70 space-y-1 pl-4 list-disc marker:text-chart-1/50">
               {applications.slice(0, 2).map((app, i) => (
                 <li key={i}>{app}</li>
               ))}
            </ul>
          </div>
            
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
               <Briefcase className="w-3.5 h-3.5 text-chart-2" /> Hiring
            </h5>
            <div className="flex flex-wrap gap-1">
               {companies.slice(0, 3).map((comp, i) => (
                 <Badge key={i} variant="outline" className="text-[9px] px-1 py-0 border-chart-2/30 text-chart-2/90">
                   {comp}
                 </Badge>
               ))}
            </div>
          </div>
        </div>

      </HoverCardContent>
    </HoverCard>
  )
}
