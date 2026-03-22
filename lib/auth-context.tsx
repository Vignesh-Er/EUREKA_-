"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, UserRole, StudentProfile, ProfessorProfile, AdminProfile } from './types'
import { sampleStudent, professors } from './data'
import { supabase, hasSupabase } from './supabase'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AUTH_STORAGE_KEY = "eureka.auth"

// Mock users for demo mode (always available, even without backend)
const mockUsers: Record<UserRole, User> = {
  student: sampleStudent,
  professor: professors[0] as ProfessorProfile,
  admin: {
    id: 'admin-1',
    email: 'admin@university.edu',
    name: 'System Administrator',
    role: 'admin',
    permissions: ['all'],
    createdAt: new Date('2020-01-01')
  } as AdminProfile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as { user: User }
      if (parsed.user?.role) setUser(parsed.user)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Try Supabase Auth if available
      if (hasSupabase && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (!error && data.user) {
            const normalizedUser: User = {
              ...mockUsers[role],
              id: data.user.id,
              email: data.user.email ?? email,
              role,
            }
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: normalizedUser }))
            setUser(normalizedUser)
            return
          }
        } catch {
          // Fall through to demo mode
        }
      }

      // Demo mode — simulate a brief login delay for UX
      await new Promise(resolve => setTimeout(resolve, 400))
      const demoUser = { ...mockUsers[role], email }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: demoUser }))
      setUser(demoUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    if (hasSupabase && supabase) {
      try { await supabase.auth.signOut() } catch { /* ignore */ }
    }
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const switchRole = useCallback(async (role: UserRole) => {
    const newUser = { ...mockUsers[role] }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: newUser }))
    setUser(newUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useStudent(): StudentProfile | null {
  const { user } = useAuth()
  if (user?.role === 'student') {
    return user as StudentProfile
  }
  return null
}

export function useProfessor(): ProfessorProfile | null {
  const { user } = useAuth()
  if (user?.role === 'professor') {
    return user as ProfessorProfile
  }
  return null
}
