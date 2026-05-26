import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { AIChatWidget } from '@/components/dashboard/ai-chat-widget'
import { Header } from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background/90 text-foreground antialiased font-sans selection:bg-primary/30">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </main>
      <AIChatWidget />
    </div>
  )
}
