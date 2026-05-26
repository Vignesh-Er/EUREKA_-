"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { GraduationCap, Briefcase, Calendar, MessageSquare } from 'lucide-react'

// Mock Data
const alumniData = [
  { name: "Sarah Connor", gradYear: "2018", company: "OpenAI", role: "Senior Researcher", availability: "High" },
  { name: "John Smith", gradYear: "2020", company: "Microsoft", role: "Software Engineer II", availability: "Medium" },
  { name: "Emily Chen", gradYear: "2015", company: "Tesla", role: "Robotics Lead", availability: "Low" }
]

export default function AlumniPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 border-b border-border/10 pb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Alumni Network & Mentorship
          </h1>
        </div>
        <p className="text-muted-foreground ml-11">Engage with alumni for student mentorship and industry networking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniData.map((alumnus, i) => (
          <Card key={i} className="bg-card/40 border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors group">
            <CardHeader className="pb-3 border-b border-border/10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex gap-1 items-center">
                  <Calendar className="w-3 h-3"/> Class of {alumnus.gradYear}
                </Badge>
                <div className={`text-xs px-2 py-1 rounded-md border ${alumnus.availability === 'High' ? 'bg-eureka-success/10 text-eureka-success border-eureka-success/20' : alumnus.availability === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-muted/10 text-muted-foreground border-border'}`}>
                  {alumnus.availability} Availability
                </div>
              </div>
              <CardTitle className="text-xl">
                {alumnus.name}
              </CardTitle>
              <CardDescription className="text-base font-medium text-foreground flex flex-col gap-1 mt-2">
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-muted-foreground" /> {alumnus.role}</span>
                <span className="text-sm text-muted-foreground">@ {alumnus.company}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <button disabled={alumnus.availability === 'Low'} onClick={() => toast({ title: "Inquiry Sent", description: `Mentorship request sent to ${alumnus.name} successfully.` })} className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <MessageSquare className="w-4 h-4"/> Request Mentorship
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
