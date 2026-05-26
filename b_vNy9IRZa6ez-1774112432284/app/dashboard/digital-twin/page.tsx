"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, TrendingUp, AlertTriangle, Target, Zap, Shield, Microscope } from 'lucide-react'
import { ContextTooltip } from '@/components/ui/context-tooltip'

// Simulated Digital Twin Data
const digitalTwin = {
  cognitiveProfile: {
    visualLearning: 88,
    mathematicalAbstraction: 42,
    algorithmicThinking: 91,
    roteMemorization: 35, // Low is good here, heavily relies on conceptual
    systemsDesign: 85
  },
  knowledgeNodes: {
    strong: ['Digital Logic', 'Verilog', 'Neural Networks (CNNs)', 'FIR Filters'],
    developing: ['I2C/SPI Protocols', 'State Space Models'],
    weak: ['Laplace Transform', 'Continuous Time Fourier Transform', 'BJT Biasing']
  },
  predictions: [
    {
      subject: 'Control Systems',
      prediction: 'High Risk of Struggle',
      reason: 'Your mathematical abstraction score (42) and weakness in Laplace Transforms indicates a 85% probability of struggling with PID tuning theory.',
      action: 'Generating interactive visual-first modules for s-plane pole/zero movement.',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      subject: 'AI Hardware Accelerator Design',
      prediction: 'High Probability of Excellence',
      reason: 'Your strong combination of Verilog (92) and CNNs (88) perfectly aligns with this project.',
      action: 'Recommending fast-track advanced projects in the VLSI Lab.',
      color: 'text-eureka-success',
      bgColor: 'bg-eureka-success/10'
    }
  ]
}

export default function DigitalTwinPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              Student Digital Twin
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            A live, deeply modeled simulation of your knowledge state, cognitive patterns, and learning behavior. 
            Used to predict performance and hyper-personalize your education.
          </p>
        </div>
        <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 bg-primary/10 border-primary text-primary">
          <Zap className="w-3.5 h-3.5 mr-2" /> Live Sync Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cognitive Profile */}
        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Cognitive Profile
              </CardTitle>
              <CardDescription>How you naturally process information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/80">Visual Learning</span>
                  <span className="font-mono text-accent">{digitalTwin.cognitiveProfile.visualLearning}%</span>
                </div>
                <Progress value={digitalTwin.cognitiveProfile.visualLearning} className="h-1.5 bg-sidebar" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/80">Algorithmic Thinking</span>
                  <span className="font-mono text-chart-2">{digitalTwin.cognitiveProfile.algorithmicThinking}%</span>
                </div>
                <Progress value={digitalTwin.cognitiveProfile.algorithmicThinking} className="h-1.5 [&>div]:bg-chart-2 bg-chart-2/20" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/80">Systems Design</span>
                  <span className="font-mono text-primary">{digitalTwin.cognitiveProfile.systemsDesign}%</span>
                </div>
                <Progress value={digitalTwin.cognitiveProfile.systemsDesign} className="h-1.5 bg-primary/20" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/80">Mathematical Abstraction</span>
                  <span className="font-mono text-destructive">{digitalTwin.cognitiveProfile.mathematicalAbstraction}%</span>
                </div>
                <Progress value={digitalTwin.cognitiveProfile.mathematicalAbstraction} className="h-1.5 [&>div]:bg-destructive bg-destructive/20" />
              </div>

            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-chart-1" /> Career Suitability
              </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 Based on your strengths in <span className="text-foreground font-medium">Algorithmic Thinking</span> and <span className="text-foreground font-medium">Systems Design</span>, 
                 while struggling with raw mathematics, your twin predicts high success in:
               </p>
               <ul className="mt-4 space-y-2">
                 <li className="text-sm bg-chart-1/10 text-chart-1 px-3 py-2 rounded-md border border-chart-1/20 font-medium">1. FPGA-based AI Acceleration</li>
                 <li className="text-sm bg-chart-1/10 text-chart-1 px-3 py-2 rounded-md border border-chart-1/20 font-medium">2. Embedded Systems Architect</li>
                 <li className="text-sm text-muted-foreground px-3 py-2">3. Digital Logic Verification</li>
               </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Predictions & Knowledge State (2/3 width) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" /> Predictive Learning Engine
          </h2>
          
          {/* Predictive Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {digitalTwin.predictions.map((pred, i) => (
              <Card key={i} className={`bg-card/40 border border-border/50 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${pred.bgColor.replace('/10', '')}`} />
                <CardHeader className="pb-2">
                  <Badge variant="outline" className={`w-fit mb-2 border-transparent ${pred.bgColor} ${pred.color}`}>
                    {pred.prediction}
                  </Badge>
                  <CardTitle className="text-lg">{pred.subject}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-border/50 pl-3">
                    {pred.reason}
                  </p>
                  <div className="bg-background/50 p-3 rounded-lg border border-border/50 flex items-start gap-3">
                    <Zap className={`w-4 h-4 mt-0.5 shrink-0 ${pred.color}`} />
                    <p className="text-xs font-medium text-muted-foreground">Action Taken: <span className="text-foreground/80">{pred.action}</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 mt-8">
            <Microscope className="w-5 h-5 text-chart-5" /> Live Knowledge Map State
          </h2>

          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="space-y-6">
                
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Mastered Nodes (Deep Understanding)</h4>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwin.knowledgeNodes.strong.map(node => (
                      <Badge key={node} variant="outline" className="bg-eureka-success/10 text-eureka-success font-normal border-eureka-success/20 py-1">{node}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Developing Nodes (Syntax Heavy)</h4>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwin.knowledgeNodes.developing.map(node => (
                      <Badge key={node} variant="outline" className="bg-eureka-warning/10 text-eureka-warning font-normal border-eureka-warning/20 py-1">{node}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {digitalTwin.knowledgeNodes.weak.map(node => (
                      <Badge key={node} variant="outline" className="bg-destructive/10 text-destructive font-normal border-destructive/20 py-1 px-3 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> 
                        <ContextTooltip 
                          term={node} 
                          definition={`AI has detected a 45% conceptual gap in ${node}. Expanding this node connects to 3 upcoming assignments.`}
                        >
                          {node}
                        </ContextTooltip>
                      </Badge>
                    ))}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
