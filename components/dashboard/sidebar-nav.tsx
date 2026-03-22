"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  Home,
  Compass,
  BookOpen,
  Map,
  ClipboardCheck,
  GraduationCap,
  Settings,
  HelpCircle,
  Upload,
  BarChart3,
  MessageSquare,
  Users,
  Wrench,
  Bell,
  Sparkles,
  Flame,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  BrainCircuit,
  Network,
  Globe,
  Swords,
  CalendarCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string | number
}

const studentNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'AI Mastery Forge', href: '/dashboard/ai-mastery', icon: Swords, badge: 'Daily' },
  { title: 'Dynamic Timetable', href: '/dashboard/timetable', icon: CalendarCheck },
  { title: 'Digital Twin', href: '/dashboard/digital-twin', icon: BrainCircuit, badge: 'AI' },
  { title: 'Knowledge Graph', href: '/dashboard/knowledge-graph', icon: Network },
  { title: 'Discovery Lab', href: '/dashboard/discovery', icon: Compass },
  { title: 'My Roadmap', href: '/dashboard/roadmap', icon: Map },
  { title: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { title: 'Context Cards', href: '/dashboard/context', icon: Sparkles },
  { title: 'Assessments', href: '/dashboard/assessments', icon: ClipboardCheck, badge: 2 },
  { title: 'Lectures', href: '/dashboard/lectures', icon: GraduationCap },
  { title: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
]

const professorNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Dynamic Timetable', href: '/dashboard/timetable', icon: CalendarCheck },
  { title: 'Upload Content', href: '/dashboard/upload', icon: Upload },
  { title: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Student Feedback', href: '/dashboard/feedback', icon: MessageSquare, badge: 5 },
]

const adminNavItems: NavItem[] = [
  { title: 'Command Center', href: '/dashboard', icon: Home },
  { title: 'Dynamic Timetable', href: '/dashboard/timetable', icon: CalendarCheck },
  { title: 'Substitutes', href: '/dashboard/substitutes', icon: Users, badge: 3 },
  { title: 'Feedback', href: '/dashboard/feedback', icon: MessageSquare, badge: 12 },
  { title: 'Procurement', href: '/dashboard/procurement', icon: Wrench, badge: 2 },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, logout, switchRole } = useAuth()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setCollapsed(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!user) return null

  const navItems = user.role === 'student'
    ? studentNavItems
    : user.role === 'professor'
      ? professorNavItems
      : adminNavItems

  const roleColors = {
    student: 'bg-primary',
    professor: 'bg-accent',
    admin: 'bg-chart-4'
  }

  // Mobile hamburger button (rendered outside sidebar for always-visible access)
  const mobileToggle = isMobile && (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="fixed top-3 left-3 z-[60] flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar/95 backdrop-blur-xl border border-sidebar-border text-sidebar-foreground"
      aria-label="Toggle sidebar"
    >
      {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  )

  // Backdrop overlay on mobile
  const backdrop = isMobile && mobileOpen && (
    <div
      className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-sm"
      onClick={() => setMobileOpen(false)}
    />
  )

  const sidebarContent = (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar/95 border-r border-sidebar-border transition-all duration-300 backdrop-blur-xl",
        isMobile
          ? cn(
              "fixed top-0 left-0 z-[55] w-64 transform transition-transform duration-300",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )
          : cn(collapsed ? "w-[72px]" : "w-64")
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed && !isMobile ? "justify-center" : "gap-3",
        isMobile && "pl-14" // room for hamburger button
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-[0_8px_24px_rgba(203,163,129,0.35)]">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-sidebar-foreground">Eureka</span>
            <span className="text-xs text-muted-foreground">Knowledge Observatory</span>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={cn(
        "flex items-center p-4 border-b border-sidebar-border",
        collapsed && !isMobile ? "justify-center" : "gap-3"
      )}>
        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {(!collapsed || isMobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("text-xs capitalize px-1.5 py-0", roleColors[user.role], "text-white")}>
                {user.role}
              </Badge>
              {user.role === 'student' && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="w-3 h-3 text-eureka-streak" />
                  <span>{(user as any).streak}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const showLabel = !collapsed || isMobile

          const navLink = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_10px_24px_rgba(203,163,129,0.35)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5",
                !showLabel && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
              )} />
              {showLabel && (
                <>
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )

          if (!showLabel) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  {navLink}
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  {item.title}
                  {item.badge && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </TooltipContent>
              </Tooltip>
            )
          }

          return navLink
        })}
      </nav>

      {/* Role Switcher (Demo) */}
      {(!collapsed || isMobile) && (
        <div className="p-2 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground px-3 mb-2">Demo: Switch Role</p>
          <div className="flex gap-1 px-2">
            {(['student', 'professor', 'admin'] as const).map((role) => (
              <Button
                key={role}
                variant={user.role === role ? "default" : "ghost"}
                size="sm"
                className="flex-1 text-xs capitalize"
                onClick={async () => { await switchRole(role) }}
              >
                {role.slice(0, 4)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions & Translation Engine */}
      <div className={cn(
        "p-2 border-t border-sidebar-border space-y-1",
        !collapsed || isMobile ? "" : "flex flex-col items-center"
      )}>
        {(!collapsed || isMobile) && (
          <div className="mb-2 px-2 py-1.5 flex items-center justify-between bg-primary/5 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">Language</span>
            </div>
            <select className="bg-transparent text-xs text-foreground/80 outline-none cursor-pointer appearance-none text-right font-medium">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="hi">हिन्दी</option>
              <option value="fr">Français</option>
            </select>
          </div>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-sidebar-foreground",
                !(!collapsed || isMobile) && "w-10 h-10 p-0 justify-center"
              )}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {(!collapsed || isMobile) && <span className="text-sm">Toggle theme</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && !isMobile && <TooltipContent side="right">Toggle theme</TooltipContent>}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-sidebar-foreground",
                !(!collapsed || isMobile) && "w-10 h-10 p-0 justify-center"
              )}
            >
              <HelpCircle className="w-4 h-4" />
              {(!collapsed || isMobile) && <span className="text-sm">Help & Support</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && !isMobile && <TooltipContent side="right">Help & Support</TooltipContent>}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
                !(!collapsed || isMobile) && "w-10 h-10 p-0 justify-center"
              )}
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              {(!collapsed || isMobile) && <span className="text-sm">Sign out</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && !isMobile && <TooltipContent side="right">Sign out</TooltipContent>}
        </Tooltip>
      </div>

      {/* Collapse Toggle (desktop only) */}
      {!isMobile && (
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-center text-muted-foreground",
              collapsed && "w-10 h-10 p-0"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </aside>
  )

  return (
    <TooltipProvider delayDuration={0}>
      {mobileToggle}
      {backdrop}
      {sidebarContent}
    </TooltipProvider>
  )
}
