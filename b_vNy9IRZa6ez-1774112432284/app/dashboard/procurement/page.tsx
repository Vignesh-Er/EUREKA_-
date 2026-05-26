"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { Wrench, CheckCircle2, XCircle, Clock, Zap, Target, Users } from 'lucide-react'

// Simulated Hardware Proposal System Data
const proposals = [
  {
    id: 'PRP-2026-89',
    student: 'Alex Chen',
    item: 'Xilinx KV260 Vision AI Starter Kit',
    cost: '$249.00',
    purpose: 'Required for real-time YOLOv8 object detection acceleration. The current PYNQ-Z2 boards in the AI lab lack the DSP slices needed for 30fps inference.',
    status: 'pending',
    aiScore: 92,
    beneficiaries: 120, // students in AI Hardware course
    relevance: 'High - Maps directly to ECE450 (Edge AI) syllabus update.',
    color: 'var(--chart-1)'
  },
  {
    id: 'PRP-2026-42',
    student: 'Sarah Jenkins',
    item: 'Fluke 87V Industrial Multimeter',
    cost: '$540.00',
    purpose: 'Replacing broken multimeters on Benchs 4 and 5 in the basic electronics lab. Current ones have blown fuses.',
    status: 'approved',
    aiScore: 88,
    beneficiaries: 400,
    relevance: 'Critical Infrastructure.',
    color: 'var(--eureka-success)'
  },
  {
    id: 'PRP-2026-12',
    student: 'David Kim',
    item: 'Alienware m18 R2 Gaming Laptop',
    cost: '$3,200.00',
    purpose: 'Need a powerful GPU for training personal machine learning models.',
    status: 'rejected',
    aiScore: 15,
    beneficiaries: 1,
    relevance: 'Low - Compute should be routed to university cloud clusters, not personal portable hardware.',
    color: 'var(--destructive)'
  }
]

export default function ProcurementPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Hardware Procurement Engine
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Students propose lab equipment. AI evaluates the request based on how many students benefit, 
            the relevance to current syllabi, and cost effectiveness. Admins approve with one click.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {proposals.map((prop) => (
          <Card key={prop.id} className="bg-card/40 border-border/50 backdrop-blur-md relative overflow-hidden group">
            
            {/* Status Background Indicator */}
            <div 
              className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-10 opacity-20 ${
                prop.status === 'approved' ? 'bg-eureka-success' :
                prop.status === 'rejected' ? 'bg-destructive' : 'bg-chart-1'
              }`} 
            />

            <CardHeader className="pb-3 md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="text-[10px] font-mono border-border/50 text-muted-foreground">
                    {prop.id}
                  </Badge>
                  {prop.status === 'pending' && <Badge className="bg-chart-1/20 text-chart-1 border border-chart-1/30"><Clock className="w-3 h-3 mr-1" /> Pending AI Review</Badge>}
                  {prop.status === 'approved' && <Badge className="bg-eureka-success/20 text-eureka-success border border-eureka-success/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved & Ordered</Badge>}
                  {prop.status === 'rejected' && <Badge className="bg-destructive/20 text-destructive border border-destructive/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                </div>
                <CardTitle className="text-xl mt-2">{prop.item}</CardTitle>
                <CardDescription>Requested by {prop.student} • Est. Cost: <span className="text-foreground font-medium">{prop.cost}</span></CardDescription>
              </div>

              {/* AI Score (Desktop) */}
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">AI Priority Score</span>
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-end gap-1">
                  <span className={`text-3xl font-bold ${prop.aiScore > 80 ? 'text-eureka-success' : prop.aiScore > 40 ? 'text-chart-1' : 'text-destructive'}`}>
                    {prop.aiScore}
                  </span>
                  <span className="text-muted-foreground mb-1">/ 100</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="bg-background/40 p-4 rounded-xl border border-border/50 mb-6">
                <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Student Justification</h4>
                <p className="text-sm text-foreground/90 leading-relaxed font-light">{prop.purpose}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-3 bg-secondary/20 rounded-lg border border-border/30">
                  <Users className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">Beneficiary Impact</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Affects approx. {prop.beneficiaries} active students this semester.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-secondary/20 rounded-lg border border-border/30">
                  <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">Syllabus Relevance</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">{prop.relevance}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            {prop.status === 'pending' && (
              <CardFooter className="pt-0 flex gap-3">
                  <Button className="bg-eureka-success/20 text-eureka-success hover:bg-eureka-success/30 border border-eureka-success/20" onClick={() => toast({ title: "Proposal Approved", description: "The purchase order has been routed to finance.", variant: "default" })}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Request
                  </Button>
                  <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => toast({ title: "Proposal Rejected", description: "Feedback will be requested from the applicant.", variant: "destructive" })}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </CardFooter>
            )}

          </Card>
        ))}
      </div>
    </div>
  )
}
