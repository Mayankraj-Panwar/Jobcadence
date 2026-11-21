# Technical Specification: Career Pivot Coach (PS 25 Architecture)
**Base Repository:** Samarth Sarathi (React + TypeScript + Tailwind + FastAPI)
**Target Deliverable:** Closed-Loop Career Transition & Skill-Gap Coaching Platform

---

## 1. System Constitution & Non-Negotiable Constraints
1. **Zero-Trust AI Execution:** All Gemini API calls, prompt templates, rubric weighting calculations, and PDF text parsing MUST reside exclusively inside the Python FastAPI backend (`main.py`). Never expose `GEMINI_API_KEY` or prompt logic in React/TypeScript files.
2. **Deterministic Structured Outputs:** Every FastAPI endpoint calling `gemini-2.5-flash` via the `google-genai` SDK MUST enforce `response_mime_type="application/json"` paired with a Pydantic `response_schema`. Do NOT use fragile string-slicing (`raw.find("{")`).
3. **Single Source of Truth on Frontend:** All pages (`/intake`, `/dashboard`, `/projects`, `/verify-skills`, `/applications`) MUST read and mutate state exclusively through a unified `CareerContext` backed by `localStorage` (`key: "career_pivot_state_v1"`). Hardcoded mock arrays in `Dashboard.tsx` must be replaced by context selectors.
4. **Design System Preservation:** Retain existing Tailwind CSS tokens, `shadcn/ui` primitives (`Card`, `Badge`, `Button`, `Avatar`), `Framer Motion` transitions, `VerifiedBadge`, `EmptyState`, and the `<LearningCurve />` chart component.

---

## 2. Shared Data Contracts (Frontend & Backend Alignment)

### 2.1 TypeScript State Schema (`src/types/career.ts`)
Create this exact type definition file to prevent type mismatches across components:

```typescript
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
  status: "Applied" | "Screen" | "Interview" | "Rejected" | "Offer";
  date_applied: string;
}

export interface ApplicationInsights {
  best_performing_variant: string;
  conversion_summary: string;
  strategic_pivots: string[];
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
  verifiedSkills: {
    id: string;
    skill: string;
    score: number;
    confidence: number;
    verifiedAt: string;
  }[];
  weeklyPlan: WeekModule[];
  portfolioProjects: PortfolioProject[];
  interviewHistory: InterviewRecord[];
  applications: JobApplication[];
  applicationInsights: ApplicationInsights | null;
  lastRecalibrationAlert: string | null;
}