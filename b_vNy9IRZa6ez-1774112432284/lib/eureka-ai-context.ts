import type { User, StudentProfile } from '@/lib/types'
import { sampleRoadmap, specializations } from '@/lib/data'

export const defaultDigitalTwinProfile = {
  cognitiveProfile: {
    visualLearning: 88,
    mathematicalAbstraction: 42,
    algorithmicThinking: 91,
    roteMemorization: 35,
    systemsDesign: 85,
  },
  knowledgeNodes: {
    strong: ['Digital Logic', 'Verilog', 'Neural Networks (CNNs)', 'FIR Filters'],
    developing: ['I2C/SPI Protocols', 'State Space Models'],
    weak: ['Laplace Transform', 'Continuous Time Fourier Transform', 'BJT Biasing'],
  },
  predictions: [
    {
      subject: 'Control Systems',
      prediction: 'High Risk of Struggle',
      reason:
        'Your mathematical abstraction score (42) and weakness in Laplace Transforms indicates a high probability of struggling with PID tuning theory.',
      action: 'Generating interactive visual-first modules for s-plane pole/zero movement.',
    },
    {
      subject: 'AI Hardware Accelerator Design',
      prediction: 'High Probability of Excellence',
      reason: 'Your strong combination of Verilog and CNNs aligns with this project.',
      action: 'Recommending fast-track advanced projects in the VLSI Lab.',
    },
  ],
} as const

export const defaultStudentPlacementData = {
  score: 85,
  gapSkills: [
    { skill: 'React Native', required: 80, current: 40 },
    { skill: 'AWS Cloud', required: 90, current: 65 },
  ],
  matchedCompanies: [
    { name: 'TechNova', role: 'Frontend Engineer', match: 92, skillsRequested: ['React', 'TypeScript', 'Tailwind'] },
    { name: 'Globex', role: 'Full Stack Dev', match: 78, skillsRequested: ['Node.js', 'React', 'AWS'] },
  ],
  journey: ['Applied - TechNova', 'Shortlisted - Globex', 'Interviewing - TechNova'],
  recommendations: [
    { text: 'Complete AWS Certification in AI Mastery Forge', priority: 'high', company: 'Globex' },
    { text: 'Practice System Design Problems', priority: 'medium', company: 'General' },
  ],
} as const

function buildStudentContext(student: StudentProfile) {
  const currentSemester = sampleRoadmap.semesters.find((sem) => sem.status === 'current')
  const specializationMatch = specializations.find(
    (spec) => spec.name.toLowerCase() === (student.specialization || '').toLowerCase()
  )

  const incompleteSelfStudy = currentSemester?.selfStudyTargets
    .filter((target) => !target.completed)
    .map((target) => ({
      name: target.name,
      estimatedHours: target.estimatedHours,
    })) ?? []

  return {
    source: 'eureka-default-mock-data',
    student_profile: {
      name: student.name,
      level: student.level,
      xp: student.xp,
      streak_days: student.streak,
      current_semester: student.currentSemester,
      specialization: student.specialization || null,
      weak_topics: student.weakTopics,
      strong_topics: student.strongTopics,
      completed_courses_count: student.completedCourses.length,
      earned_badges_count: student.badges.length,
    },
    roadmap: {
      progress_percent: sampleRoadmap.progress,
      current_courses:
        currentSemester?.courses.map((course) => ({
          name: course.courseName,
          code: course.courseCode,
          status: course.status,
          mastery_level: course.masteryLevel ?? null,
        })) ?? [],
      pending_self_study: incompleteSelfStudy,
    },
    digital_twin: defaultDigitalTwinProfile,
    placement: defaultStudentPlacementData,
    specialization_companies: specializationMatch?.companies ?? [],
    missing_inputs_for_better_personalization: [
      'Latest CGPA or semester GPA',
      'Recent assessment percentages',
      'Resume score or ATS score',
      'Target role (for placement focus)',
      'Companies already applied to recently',
    ],
  }
}

export function buildEurekaAIUserContext(user: User | null) {
  if (!user) return null
  if (user.role === 'student') {
    return buildStudentContext(user as StudentProfile)
  }
  return {
    source: 'limited-role-context',
    role: user.role,
    name: user.name,
  }
}
