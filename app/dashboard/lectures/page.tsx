"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, FileText, Globe, PlayCircle, BookOpen, Link, Download, Volume2 } from 'lucide-react'
import { useState } from 'react'

const lectureData = {
  title: "Lecture 4: Analyzing LTI Systems in the Frequency Domain",
  course: "Signals and Systems",
  professor: "Dr. Alan Oppenheim",
  date: "Oct 12, 2026",
  languages: ['English', 'Spanish', 'Mandarin'],
  summary: "This lecture introduces the Continuous-Time Fourier Transform (CTFT) as a tool to analyze Linear Time-Invariant (LTI) systems. We proved that complex exponentials are eigenfunctions of LTI systems, meaning they pass through the system unchanged except for a complex scaling factor (magnitude and phase shift).",
  realWorld: [
    { name: "Audio Equalization", desc: "Adjusting bass/treble is simply scaling specific frequency bands of an audio signal." },
    { name: "4G/5G OFDM Modulation", desc: "Transmitting data across orthogonal subcarriers in the frequency domain to avoid interference." }
  ],
  labConnection: "Experiment 3: Building a Low-Pass Filter using RC circuits to physically observe high-frequency signal attenuation.",
  relatedTopics: [
    { id: 'laplace', name: 'Laplace Transform' },
    { id: 'bode', name: 'Bode Plots' },
    { id: 'ztran', name: 'Z-Transform (Discrete Time)' }
  ]
}

export default function LecturesPage() {
  const [lang, setLang] = useState('English')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
              AI Lecture Companion
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Missed a class? Didn&apos;t understand the professor? The AI Lecture Companion automatically summarizes 
            slides, maps formulas to reality, and translates knowledge globally.
          </p>
        </div>

        {/* Translation Engine Toggle */}
        <Card className="bg-primary/5 border-primary/20 shrink-0 w-full md:w-auto p-1">
          <CardContent className="p-2 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary px-2">
              <Globe className="w-4 h-4" /> Translate Note
            </div>
            <div className="flex bg-background/50 rounded-lg p-1">
              {lectureData.languages.map(l => (
                <Button 
                  key={l}
                  variant={lang === l ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`h-7 px-3 text-xs ${lang === l ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setLang(l)}
                >
                  {l}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="text-xs mb-2 border-primary/20 text-primary">
                {lectureData.course}
              </Badge>
              <h2 className="text-2xl font-bold text-foreground">
                {/* Translated title simulation */}
                {lang === 'Spanish' ? "Conferencia 4: Análisis de Sistemas LTI" : 
                 lang === 'Mandarin' ? "第4讲：频域中的LTI系统分析" : lectureData.title}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {lectureData.professor} • <Volume2 className="w-3 h-3 inline pb-0.5" /> AI Narrated Audio Available
              </p>
            </div>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="bg-card border border-border/50 h-10">
              <TabsTrigger value="summary" className="text-xs"><FileText className="w-3.5 h-3.5 mr-1.5" /> AI Summary</TabsTrigger>
              <TabsTrigger value="realworld" className="text-xs"><Globe className="w-3.5 h-3.5 mr-1.5" /> Real-World Sync</TabsTrigger>
              <TabsTrigger value="slides" className="text-xs"><PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Source Material</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <Card className="bg-card/40 border-border/50 backdrop-blur-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Simplified Explanation</h3>
                  <p className="text-foreground/80 leading-relaxed font-light text-lg">
                    {/* Simulated translation routing */}
                    {lang === 'Spanish' ? "Esta lección introduce la Transformada de Fourier..." : 
                     lang === 'Mandarin' ? "本讲介绍了连续时间傅里叶变换..." : lectureData.summary}
                  </p>
                  
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><BookOpen className="w-16 h-16 text-primary" /></div>
                    <h4 className="text-sm font-semibold text-primary mb-2 relative z-10">Key Takeaway Equation</h4>
                    <p className="font-mono text-lg bg-background py-2 px-3 rounded text-center border border-border/50 tracking-wider relative z-10">
                      H(jω) = ∫ h(t) e^(-jωt) dt
                    </p>
                    <p className="text-xs mt-2 text-muted-foreground relative z-10">
                      The frequency response is the Fourier transform of the impulse response.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="realworld" className="mt-4 space-y-4">
              {lectureData.realWorld.map((rw, i) => (
                <Card key={i} className="bg-card/40 border-l-4 border-l-chart-1 border-border/50 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-chart-1">{rw.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">{rw.desc}</p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="bg-chart-5/5 border border-chart-5/20 mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-chart-5 flex items-center gap-2">
                    <Link className="w-4 h-4" /> Lab Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{lectureData.labConnection}</p>
                  <Button variant="link" className="text-chart-5 p-0 h-auto mt-2 text-xs">View Lab Guide →</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="slides" className="mt-4">
               <Card className="bg-card/40 border-border/50 flex flex-col items-center justify-center p-12 py-20">
                 <Download className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                 <p className="text-sm font-medium">Original slides & transcripts</p>
                 <Button variant="outline" className="mt-4">Download PDF (12MB)</Button>
               </Card>
            </TabsContent>

          </Tabs>
        </div>

        {/* Sidebar (1/3 width) */}
        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Link className="w-4 h-4" /> Connected Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {lectureData.relatedTopics.map(topic => (
                <Button key={topic.id} variant="secondary" className="w-full justify-start text-xs h-9 bg-secondary/50 hover:bg-secondary border border-border/50">
                  {topic.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border border-accent/20 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <CardHeader>
              <CardTitle className="text-base text-accent">Missed this class?</CardTitle>
              <CardDescription className="text-xs">The AI generated a 3-minute audio digest summing up the exact points tested.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-accent/20 text-accent hover:bg-accent/30 border border-accent/20">
                <PlayCircle className="w-4 h-4 mr-2" /> Play Audio Digest
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
