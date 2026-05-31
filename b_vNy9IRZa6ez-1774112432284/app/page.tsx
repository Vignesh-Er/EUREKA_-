"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { UserRole } from "@/lib/types"
import CosmicBackground from "@/components/CosmicBackground"

export default function LandingPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [activeTab, setActiveTab] = useState<"demo" | "signin">("demo")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const heroRef = useRef<HTMLElement | null>(null)
  const featuresRef = useRef<HTMLElement | null>(null)
  const signPanelRef = useRef<HTMLElement | null>(null)

  const demoEmails = useMemo<Record<UserRole, string>>(
    () => ({
      student: "student@university.edu",
      professor: "prof@university.edu",
      admin: "admin@university.edu",
      parent: "parent@university.edu",
    }),
    [],
  )

  const doLogin = async (role: UserRole, demo = false) => {
    setError(null)
    setIsLoading(true)
    try {
      if (demo) await login(demoEmails[role], "password123", role)
      else await login(email || demoEmails[role], password || "password123", role)
      
      if (role === 'parent') {
        router.push("/parent-portal/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  // Floating 3D Card Effect
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll(".glass-card")) as HTMLElement[]
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (isTouch) return

    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        const px = (x / r.width) * 100
        const py = (y / r.height) * 100
        const ry = ((x - r.width / 2) / r.width) * 12
        const rx = -((y - r.height / 2) / r.height) * 12
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`
        card.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(168,85,247,0.1) 0%, rgba(255,255,255,0.02) 60%)`
      }
      const onLeave = () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
        card.style.background = "rgba(255, 255, 255, 0.03)"
      }
      card.addEventListener("mousemove", onMove)
      card.addEventListener("mouseleave", onLeave)
      return () => {
        card.removeEventListener("mousemove", onMove)
        card.removeEventListener("mouseleave", onLeave)
      }
    })
  }, [])

  // Reveal Animations on Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })

    document.querySelectorAll('.reveal-wait').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="portal-root min-h-screen text-slate-100 font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Global Cosmic Background inherited from Dashboard */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground />
      </div>

      {/* Navigation Layer */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-[100] flex items-center justify-between px-6 lg:px-12 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            ⬢
          </div>
          <span className="text-xl font-bold tracking-tight">Project Eureka</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#engines" className="hover:text-white transition-colors relative group py-2">
            The 8 Engines
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </a>
          <a href="#demo" className="hover:text-white transition-colors relative group py-2">
            Interactive Demo
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </a>
        </div>

        <button 
          onClick={() => signPanelRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          Enter Platform
        </button>
      </nav>

      <main className="relative z-10 pt-20">
        
        {/* Hero Section */}
        <section ref={heroRef} className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative">
          
          {/* Dynamic Glow Behind Hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 relative z-10 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Prototype — UI Demo
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8">
              The End of the <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 animate-gradient-bg bg-[length:200%_auto]">
                Context Vacuum.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
              An AI-powered academic and career intelligence platform. Connect theoretical physics to autonomous vehicles, map your brain's cognitive twin, and learn without limits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => signPanelRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 group"
              >
                Start Learning Free
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button 
                onClick={() => document.getElementById('engines')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                Explore the 8 Engines
              </button>
            </div>
          </div>
        </section>

        {/* Feature Engines Section */}
        <section id="engines" className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 reveal-wait opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">8 Engines</span> of Intelligence</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Replace standard learning management systems with proactive, beautifully designed AI pipelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Student Digital Twin", desc: "Maps your cognitive profile—visual learning, math abstraction, algorithmic thinking—to predict failure risks.", color: "from-violet-500 to-fuchsia-600", icon: "🧠" },
                { title: "Global Knowledge Graph", desc: "Visually maps the shortest path from your current syllabus to high-paying target careers and campus labs.", color: "from-cyan-400 to-blue-600", icon: "🌌" },
                { title: "Discovery Labs", desc: "Replaces generic campus tours with specific lab cards and AI career recommendations.", color: "from-emerald-400 to-cyan-500", icon: "🧭" },
                { title: "Context Cards", desc: "The 'Why Does This Exist' layer, tracing theoretical concepts to real-world products.", color: "from-pink-500 to-orange-500", icon: "✨" },
                { title: "Micro-Assessments", desc: "Continuous understanding evaluation catching knowledge gaps before midterms happen.", color: "from-blue-500 to-indigo-600", icon: "🎯" },
                { title: "Translation Engine", desc: "Breaks global language barriers, instantly translating materials from English to Mandarin, Spanish, etc.", color: "from-amber-400 to-orange-600", icon: "🌐" },
                { title: "University Intelligence", desc: "Aggregates thousands of digital twins to show admins high-risk syllabus nodes.", color: "from-red-500 to-pink-600", icon: "📊" },
                { title: "Intelligent Uploads", desc: "Professors drag-and-drop slides; AI automatically outputs tests, summaries, and substitutes.", color: "from-purple-500 to-indigo-600", icon: "⚡" },
              ].map((engine, i) => (
                <div 
                  key={i}
                  className="glass-card reveal-wait opacity-0 translate-y-8 transition-all duration-700 ease-out bg-white/[0.03] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${engine.color} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="text-4xl mb-4 p-4 bg-white/5 rounded-2xl w-fit border border-white/5 shadow-inner">{engine.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{engine.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{engine.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Log In / Demo Section */}
        <section id="demo" ref={signPanelRef} className="py-32 px-4 relative flex justify-center items-center custom-demo-bg">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl border-t border-white/5" />
          
          <div className="relative z-10 w-full max-w-md reveal-wait opacity-0 translate-y-8 transition-all duration-700">
            <div className="bg-white/[0.06] border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
               {/* Decorative Orbs inside card */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />
               <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-[50px] pointer-events-none" />

               <div className="text-center mb-8 relative z-10">
                 <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Welcome Home</h3>
                 <p className="text-slate-400 mt-2 text-sm">Choose an interactive demo role to begin.</p>
               </div>

               <div className="space-y-4 relative z-10">
                 <button 
                  onClick={() => doLogin("student", true)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 hover:bg-violet-600/30 flex items-center justify-between group transition-all"
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-2xl">🎓</span>
                     <div className="text-left">
                       <p className="font-bold text-violet-300">Student Demo</p>
                       <p className="text-xs text-slate-400">Digital Twin, Knowledge Graph</p>
                     </div>
                   </div>
                   <span className="text-violet-400 group-hover:translate-x-1 transition-transform">→</span>
                 </button>

                 <button 
                  onClick={() => doLogin("professor", true)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:bg-cyan-600/30 flex items-center justify-between group transition-all"
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-2xl">👨‍🏫</span>
                     <div className="text-left">
                       <p className="font-bold text-cyan-300">Professor Demo</p>
                       <p className="text-xs text-slate-400">Upload Engine, Analytics</p>
                     </div>
                   </div>
                   <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                 </button>

                 <button 
                  onClick={() => doLogin("admin", true)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 flex items-center justify-between group transition-all"
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-2xl">🏛️</span>
                     <div className="text-left">
                       <p className="font-bold text-emerald-300">Admin Demo</p>
                       <p className="text-xs text-slate-400">Procurement, Feedback</p>
                     </div>
                   </div>
                   <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                 </button>

                 <button 
                  onClick={() => doLogin("parent", true)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:bg-amber-600/30 flex items-center justify-between group transition-all"
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-2xl">👨‍👩‍👦</span>
                     <div className="text-left">
                       <p className="font-bold text-amber-300">Parent Demo</p>
                       <p className="text-xs text-slate-400">Attendance, Trend Alerts</p>
                     </div>
                   </div>
                   <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                 </button>
               </div>

               {error && <p className="mt-6 text-center text-sm text-red-400 bg-red-400/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
            </div>
          </div>
        </section>

      </main>


    </div>
  )
}

