"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Wrench, TrendingUp, AlertTriangle } from 'lucide-react'

// Mock Data
const toolData = [
  { tool: 'MATLAB', category: 'Simulation', utilization: 85, cost: '$50k', roi: 'High' },
  { tool: 'AutoCAD', category: 'Design', utilization: 30, cost: '$35k', roi: 'Low' },
  { tool: 'SolidWorks', category: 'Design', utilization: 75, cost: '$45k', roi: 'Medium' }
]

export default function ToolUtilizationPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b border-border/10 pb-6">
        <Wrench className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Tool Utilization & ROI
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {toolData.map((tool, i) => (
          <Card key={i} className={`bg-card/40 border-border/50 backdrop-blur-md`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">{tool.category}</span>
                {tool.roi === 'Low' && <AlertTriangle className="w-4 h-4 text-destructive" />}
              </div>
              <CardTitle className="text-xl mt-2">{tool.tool}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className={tool.utilization < 50 ? 'text-destructive' : 'text-eureka-success'}>{tool.utilization}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${tool.utilization < 50 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${tool.utilization}%` }} />
                </div>
              </div>
              <div className="flex justify-between py-3 border-t border-border/10">
                <span className="text-sm text-muted-foreground">Annual Cost</span>
                <span className="font-mono">{tool.cost}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
