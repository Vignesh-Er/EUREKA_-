"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building, TrendingUp, DollarSign, Download, Landmark, Target, Award, ShieldCheck, Activity, Briefcase } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'
import { toast } from '@/hooks/use-toast'

const placementTrend = [
  { year: '2021', rate: 72 },
  { year: '2022', rate: 78 },
  { year: '2023', rate: 84 },
  { year: '2024', rate: 89 },
]

const deptPerformance = [
  { name: 'CS', coAttainment: 88, placement: 94 },
  { name: 'ECE', coAttainment: 82, placement: 85 },
  { name: 'ME', coAttainment: 75, placement: 78 },
  { name: 'EE', coAttainment: 79, placement: 81 },
]

export default function ExecutiveDashboard() {
  const handlePdfExport = () => {
    toast({
      title: "Generating Executive Report",
      description: "Compiling institutional data into PDF formulation...",
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Landmark className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Institutional Command Overview
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time executive summary of accreditation validity, financial ROI, and academic health for the board of directors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm"><Activity className="w-4 h-4 mr-2" /> Live Data Sync</Badge>
          <Button onClick={handlePdfExport} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 font-medium text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all group">
            <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" /> Generate NBA Report (PDF)
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-white/5 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-xs">
              Overall Placement Rate
              <TrendingUp className="w-4 h-4 text-eureka-success" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground mt-1">89.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground"><span className="text-eureka-success">+5.2%</span> vs last year</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-xs">
              Average CTC (LPA)
              <DollarSign className="w-4 h-4 text-chart-2" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground mt-1">₹8.4 L</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground"><span className="text-eureka-success">+₹1.2 L</span> vs last year</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex justify-between items-center text-xs">
              Software Tool ROI
              <Target className="w-4 h-4 text-chart-1" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground mt-1">225%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground text-destructive">₹12.4L unused licenses identified</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border border-primary/20 backdrop-blur-md relative overflow-hidden group hover:bg-primary/10 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl z-0" />
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="flex justify-between items-center text-xs text-primary/80">
              NBA Accreditation
              <ShieldCheck className="w-4 h-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-primary mt-1 flex items-center gap-2">
              Valid <Badge className="bg-primary text-white border-transparent text-[10px] hidden group-hover:block transition-all">A+ Grade</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-xs text-primary/60">Renewal due in 18 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placement Trajectory */}
        <Card className="bg-card/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="w-5 h-5 text-accent"/> Employment Trajectory</CardTitle>
            <CardDescription>4-year historical placement percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={placementTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department vs Attainment */}
        <Card className="bg-card/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Award className="w-5 h-5 text-chart-1"/> Departmental Readiness</CardTitle>
            <CardDescription>Academic Attainment vs Placement Readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="coAttainment" name="Academic Attainment" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placement" name="Placement Readiness" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-white/5 text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-chart-5" />
              CS Department is currently outperforming expected placement capacity.
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
