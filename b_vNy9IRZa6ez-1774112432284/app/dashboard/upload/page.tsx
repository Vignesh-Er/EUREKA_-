"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, FileAudio, FileVideo, Sparkles, UserPlus } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <UploadCloud className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-chart-1">
            Professor Workbench
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Upload lecture materials once. The Eureka AI pipeline automatically generates summaries, 
          extracts formulas, maps real-world applications, and creates student micro-tests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Ingest Lecture Context</CardTitle>
            <CardDescription>Drag and drop slides, notes, or audio transcripts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="border-2 border-dashed border-border/50 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-background/30 hover:bg-background/50 transition-colors cursor-pointer group">
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
              <h3 className="text-lg font-medium text-foreground mb-1">Click to Upload or Drag and Drop</h3>
              <p className="text-sm text-muted-foreground">PDF, PPTX, DOCX, MP4, MP3 (Max 50MB)</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Automatic AI Pipeline Generation:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-2 rounded-lg border border-primary/20">
                  <FileText className="w-4 h-4" /> Lecture Summary
                </div>
                <div className="flex items-center gap-2 text-sm bg-accent/10 text-accent px-3 py-2 rounded-lg border border-accent/20">
                  <Sparkles className="w-4 h-4" /> Context Cards
                </div>
                <div className="flex items-center gap-2 text-sm bg-chart-1/10 text-chart-1 px-3 py-2 rounded-lg border border-chart-1/20">
                  <CheckCircle2 className="w-4 h-4" /> Micro-Test
                </div>
                <div className="flex items-center gap-2 text-sm bg-chart-5/10 text-chart-5 px-3 py-2 rounded-lg border border-chart-5/20">
                  <FileAudio className="w-4 h-4" /> Translations
                </div>
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => toast({ title: "Started Initialization", description: "Generation pipeline task successfully queued." })}>Initialize Generation Pipeline</Button>
          </CardFooter>
        </Card>

        {/* Substitute & Absence Section */}
        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-accent" /> Request Substitute Teacher
              </CardTitle>
              <CardDescription>If you cannot attend class, the AI will find and notify a qualified stand-in.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Selection</label>
                <Input placeholder="e.g. EC401 - Signals & Systems (10:00 AM)" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic to Cover</label>
                <Input placeholder="e.g. Z-Transform Properties" className="bg-background" />
              </div>
              <div className="bg-accent/5 border border-accent/20 p-3 rounded-lg text-sm text-foreground/80 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p>The AI will automatically share your last uploaded notes and the syllabus trajectory with the substitute.</p>
              </div>
              <Button variant="outline" className="w-full text-accent border-accent/50 hover:bg-accent/10" onClick={() => toast({ title: "Substitute Found", description: "Dr. Smith has automatically been notified and provided with the lecture material." })}>Find & Notify Substitute</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border/50 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-chart-1" /> Absent Student Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                3 students missed yesterday&apos;s Control Systems lecture. AI has automatically generated and sent them catching-up materials.
              </p>
              <Button variant="secondary" className="w-full">View Absentee Log</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
