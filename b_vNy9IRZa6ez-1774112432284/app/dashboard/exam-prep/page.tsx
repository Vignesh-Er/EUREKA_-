"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { BookOpen, Upload, Sparkles, Send, FileText, BrainCircuit, Maximize2 } from "lucide-react"

import { RoadmapUI } from "@/components/roadmap-ui"

export default function ExamPrepPage() {
  const [subject, setSubject] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState("")
  const [explanation, setExplanation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [tabMode, setTabMode] = useState("guided")
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false)

  const handleSubjectChange = async (val: string) => {
    setSubject(val)
    setExplanation("")
    setSelectedTopic("")
    setIsLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_URL}/exam-prep/suggestions?subject=${val}`)
      const data = await res.json()
      setTopics(data.suggestions || [])
      
      // Auto-fetch summary when subject is selected
      setExplanation("Generating study plan and exam flow for " + val + "...")
      const summaryRes = await fetch(`${API_URL}/exam-prep/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: `Provide a structured exam preparation flow and summary for ${val}.` })
      })
      const summaryData = await summaryRes.json()
      setExplanation(summaryData.answer || "Failed to load summary.")

    } catch(e) { 
      console.error(e) 
      setExplanation("There was an error generating the study flow. Please ensure the backend is running.")
    }
    setIsLoading(false)
  }

  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic)
    setIsLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_URL}/exam-prep/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      })
      const data = await res.json()
      setExplanation(data.explanation || "Failed to load explanation.")
    } catch(e) { console.error(e) }
    setIsLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {  
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      setIsLoading(true)
      setExplanation("File uploaded successfully! I'm analyzing your notes now. Ask me any question below.")

      const formData = new FormData()
      formData.append("file", file)

      try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        await fetch(`${API_URL}/exam-prep/upload-notes`, {      
          method: "POST",
          body: formData
        })
      } catch(e) { console.error(e) }
      setIsLoading(false)
    }
  }

  const handleSmartChat = async () => {
    if (!chatMessage) return
    setIsLoading(true)
    const currentQ = chatMessage
    setChatMessage("")
    
    // Optimistic UI update
    setExplanation((prev) => prev ? prev + `\n\n**You:** ${currentQ}\n` : `**You:** ${currentQ}\n`)
    
    // Choose endpoint based on current mode
    const endpoint = tabMode === "custom" ? "ask-notes" : "chat"
    let contextQuestion = currentQ
    if (tabMode === "guided" && subject) {
       contextQuestion = `Regarding my exam limits in ${subject}: ${currentQ}`
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_URL}/exam-prep/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: contextQuestion })
      })
      const data = await res.json()
      setExplanation((prev) => prev + `*AI:* ${data.answer}`)
    } catch(e) { 
      console.error(e) 
      setExplanation((prev) => prev + `*AI Error:* Could not connect to AI backend.`)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Exam Preparation</h1>
        <p className="text-muted-foreground border-b pb-4">
          Master your subjects with AI-guided flows or ask questions directly based on your own notes.
        </p>
      </div>

      <Tabs value={tabMode} onValueChange={setTabMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="guided"><Sparkles className="w-4 h-4 mr-2" /> AI Guided</TabsTrigger>
          <TabsTrigger value="custom"><Upload className="w-4 h-4 mr-2" /> Custom Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="guided" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Choose a Subject Structure</CardTitle>
                <CardDescription>Select what you are studying to auto-generate an exam flow.</CardDescription>
              </div>
              {subject && topics.length > 0 && (
                <Button onClick={() => setIsRoadmapOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                  <Maximize2 className="h-4 w-4" /> View Interactive Roadmap
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select onValueChange={handleSubjectChange} value={subject}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a subject to begin..." />
                  </SelectTrigger>
                  <SelectContent>
                          
                    
                    
                    
                    <SelectItem value="Software Defined Radio">Software Defined Radio</SelectItem><SelectItem value="Antenna and Microwave Engineering">Antenna and Microwave Engineering</SelectItem><SelectItem value="Wireless Broad band Network">Wireless Broad band Network</SelectItem><SelectItem value="Communication Networks and Systems">Communication Networks and Systems</SelectItem><SelectItem value="Bio medical Engineering">Bio medical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {topics.length > 0 && (
            <div>
              <Label className="mb-3 block text-sm font-semibold text-muted-foreground">Recommended Focus Areas</Label>
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                {topics.map((topic, idx) => (
                  <Card key={idx} className="cursor-pointer border-primary/20 hover:bg-primary/10 transition-colors" onClick={() => handleTopicSelect(topic)}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center gap-2">     
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        <span className="truncate">{topic}</span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Study Notes</CardTitle>
              <CardDescription>Upload a PDF or text document. The AI will read it and base its teachings ONLY on your material.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">       
                <Label htmlFor="pdf">Study Material (Text files perfectly supported!)</Label>
                <Input id="pdf" type="file" accept=".pdf,.txt,.docx" onChange={handleFileUpload} />
              </div>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-muted rounded-md flex items-center gap-2 text-sm text-green-500">
                  <FileText className="w-4 h-4" />
                  {uploadedFile.name} securely cached for AI analysis.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 border-primary/20 bg-primary/5 shadow-md h-[400px] flex flex-col">
        <CardHeader className="shrink-0 flex flex-row items-center gap-2 pb-2">
          {tabMode === "guided" && subject ? (
            <CardTitle>{selectedTopic ? `Explaining Concept: ${selectedTopic}` : `Study Flow: ${subject}`}</CardTitle>
          ) : (
            <CardTitle>AI Study Consultant</CardTitle>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4 pt-4 border-t">
          {isLoading && (!explanation || explanation.includes("Generating")) ? (
            <div className="flex items-center space-x-2 text-primary h-full justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-lg">AI is mapping out your knowledge...</span>
            </div>
          ) : explanation ? (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {explanation}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground italic flex-col gap-2">
               <BookOpen className="w-8 h-8 opacity-20" />
               Select a subject or upload notes above to begin your study session!
            </div>
          )}
        </CardContent>

        <div className="shrink-0 p-4 border-t bg-background/50 backdrop-blur pb-4">
          <div className="flex gap-2">
            <Input
              placeholder={tabMode === "custom" ? "Ask a question about your specific notes..." : `Ask the AI about ${subject || 'your subjects'}...`}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartChat()}     
            />
            <Button onClick={handleSmartChat} disabled={isLoading || !chatMessage}>
              <Send className="w-4 h-4 mr-2" /> Ask
            </Button>
          </div>
        </div>
      </Card>

      {isRoadmapOpen && (
        <RoadmapUI 
          subject={subject} 
          isOpen={isRoadmapOpen} 
          onClose={() => setIsRoadmapOpen(false)} 
        />
      )}
    </div>
  )
}
