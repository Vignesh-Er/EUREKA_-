"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PlayCircle, Clock, CheckCircle2, XCircle, BrainCircuit } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function QuizModal({
  isOpen,
  onClose,
  testDurationMinutes = 10,
  title = "AI Assessment"
}: {
  isOpen: boolean
  onClose: () => void
  testDurationMinutes?: number
  title?: string
}) {
  const [timeLeft, setTimeLeft] = useState(testDurationMinutes * 60)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!isOpen) return
    setTimeLeft(testDurationMinutes * 60)
    setCurrentQuestion(0)
    setIsFinished(false)
    setScore(0)
    setSelectedAnswer(null)
  }, [isOpen, testDurationMinutes])

  useEffect(() => {
    if (isOpen && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !isFinished) {
      setIsFinished(true)
    }
  }, [isOpen, isFinished, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Simulated AI Questions
  const questions = [
    {
      q: "Which property is essential for a system to process superposition?",
      options: ["Time Invariance", "Linearity", "Causality", "Stability"],
      answer: 1
    },
    {
      q: "If an LTI system impulse response h(t) = e^(-at)u(t) with a > 0, is it stable?",
      options: ["Yes", "No", "Only if input is bounded", "Cannot be determined"],
      answer: 0
    },
    {
      q: "The Fourier transform of a delta function δ(t) is:",
      options: ["1/jw", "1", "e^-jw", "0"],
      answer: 1
    }
  ]

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(s => s + 1)
    }
    setSelectedAnswer(null)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1)
    } else {
      setIsFinished(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none bg-background/95 backdrop-blur-3xl border-0 overflow-y-auto">
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-6 lg:p-12 space-y-8">
          
          <div className="flex justify-between items-center border-b border-border/20 pb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {title}
            </h2>
            <div className={`flex items-center gap-2 text-xl font-mono ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
              <Clock className="w-6 h-6" /> {formatTime(timeLeft)}
            </div>
          </div>

          {!isFinished ? (
            <div className="flex-1 space-y-8 flex flex-col justify-center">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}% complete</span>
              </div>
              <Progress value={((currentQuestion) / questions.length) * 100} className="h-2" />

              <h3 className="text-3xl font-medium text-foreground py-8 leading-snug">
                {questions[currentQuestion].q}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant={selectedAnswer === idx ? "default" : "outline"}
                    className={`h-auto p-6 text-left justify-start text-lg transition-all
                      ${selectedAnswer === idx ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:border-primary/50'}`}
                    onClick={() => setSelectedAnswer(idx)}
                  >
                    <span className="mr-4 text-muted-foreground font-mono">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </Button>
                ))}
              </div>

              <div className="pt-12 flex justify-end">
                <Button 
                  size="lg" 
                  disabled={selectedAnswer === null} 
                  onClick={handleNext}
                  className="w-full md:w-auto px-12 text-lg"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
              <BrainCircuit className="w-24 h-24 text-primary opacity-80" />
              <h1 className="text-4xl font-bold">Assessment Complete</h1>
              <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-6 flex flex-col items-center space-y-4 text-center">
                  <div className="text-6xl font-black text-primary">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <p className="text-muted-foreground text-lg">
                    You answered {score} out of {questions.length} questions correctly.
                  </p>
                  <p className="text-sm border-t border-border/50 pt-4 text-foreground/80">
                    Statistics updated. Badges recalculated.
                  </p>
                </CardContent>
              </Card>
              <Button size="lg" onClick={onClose} className="px-12 mt-4">
                Return to Dashboard
              </Button>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}


