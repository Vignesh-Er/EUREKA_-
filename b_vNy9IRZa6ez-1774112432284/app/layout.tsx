import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import CosmicBackground from '@/components/CosmicBackground'
import dynamic from 'next/dynamic'
const EurekaChatbot = dynamic(() => import('@/components/chat/eureka-chatbot').then(mod => mod.EurekaChatbot), { ssr: false })
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: 'Eureka - AI Academic Intelligence Platform',
  description: 'The Global AI Academic & Career Intelligence Platform. Connect classroom learning, campus labs, real-world industry applications, and career opportunities into one continuous intelligent learning system.',
  keywords: ['AI education', 'academic platform', 'learning intelligence', 'career guidance', 'university platform'],
  authors: [{ name: 'Eureka' }],
  creator: 'Eureka',
  publisher: 'Eureka',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Eureka - AI Academic Intelligence Platform',
    description: 'Transform education from memorization to understanding, theory to application, isolation to industry alignment.',
    siteName: 'Eureka',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eureka - AI Academic Intelligence Platform',
    description: 'Transform education from memorization to understanding, theory to application, isolation to industry alignment.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7ff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <CosmicBackground />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <EurekaChatbot />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
