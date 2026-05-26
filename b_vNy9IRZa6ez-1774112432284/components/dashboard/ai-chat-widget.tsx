"use client"

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, X, Send, BrainCircuit, Maximize2, Minimize2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from '@/hooks/use-toast'
import { askEurekaAI } from '@/lib/eureka-ai'
import { EurekaRichMessage } from '@/components/chat/eureka-rich-message'
import { buildEurekaAIUserContext } from '@/lib/eureka-ai-context'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  contextLinks?: { title: string, href: string }[]
}

const DEFAULT_CHAT_SIZE = { width: 420, height: 560 }
const MIN_CHAT_SIZE = { width: 340, height: 420 }

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chatSize, setChatSize] = useState(DEFAULT_CHAT_SIZE)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am Eureka AI. I can explain any concept, help you with your weaknesses, or tell you what career your current courses lead to. What would you like to know?'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const resizeStateRef = useRef<{ startX: number, startY: number, startWidth: number, startHeight: number } | null>(null)
  const { user } = useAuth()
  const pathname = usePathname()
  const userContext = buildEurekaAIUserContext(user)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

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
    window.removeEventListener('pointermove', handleResizeMove)
    window.removeEventListener('pointerup', stopResize)
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
    window.addEventListener('pointermove', handleResizeMove)
    window.addEventListener('pointerup', stopResize)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handleResizeMove)
      window.removeEventListener('pointerup', stopResize)
    }
  }, [])

  if (!user) return null

  const closeChat = () => {
    setIsOpen(false)
    setIsFullscreen(false)
  }

  const getQuickPrompts = () => {
    if (user.role === 'student') {
      return [
        'What is this app for?',
        'How do I use Exam Prep effectively?',
        'Explain Laplace transform in simple steps',
        'How do I improve placement readiness?',
      ]
    }
    if (user.role === 'professor') {
      return [
        'How do I use Upload Content?',
        'How can I track syllabus coverage?',
        'What is the best flow for CO-PO mapping?',
        'How should I use Tool Utilization insights?',
      ]
    }
    return [
      'How do I use Executive Summary?',
      'How can I monitor accreditation readiness?',
      'How do I review staff performance trends?',
      'How should I prioritize procurement requests?',
    ]
  }

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isTyping) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const conversation = [...messages, userMsg]
      .slice(-10)
      .map((msg) => ({ role: msg.role, content: msg.content }))

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const aiResponse = await askEurekaAI({
        question: text,
        role: user.role,
        userId: user.id,
        currentPage: pathname,
        conversation,
        userContext,
      })

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
      }])
    } catch {
      toast({
        title: 'Eureka AI unavailable',
        description: 'Could not connect to the AI service right now.',
      })
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I could not connect to the AI service just now. Please retry your question.',
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = async () => {
    await sendMessage(input)
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-110 transition-transform duration-300 z-50 p-0"
        >
          <Sparkles className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
          </span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 animate-in fade-in duration-300 ${isFullscreen ? 'inset-0' : 'bottom-6 right-6'}`}
          style={isFullscreen ? undefined : {
            width: `${chatSize.width}px`,
            height: `${chatSize.height}px`,
            maxWidth: 'calc(100vw - 1rem)',
            maxHeight: 'calc(100vh - 1rem)',
          }}
        >
          <Card className={`relative shadow-2xl border-white/10 bg-card/95 backdrop-blur-xl flex flex-col h-full w-full overflow-hidden ${isFullscreen ? 'rounded-none' : 'rounded-2xl'}`}>
            <CardHeader className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border-b border-white/5 py-4 shrink-0 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center border border-white/20">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Eureka AI</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Universal Answer Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isFullscreen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-[10px] text-muted-foreground hover:text-white"
                    onClick={() => setChatSize(DEFAULT_CHAT_SIZE)}
                  >
                    Reset
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white"
                  onClick={() => setIsFullscreen(prev => !prev)}
                  title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={closeChat}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          
            <CardContent className="p-0 flex-1 overflow-hidden relative">
              <ScrollArea className="h-full p-4" ref={scrollRef}>
                <div className="space-y-4 pb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                        </div>
                      )}
                      <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary/50 border border-white/5 rounded-tl-sm'}`}>
                        <EurekaRichMessage role={msg.role} content={msg.content} />
                      
                        {msg.contextLinks && (
                          <div className="mt-3 space-y-2">
                            {msg.contextLinks.map((link, i) => (
                              <a key={i} href={link.href} className="flex items-center gap-2 p-2 bg-background/50 hover:bg-background/80 rounded border border-white/5 transition-colors text-xs text-primary">
                                <BrainCircuit className="w-3 h-3" />
                                {link.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {messages.length <= 2 && !isTyping && (
                    <div className="flex flex-wrap gap-2">
                      {getQuickPrompts().map((prompt) => (
                        <Button
                          key={prompt}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full px-3 py-1.5 text-[11px] border-violet-400/40 bg-violet-500/5 hover:bg-violet-500/10 whitespace-normal text-left"
                          onClick={() => void sendMessage(prompt)}
                        >
                          💬 {prompt}
                        </Button>
                      ))}
                    </div>
                  )}
                 
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                      </div>
                      <div className="p-3 bg-secondary/50 border border-white/5 rounded-2xl rounded-tl-sm w-16 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="p-3 bg-card border-t border-white/5 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 w-full"
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Eureka anything..." 
                  className="bg-secondary/30 border-white/10 rounded-full text-sm h-10"
                />
                <Button type="submit" size="icon" className="h-10 w-10 rounded-full shrink-0 bg-primary hover:bg-primary/90" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
          {!isFullscreen && (
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
      )}
    </>
  )
}
