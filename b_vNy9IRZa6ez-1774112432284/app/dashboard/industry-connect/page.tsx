"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Briefcase, Star, ArrowRight } from 'lucide-react'

// Mock Data
const industryData = [
  { company: "Tesla", role: "AI Intern", matchScore: 95, type: "Internship" },
  { company: "Google", role: "Data Engineer", matchScore: 88, type: "Full-time" },
  { company: "LocalTech", role: "Backend Dev", matchScore: 75, type: "Project" }
]

export default function IndustryConnectPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 border-b border-border/10 pb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Industry Connect
          </h1>
        </div>
        <p className="text-muted-foreground ml-11">AI-matched corporate opportunities based on institutional curriculum & student skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industryData.map((opp, i) => (
          <Card key={i} className="bg-card/40 border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors group cursor-pointer">
            <CardHeader className="pb-3 border-b border-border/10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{opp.type}</Badge>
                <div className="flex items-center gap-1 text-sm font-medium text-eureka-success bg-eureka-success/10 px-2 py-1 rounded-md">
                  <Star className="w-3 h-3 fill-current" /> {opp.matchScore}% Match
                </div>
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {opp.company}
              </CardTitle>
              <CardDescription className="text-base font-medium text-foreground flex items-center gap-2 mt-1">
                <Briefcase className="w-4 h-4 text-muted-foreground" /> {opp.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                View Opportunity Details <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
