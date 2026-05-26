"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FlaskConical, DollarSign, Calendar, Target } from 'lucide-react'

// Mock Data
const grantData = [
  { title: "AI in Education Grant", agency: "National Science Foundation", amount: "$500,000", deadline: "Dec 1, 2026", relevance: 92 },
  { title: "Quantum Computing Lab", agency: "Department of Energy", amount: "$1,200,000", deadline: "Oct 15, 2026", relevance: 85 }
]

export default function ResearchGrantsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 border-b border-border/10 pb-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Research & Grants Intelligence
          </h1>
        </div>
        <p className="text-muted-foreground ml-11">AI-matched research funding opportunities and proposal tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grantData.map((grant, i) => (
          <Card key={i} className="bg-card/40 border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors group">
            <CardHeader className="pb-3 border-b border-border/10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{grant.agency}</Badge>
                <div className="flex items-center gap-1 text-sm font-medium text-eureka-success bg-eureka-success/10 px-2 py-1 rounded-md">
                  <Target className="w-3 h-3" /> {grant.relevance}% Match
                </div>
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {grant.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4"/> Expected Funding</p>
                <p className="text-lg font-bold">{grant.amount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4"/> Deadline</p>
                <p className="font-medium text-foreground">{grant.deadline}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
