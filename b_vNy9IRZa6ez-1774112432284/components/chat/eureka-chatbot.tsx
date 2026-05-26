"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Bot, X, Send, Sparkles, User, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { askEurekaAI } from "@/lib/eureka-ai"
import { EurekaRichMessage } from "@/components/chat/eureka-rich-message"
import { useAuth } from "@/lib/auth-context"
import { buildEurekaAIUserContext } from "@/lib/eureka-ai-context"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content:
    "### 👋 Hey, I am Eureka AI\n\nI can help with:\n- 📚 **Concept clarity**\n- 🧭 **How to use this app**\n- 🎯 **Exam prep and placement guidance**\n\nAsk me anything.",
}

const QUICK_PROMPTS = [
  "What is this app for?",
  "How do I use Exam Prep?",
  "Explain Laplace transform with a simple example",
  "How can I improve placement readiness?",
]

const DEFAULT_CHAT_SIZE = { width: 420, height: 560 }
const MIN_CHAT_SIZE = { width: 340, height: 420 }

export function EurekaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chatSize, setChatSize] = useState(DEFAULT_CHAT_SIZE)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const resizeStateRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null)
  const pathname = usePathname()
  const { user } = useAuth()
  const userContext = buildEurekaAIUserContext(user)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleResizeMove = (event: PointerEvent) => {
    if (!resizeStateRef.current) return
    const { startX, startY, startWidth, startHeight } = resizeStateRef.current
    const nextWidth = Math.min(
      Math.max(startWidth + (event.clientX - startX), MIN_CHAT_SIZE.width),
      window.innerWidth - 16
    )
    const nextHeight = Math.min(
      Math.max(startHeight + (event.clientY - startY), MIN_CHAT_SIZE.height),
      window.innerHeight - 16
    )
    setChatSize({ width: nextWidth, height: nextHeight })
  }

  const stopResize = () => {
    resizeStateRef.current = null
    window.removeEventListener("pointermove", handleResizeMove)
    window.removeEventListener("pointerup", stopResize)
  }

  const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isFullscreen) return
    event.preventDefault()
    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: chatSize.width,
      startHeight: chatSize.height,
    }
    window.addEventListener("pointermove", handleResizeMove)
    window.addEventListener("pointerup", stopResize)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleResizeMove)
      window.removeEventListener("pointerup", stopResize)
    }
  }, [])

  const closeChat = () => {
    setIsOpen(false)
    setIsFullscreen(false)
  }

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    const conversation = [...messages, userMsg]
      .slice(-10)
      .map((msg) => ({ role: msg.role, content: msg.content }))

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const aiResponse = await askEurekaAI({
        question: text,
        role: user?.role,
        userId: user?.id,
        currentPage: pathname,
        conversation,
        userContext,
      })

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: aiResponse },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I couldn't reach the AI service just now. Please try again in a moment, or ask where to find a specific module and I will guide you.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    await sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 z-50",
          "bg-gradient-to-r from-primary to-accent hover:scale-110",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed flex flex-col shadow-2xl transition-all duration-300 z-50",
          isFullscreen ? "inset-0 origin-center" : "bottom-6 right-6 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
        style={
          isFullscreen
            ? undefined
            : {
                width: `${chatSize.width}px`,
                height: `${chatSize.height}px`,
                maxWidth: "calc(100vw - 1rem)",
                maxHeight: "calc(100vh - 1rem)",
              }
        }
      >
        <Card className={cn(
          "relative border-border/50 bg-background/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.3)] h-full w-full overflow-hidden",
          isFullscreen ? "rounded-none" : ""
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Eureka AI</CardTitle>
                <p className="text-xs text-muted-foreground">Universal Answer Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                  onClick={() => setChatSize(DEFAULT_CHAT_SIZE)}
                >
                  Reset
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsFullscreen((prev) => !prev)}
                title={isFullscreen ? "Exit full screen" : "Full screen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={closeChat}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4 flex flex-col" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-2 max-w-[85%]", msg.role === "user" ? "self-end flex-row-reverse" : "self-start")}>
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1", msg.role === "user" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary")}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn("px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === "user" ? "bg-accent text-accent-foreground rounded-tr-sm" : "bg-secondary text-secondary-foreground rounded-tl-sm border border-border/50")}>
                      <EurekaRichMessage role={msg.role} content={msg.content} />
                    </div>
                  </div>
                ))}

                {messages.length <= 2 && !isLoading && (
                  <div className="flex flex-wrap gap-2 self-start max-w-[95%]">
                    {QUICK_PROMPTS.map((prompt) => (
                      <Button
                        key={prompt}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto rounded-full px-3 py-1.5 text-[11px] border-primary/30 hover:bg-primary/10 whitespace-normal text-left"
                        onClick={() => void sendMessage(prompt)}
                      >
                        ✨ {prompt}
                      </Button>
                    ))}
                  </div>
                )}
                {isLoading && (
                  <div className="flex gap-2 max-w-[85%] self-start">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-secondary rounded-tl-sm border border-border/50 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 h-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground animate-pulse">Running Digital Twin analysis...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t border-border/50 bg-background/50">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Ask about courses, skills, or placements..."
                className="flex-1 text-sm bg-secondary/50 border-secondary focus-visible:ring-1 focus-visible:ring-primary/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading} className="shrink-0 h-10 w-10">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        {!isFullscreen && isOpen && (
          <button
            type="button"
            onPointerDown={startResize}
            className="absolute bottom-1 right-1 z-10 h-5 w-5 cursor-se-resize rounded text-muted-foreground/70 hover:text-foreground"
            aria-label="Resize AI assistant"
            title="Drag to resize"
          >
            <span className="pointer-events-none text-[11px] leading-none">◢</span>
          </button>
        )}
      </div>
    </>
  )
}
