import { ThemeProvider } from '@/components/theme-provider'
import '@/app/globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'Parent Portal - Eureka',
  description: 'Track your ward\'s academic progress and placement readiness.',
}

export default function ParentPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-primary/30">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </div>
  )
}
