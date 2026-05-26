// ============================================
// Project Eureka - Type Definitions
// AI Academic Intelligence Platform
// ============================================

// User & Authentication Types
export type UserRole = 'student' | 'professor' | 'admin' | 'parent'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  department?: string
  enrollmentYear?: number
  specialization?: string
  createdAt: Date
}

export interface StudentProfile extends User {
  role: 'student'
  enrollmentYear: number
  specialization?: string
  currentSemester: number
  xp: number
  level: number
  streak: number
  completedCourses: string[]
  badges: Badge[]
  weakTopics: string[]
  strongTopics: string[]
}

export interface ProfessorProfile extends User {
  role: 'professor'
  department: string
  courses: string[]
  expertise: string[]
  rating: number
}

export interface AdminProfile extends User {
  role: 'admin'
  permissions: string[]
}

// Discovery Week & Lab Types
export interface Lab {
  id: string
  name: string
  shortName: string
  description: string
  purpose: string
  projects: Project[]
  researchAreas: string[]
  industryConnections: string[]
  requiredSkills: string[]
  relatedCourses: string[]
  equipment: string[]
  imageUrl?: string
  capacity: number
  location: string
}

export interface Project {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  technologies: string[]
  duration: string
  outcomes: string[]
}

export interface DiscoveryProgress {
  studentId: string
  labsVisited: string[]
  timeSpent: Record<string, number> // labId -> seconds
  quizResults: Record<string, number> // labId -> score
  interestSignals: InterestSignal[]
  completedAt?: Date
}

