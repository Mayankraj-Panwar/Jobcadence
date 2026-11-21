export interface RubricBreakdown {
  technical_accuracy: number;     // 0-100
  practical_depth: number;        // 0-100
  edge_case_reasoning: number;    // 0-100
  communication_clarity: number;  // 0-100
}

export interface WeekModule {
  week: number;                   // 1 to 4
  focus_skill: string;
  tasks: string[];
  milestone: string;
  recalibrated: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  skills_covered: string[];
  deliverable_checklist: string[];
  completed: boolean;
  repo_url?: string;
}

export interface InterviewRecord {
  id: string;
  skill: string;
  type: "technical" | "behavioral";
  score: number;
  rubric: RubricBreakdown;
  feedback: string;
  recalibrate_plan: boolean;
  date: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role_variant: string;           // e.g., "Applied AI Engineer" vs "Full-Stack Product Dev"
  status: "Applied" | "Screen" | "Interview" | "Rejected" | "Offer" | string;
  date_applied: string;
  date?: string;                  // compatibility with legacy views
}

export interface ApplicationInsights {
  best_performing_variant: string;
  conversion_summary: string;
  strategic_pivots: string[];
}

export interface VerifiedSkillBadge {
  id: string;
  skill: string;
  score: number;
  confidence: "high" | "medium" | "low" | number;
  verifiedAt: string;
}

export interface InterviewEvaluation {
  score: number;
  rubric: RubricBreakdown;
  feedback: string;
  recalibrate_plan: boolean;
  remediation_tasks: string[];
}

export interface CareerState {
  hasCompletedIntake: boolean;
  currentRole: string;
  targetRole: string;
  targetJD: string;
  resumeText: string;
  matchScore: number;             // 0-100, dynamically recalculated
  streakDays: number;
  missingSkills: string[];
  verifiedSkills: VerifiedSkillBadge[];
  weeklyPlan: WeekModule[];
  portfolioProjects: PortfolioProject[];
  interviewHistory: InterviewRecord[];
  applications: JobApplication[];
  applicationInsights: ApplicationInsights | null;
  lastRecalibrationAlert: string | null;

  // Compatibility aliases for existing components
  current_role: string;
  target_role: string;
  target_jd: string;
  resume_text: string;
  match_score: number;
  streak: number;
  missing_skills: string[];
  verified_badges: VerifiedSkillBadge[];
  weekly_plan: WeekModule[];
  portfolio_projects: PortfolioProject[];
  insights: ApplicationInsights | null;
  has_recalibrated: boolean;
  recalibration_message: string;
}

// Backward-compatible type aliases
export type WeeklyPlanItem = WeekModule;
export type VerifiedBadgeData = VerifiedSkillBadge;
export type ApplicationItem = JobApplication;
