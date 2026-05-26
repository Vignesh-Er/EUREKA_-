"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FileText, ShieldCheck, HeartHandshake } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function ParentLoginPage() {
  const router = useRouter()
  const [parentId, setParentId] = useState('')
  const [wardId, setWardId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parentId || !wardId) {
      toast({ title: 'Validation Error', description: 'Please enter both Parent ID and Ward ID.', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      // Dummy check
      toast({ title: 'Authentication Successful', description: 'Welcome to the Parent Portal.' })
      router.push('/parent-portal/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />

      <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/10 z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <HeartHandshake className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Parent Portal
            </CardTitle>
            <CardDescription className="text-base">
              Monitor and support your ward's progress
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="parentId" className="text-sm font-medium text-white/80">Parent ID</label>
              <Input
                id="parentId"
                placeholder="e.g. PAR-2026-X89"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="bg-background/50 border-white/10 text-white placeholder:text-white/30 h-12"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="wardId" className="text-sm font-medium text-white/80">Ward / Student ID</label>
              <Input
                id="wardId"
                placeholder="e.g. STU-2024-001"
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="bg-background/50 border-white/10 text-white placeholder:text-white/30 h-12"
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Access Portal <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Privacy Enforced: You will only see summaries designed to help you support your ward mentally and academically.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