export interface InterestSignal {
  labId: string
  signalType: 'click' | 'hover' | 'quiz' | 'bookmark' | 'project_view'
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Specialization & Recommendation Types
export interface Specialization {
  id: string
  name: string
  description: string
  careerPaths: string[]
  requiredCourses: string[]
  electiveCourses: string[]
  skillsGained: string[]
  industryDemand: 'high' | 'medium' | 'low'
  avgSalary: string
  companies: string[]
  labConnections: string[]
}

export interface SpecializationRecommendation {
  specialization: Specialization
  matchScore: number
  reasons: string[]
  strengthAlignment: string[]
  growthAreas: string[]
}

// Curriculum & Context Engine Types
export interface Course {
  id: string
  code: string
  name: string
  description: string
  credits: number
  semester: number
  prerequisites: string[]
  topics: Topic[]
  labConnections: string[]
  professorId?: string
  schedule?: CourseSchedule
}

export interface Topic {
  id: string
  name: string
  description: string
  contextCard?: ContextCard
  lectureIds: string[]
  assessmentIds: string[]
  masteryLevel?: number
}

export interface ContextCard {
  id: string
  topicId: string
  topicName: string
  whyItExists: string
  industryApplications: IndustryApplication[]
  labConnection: LabConnection
  companiesHiring: Company[]
  relatedTopics: string[]
  workedExample?: WorkedExample
  confidence: number
  generatedAt: Date
}

export interface IndustryApplication {
  industry: string
  useCase: string
  realWorldExample: string
  companies: string[]
}

export interface LabConnection {
  labId: string
  labName: string
  experimentName: string
  experimentDescription: string
  equipmentUsed: string[]
}

export interface Company {
  name: string
  sector: string
  rolesHiring: string[]
  salaryRange?: string
}

export interface WorkedExample {
  problem: string
  solution: string
  realParameters: Record<string, string>
  industryContext: string
}

// Learning Journey Types
export interface LearningRoadmap {
  id: string
  studentId: string
  specializationId: string
  semesters: SemesterPlan[]
  milestones: Milestone[]
  currentSemester: number
  progress: number
  lastUpdated: Date
}

export interface SemesterPlan {
  semester: number
  status: 'completed' | 'current' | 'upcoming'
  courses: CoursePlan[]
  selfStudyTargets: SelfStudyTarget[]
  totalCredits: number
  workloadIntensity: 'light' | 'moderate' | 'heavy'
}

export interface CoursePlan {
  courseId: string
  courseName: string
  courseCode: string
  credits: number
  relevanceTags: string[]
  status: 'completed' | 'in-progress' | 'planned'
  grade?: string
  masteryLevel?: number
}

export interface SelfStudyTarget {
  id: string
  name: string
  description: string
  resources: Resource[]
  estimatedHours: number
  completed: boolean
}

export interface Resource {
  type: 'video' | 'article' | 'book' | 'course' | 'tutorial'
  title: string
  url?: string
  provider: string
  duration?: string
}

export interface Milestone {
  id: string
  type: 'internship' | 'certification' | 'project' | 'competition' | 'research'
  name: string
  description: string
  targetSemester: number
  status: 'completed' | 'in-progress' | 'planned'
  completedAt?: Date
}

// Assessment & Evaluation Types
export interface Assessment {
  id: string
  topicId: string
  topicName: string
  type: 'micro-test' | 'module-test' | 'practice'
  questions: Question[]
  difficulty: number
  timeLimit: number // minutes
  createdAt: Date
}

export interface Question {
  id: string
  type: 'mcq' | 'numerical' | 'short-answer' | 'code'
  text: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  bloomLevel: 1 | 2 | 3 | 4 | 5 | 6
  points: number
  remediationLink?: string
}

export interface AssessmentResult {
  id: string
  assessmentId: string
  studentId: string
  answers: StudentAnswer[]
  score: number
  maxScore: number
  percentage: number
  timeTaken: number
  completedAt: Date
  gapAnalysis: GapAnalysis
}

export interface StudentAnswer {
  questionId: string
  answer: string | number
  isCorrect: boolean
  timeSpent: number
}

export interface GapAnalysis {
  weakSubtopics: string[]
  strongSubtopics: string[]
  recommendedReview: string[]
  improvementTrend: 'improving' | 'stable' | 'declining'
}

// Lecture Companion Types
export interface Lecture {
  id: string
  courseId: string
  topicId: string
  title: string
  date: Date
  materials: LectureMaterial[]
  companion?: LectureCompanion
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface LectureMaterial {
  type: 'slides' | 'pdf' | 'video' | 'audio' | 'notes'
  url: string
  name: string
  uploadedAt: Date
}

export interface LectureCompanion {
  id: string
  lectureId: string
  summary: string
  keyConcepts: KeyConcept[]
  realWorldApplications: string[]
  labConnections: string[]
  catchUpPackage: CatchUpPackage
  relatedTopics: string[]
  translations: Record<string, LectureCompanion>
  generatedAt: Date
}

export interface KeyConcept {
  name: string
  explanation: string
  formula?: string
  importance: 'critical' | 'important' | 'supplementary'
}

export interface CatchUpPackage {
  missedContent: string
  keyFormulas: string[]
  applicationExamples: string[]
  homeworkGuidance: string
  estimatedCatchUpTime: number // minutes
}

// Admin & Feedback Types
export interface Feedback {
  id: string
  studentId: string
  courseId?: string
  professorId?: string
  type: 'course' | 'teaching' | 'infrastructure' | 'lab' | 'general'
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  category: string
  actionable: boolean
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: Date
}

export interface HardwareRequest {
  id: string
  studentId: string
  equipmentName: string
  description: string
  justification: string
  estimatedBeneficiaries: number
  relevantCourses: string[]
  estimatedCost: number
  status: 'pending' | 'approved' | 'rejected' | 'purchased'
  aiEvaluation?: HardwareEvaluation
  createdAt: Date
}

export interface HardwareEvaluation {
  benefitScore: number
  relevanceScore: number
  costEffectivenessScore: number
  recommendation: 'approve' | 'reject' | 'defer'
  reasoning: string
}

export interface SubstituteRequest {
  id: string
  originalProfessorId: string
  courseId: string
  date: Date
  reason: string
  status: 'pending' | 'assigned' | 'completed'
  assignedProfessorId?: string
  aiRecommendations?: SubstituteRecommendation[]
}

export interface SubstituteRecommendation {
  professorId: string
  professorName: string
  matchScore: number
  scoreBreakdown: {
    expertise: number
    schedule: number
    rating: number
    fairness: number
    department: number
  }
}

// Gamification Types
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'achievement' | 'streak' | 'mastery' | 'exploration' | 'community'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
  progress?: number
  requirement: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  xpReward: number
  badge?: Badge
  completedAt?: Date
}

// Schedule Types
export interface CourseSchedule {
  dayOfWeek: number
  startTime: string
  endTime: string
  room: string
  type: 'lecture' | 'lab' | 'tutorial'
}

// Analytics Types
export interface StudentAnalytics {
  studentId: string
  overallProgress: number
  conceptMastery: Record<string, number>
  weeklyActivity: number[]
  assessmentTrend: number[]
  strengthAreas: string[]
  improvementAreas: string[]
  predictedGrade?: string
  riskLevel: 'low' | 'medium' | 'high'
}

export interface CourseAnalytics {
  courseId: string
  averageScore: number
  scoreDistribution: number[]
  topicMastery: Record<string, number>
  atRiskStudents: string[]
  feedbackSummary: FeedbackSummary
}

export interface FeedbackSummary {
  totalCount: number
  sentimentBreakdown: Record<string, number>
  topCategories: string[]
  actionableInsights: string[]
}

// ---------------------------------------------------------
// NEW Institutional Intelligence Types (Phase 2)
// ---------------------------------------------------------

export interface AccreditationDashboard {
  readinessScore: number
  completedAreas: string[]
  pendingAreas: string[]
  gaps: string[]
}

export interface COPOMapping {
  coId: string
  poId: string
  correlationLevel: number // 1, 2, 3
}

export interface AttainmentLevel {
  courseId: string
  overallAttainment: number
  coBreakdown: Record<string, number>
}

export interface SyllabusCoverage {
  courseId: string
  overallCoverage: number
  unitCoverage: Record<string, number>
  status: 'on_track' | 'lagging' | 'ahead'
}

export interface ComprehensionReport {
  courseId: string
  coverage: number
  comprehension: number
  gap: number
  weakTopics: string[]
}

export interface TeachingIntelligenceScore {
  professorId: string
  compositeScore: number
  components: {
    syllabusCoverage: number
    studentComprehension: number
    feedbackSentiment: number
    activity: number
  }
}

export interface StaffPerformanceOverview {
  professorId: string
  trend: 'improving' | 'stable' | 'declining'
  historicalScores: number[]
}

