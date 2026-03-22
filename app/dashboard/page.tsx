"use client"

import { useAuth } from "@/lib/auth-context"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { ProfessorDashboard } from "@/components/dashboard/professor-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "student":
      return <StudentDashboard />
    case "professor":
      return <ProfessorDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <StudentDashboard />
  }
}
