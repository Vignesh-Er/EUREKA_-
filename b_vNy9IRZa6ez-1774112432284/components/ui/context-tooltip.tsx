"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BrainCircuit, ExternalLink } from "lucide-react"

interface ContextTooltipProps {
  children: React.ReactNode
  term: string
  definition?: string
  source?: string
  link?: string
}

export function ContextTooltip({ children, term, definition, source, link }: ContextTooltipProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center border-b border-primary/50 border-dashed cursor-help text-primary hover:bg-primary/10 transition-colors rounded-sm px-0.5">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="w-[300px] p-0 overflow-hidden border-primary/20 bg-card/95 backdrop-blur-md shadow-2xl">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 border-b border-white/5 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm text-foreground">{term}</h4>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {definition || `Loading definition for ${term} from Global Knowledge Graph...`}
            </p>
            {(source || link) && (
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="uppercase tracking-wider">{source || 'Knowledge Graph'}</span>
                {link && (
                  <a href={link} target="_blank" rel="noopener" className="flex items-center text-primary hover:underline">
                    Read more <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
