"use client"

import { Bell, Search, Command, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { Kbd } from '@/components/ui/kbd'

interface HeaderProps {
  title?: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { user } = useAuth()

  const notifications = [
    { id: 1, title: 'New assessment available', description: 'Fourier Transform micro-test', time: '5 min ago', unread: true },
    { id: 2, title: 'Lecture companion ready', description: 'Control Systems - PID Control', time: '1 hour ago', unread: true },
    { id: 3, title: 'Achievement unlocked!', description: 'You earned "Week Warrior" badge', time: '2 hours ago', unread: false },
    { id: 4, title: 'Roadmap updated', description: 'New recommendations based on progress', time: 'Yesterday', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-background/65 backdrop-blur-xl border-b border-primary/20">
      <div className="flex flex-col">
        {title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* AI Search */}
         <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Ask Eureka AI..."
            className="w-64 pl-9 pr-16 bg-white/5 border-primary/20 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <div className="absolute right-2 flex items-center gap-1 pointer-events-none">
            <Kbd className="text-[10px]">
              <Command className="w-3 h-3" />
            </Kbd>
            <Kbd className="text-[10px]">K</Kbd>
          </div>
        </div>

        {/* AI Assistant Button */}
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2 text-primary border-primary/30 hover:bg-primary/10">
          <Sparkles className="w-4 h-4" />
          <span>AI Assistant</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="pulse-glow absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-primary-foreground bg-primary rounded-full">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-start gap-2 w-full">
                    {notification.unread && (
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <div className={notification.unread ? '' : 'ml-4'}>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
