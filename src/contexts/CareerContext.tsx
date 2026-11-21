import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  RubricBreakdown,
  WeekModule,
  PortfolioProject,
  InterviewRecord,
  JobApplication,
  ApplicationInsights,
  VerifiedSkillBadge,
  InterviewEvaluation,
  CareerState,
  WeeklyPlanItem,
  VerifiedBadgeData,
  ApplicationItem
} from "@/types/career";

export type {
  RubricBreakdown,
  WeekModule,
  PortfolioProject,
  InterviewRecord,
  JobApplication,
  ApplicationInsights,
  VerifiedSkillBadge,
  InterviewEvaluation,
  CareerState,
  WeeklyPlanItem,
  VerifiedBadgeData,
  ApplicationItem
};

interface CareerContextType {
  state: CareerState;
  updateFromGapAnalysis: (data: {
    current_role?: string;
    currentRole?: string;
    target_role?: string;
    targetRole?: string;
    match_score?: number;
    matchScore?: number;
    missing_skills?: string[];
    missingSkills?: string[];
    weekly_plan?: WeekModule[];
    weeklyPlan?: WeekModule[];
    portfolio_projects?: PortfolioProject[];
    portfolioProjects?: PortfolioProject[];
  }) => void;
  completeProject: (projectId: string) => void;
  recordInterviewResult: (skill: string, evalResult: InterviewEvaluation) => void;
  addApplication: (app: Omit<JobApplication, "id">) => void;
  updateApplicationStatus: (id: string, status: string) => void;
  setApplicationInsights: (insights: ApplicationInsights) => void;
  dismissRecalibrationAlert: () => void;
  loadSampleCareerPivot: () => void;
  resetState: () => void;
}

const STORAGE_KEY = "career_pivot_state_v1";
const LEGACY_STORAGE_KEY = "career_pivot_state";

const initialWeeklyPlan: WeekModule[] = [
  {
    week: 1,
    focus_skill: "RAG Architecture & Vector Indexing",
    tasks: [
      "Chunking strategies & recursive character splitters with LangChain/LlamaIndex",
      "Dense retrieval setup with Qdrant and hybrid BM25 search",
      "Cross-encoder reranking integration to boost top-k relevance"
    ],
    milestone: "Live RAG pipeline querying technical documentation with citations",
    recalibrated: false
  },
  {
    week: 2,
    focus_skill: "Autonomous Multi-Agent Loops & Tool Calling",
    tasks: [
      "Implement ReAct cycles with Pydantic functional tool schemas",
      "Session memory management with sliding windows & summarizers",
      "Subagent spawning and sandboxed code execution guards"
    ],
    milestone: "Self-correcting research agent capable of multi-step internet searches",
    recalibrated: false
  },
  {
    week: 3,
    focus_skill: "LLM Observability, Guardrails & Evals",
    tasks: [
      "RAG Triad metrics (faithfulness, answer relevance, context recall)",
      "Semantic cache with Redis to cut inference latency by 40%",
      "NeMo Guardrails implementation to block prompt injection"
    ],
    milestone: "CI/CD eval pipeline blocking regressions under 0.85 faithfulness",
    recalibrated: false
  },
  {
    week: 4,
    focus_skill: "Production Model Serving & Streaming Systems",
    tasks: [
      "Asynchronous streaming endpoints with FastAPI and SSE",
      "Dynamic batching and LiteLLM load balancing across providers",
      "Production Dockerization with health checks and Prometheus metrics"
    ],
    milestone: "Scalable LLM gateway handling 100+ concurrent requests",
    recalibrated: false
  }
];

const initialPortfolioProjects: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "Enterprise Hybrid RAG with Cross-Encoder Reranking",
    description: "Production-grade documentation QA engine combining sparse BM25 retrieval with Qdrant vector embeddings and Cohere reranker.",
    skills_covered: ["Vector Databases", "Hybrid Search", "Cohere Rerank", "FastAPI"],
    deliverable_checklist: [
      "Multi-stage document ingestion pipeline",
      "Qdrant collection indexing with payload filters",
      "FastAPI endpoint with <180ms p95 latency",
      "Benchmark report measuring NDCG@10 recall gain"
    ],
    completed: false,
    repo_url: "https://github.com/jobcadence/enterprise-hybrid-rag"
  },
  {
    id: "proj-2",
    title: "Self-Correcting Code Agent with Sandboxed Runner",
    description: "Autonomous programming agent that creates unit tests, executes code in isolated environments, analyzes tracebacks, and self-repairs.",
    skills_covered: ["LLM Agents", "Docker Sandbox", "Pydantic", "Self-Reflection"],
    deliverable_checklist: [
      "Stateful ReAct loop with dynamic budget limits",
      "Ephemeral container runner for safe execution",
      "Iterative error reflection prompt template",
      "Automated GitHub PR test runner integration"
    ],
    completed: false,
    repo_url: "https://github.com/jobcadence/self-correcting-code-agent"
  },
  {
    id: "proj-3",
    title: "LLM Gateway with Semantic Caching & Safety Guardrails",
    description: "High-throughput API gateway featuring Redis semantic caching, prompt injection defenses, and OpenTelemetry tracing.",
    skills_covered: ["Model Serving", "Redis", "Security Guardrails", "Observability"],
    deliverable_checklist: [
      "Redis semantic cache saving 35%+ token costs",
      "Input/output guardrails filtering toxic content and PII",
      "OpenTelemetry trace exports for latency breakdown",
      "Locust stress-test validation up to 400 RPS"
    ],
    completed: false,
    repo_url: "https://github.com/jobcadence/production-llm-gateway"
  }
];

const initialVerifiedBadges: VerifiedSkillBadge[] = [
  {
    id: "badge-init-1",
    skill: "React Architecture",
    score: 94,
    confidence: "high",
    verifiedAt: "2026-11-15"
  },
  {
    id: "badge-init-2",
    skill: "TypeScript Systems",
    score: 89,
    confidence: "high",
    verifiedAt: "2026-11-18"
  }
];

const initialApplications: JobApplication[] = [
  {
    id: "app-1",
    company: "Anthropic Ecosystem Partner",
    role_variant: "Applied AI Engineer (RAG & Agents)",
    status: "Interview",
    date_applied: "2026-11-12",
    date: "2026-11-12"
  },
  {
    id: "app-2",
    company: "Scale AI Infra",
    role_variant: "Applied AI Engineer (RAG & Agents)",
    status: "Offer",
    date_applied: "2026-11-10",
    date: "2026-11-10"
  },
  {
    id: "app-3",
    company: "Pinecone Systems",
    role_variant: "Applied AI Engineer (RAG & Agents)",
    status: "Interview",
    date_applied: "2026-11-14",
    date: "2026-11-14"
  },
  {
    id: "app-4",
    company: "Weights & Biases",
    role_variant: "Applied AI Engineer (RAG & Agents)",
    status: "Applied",
    date_applied: "2026-11-17",
    date: "2026-11-17"
  },
  {
    id: "app-5",
    company: "Datadog Observability",
    role_variant: "Full-Stack AI Developer",
    status: "Rejected",
    date_applied: "2026-11-05",
    date: "2026-11-05"
  },
  {
    id: "app-6",
    company: "Snowflake Cortex",
    role_variant: "Applied AI Engineer (RAG & Agents)",
    status: "Interview",
    date_applied: "2026-11-16",
    date: "2026-11-16"
  },
  {
    id: "app-7",
    company: "Vercel AI Cloud",
    role_variant: "Full-Stack AI Developer",
    status: "Rejected",
    date_applied: "2026-11-03",
    date: "2026-11-03"
  },
  {
    id: "app-8",
    company: "Cohere AI Labs",
    role_variant: "Applied AI Engineer (RAG & Agents)",
    status: "Applied",
    date_applied: "2026-11-19",
    date: "2026-11-19"
  },
  {
    id: "app-9",
    company: "Replit Agentic Team",
    role_variant: "Full-Stack AI Developer",
    status: "Applied",
    date_applied: "2026-11-18",
    date: "2026-11-18"
  }
];

export const defaultCareerState: CareerState = {
  hasCompletedIntake: true,
  currentRole: "React Frontend Developer",
  targetRole: "Applied AI Engineer",
  targetJD: "Seeking an Applied AI Engineer to design and deploy enterprise RAG pipelines, autonomous agentic loops, vector search backends, and fine-tuned LLM services with sub-second p95 latency.",
  resumeText: "5+ years building production web apps in React, TypeScript, Next.js, and Node.js. Experience integrating third-party REST APIs, state management, and real-time WebSockets. Looking to transition into AI Engineering and LLM application development.",
  matchScore: 64,
  streakDays: 5,
  missingSkills: [
    "Retrieval-Augmented Generation (RAG)",
    "Vector Databases & Embeddings",
    "LLM Agent Orchestration",
    "Evaluation & Guardrails",
    "FastAPI & Model Serving"
  ],
  verifiedSkills: initialVerifiedBadges,
  weeklyPlan: initialWeeklyPlan,
  portfolioProjects: initialPortfolioProjects,
  interviewHistory: [
    {
      id: "interview-init-1",
      skill: "React Architecture",
      type: "technical",
      score: 94,
      rubric: {
        technical_accuracy: 95,
        practical_depth: 92,
        edge_case_reasoning: 90,
        communication_clarity: 98
      },
      feedback: "Strong architectural mastery of component design and state lifecycles.",
      recalibrate_plan: false,
      date: "2026-11-15"
    }
  ],
  applications: initialApplications,
  applicationInsights: null,
  lastRecalibrationAlert: null,

  // Compatibility aliases
  current_role: "React Frontend Developer",
  target_role: "Applied AI Engineer",
  target_jd: "Seeking an Applied AI Engineer to design and deploy enterprise RAG pipelines, autonomous agentic loops, vector search backends, and fine-tuned LLM services with sub-second p95 latency.",
  resume_text: "5+ years building production web apps in React, TypeScript, Next.js, and Node.js. Experience integrating third-party REST APIs, state management, and real-time WebSockets. Looking to transition into AI Engineering and LLM application development.",
  match_score: 64,
  streak: 5,
  missing_skills: [
    "Retrieval-Augmented Generation (RAG)",
    "Vector Databases & Embeddings",
    "LLM Agent Orchestration",
    "Evaluation & Guardrails",
    "FastAPI & Model Serving"
  ],
  verified_badges: initialVerifiedBadges,
  weekly_plan: initialWeeklyPlan,
  portfolio_projects: initialPortfolioProjects,
  insights: null,
  has_recalibrated: false,
  recalibration_message: ""
};

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CareerState>(() => {
    try {
      // 1. Try modern storage key
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize fields between camelCase and snake_case
        const currentRole = parsed.currentRole || parsed.current_role || defaultCareerState.currentRole;
        const targetRole = parsed.targetRole || parsed.target_role || defaultCareerState.targetRole;
        const targetJD = parsed.targetJD || parsed.target_jd || defaultCareerState.targetJD;
        const resumeText = parsed.resumeText || parsed.resume_text || defaultCareerState.resumeText;
        const matchScore = typeof parsed.matchScore === "number" ? parsed.matchScore : (parsed.match_score ?? defaultCareerState.matchScore);
        const streakDays = typeof parsed.streakDays === "number" ? parsed.streakDays : (parsed.streak ?? defaultCareerState.streakDays);
        const missingSkills = parsed.missingSkills || parsed.missing_skills || defaultCareerState.missingSkills;
        const verifiedSkills = parsed.verifiedSkills || parsed.verified_badges || defaultCareerState.verifiedSkills;
        const weeklyPlan = parsed.weeklyPlan || parsed.weekly_plan || defaultCareerState.weeklyPlan;
        const portfolioProjects = parsed.portfolioProjects || parsed.portfolio_projects || defaultCareerState.portfolioProjects;
        const interviewHistory = parsed.interviewHistory || defaultCareerState.interviewHistory;
        const applications = parsed.applications || defaultCareerState.applications;
        const applicationInsights = parsed.applicationInsights || parsed.insights || null;
        const hasRecalibrated = parsed.has_recalibrated ?? false;
        const recalibrationMessage = parsed.lastRecalibrationAlert || parsed.recalibration_message || "";

        return {
          hasCompletedIntake: parsed.hasCompletedIntake ?? true,
          currentRole,
          targetRole,
          targetJD,
          resumeText,
          matchScore,
          streakDays,
          missingSkills,
          verifiedSkills,
          weeklyPlan,
          portfolioProjects,
          interviewHistory,
          applications,
          applicationInsights,
          lastRecalibrationAlert: recalibrationMessage || null,

          // Compatibility fields
          current_role: currentRole,
          target_role: targetRole,
          target_jd: targetJD,
          resume_text: resumeText,
          match_score: matchScore,
          streak: streakDays,
          missing_skills: missingSkills,
          verified_badges: verifiedSkills,
          weekly_plan: weeklyPlan,
          portfolio_projects: portfolioProjects,
          insights: applicationInsights,
          has_recalibrated: hasRecalibrated,
          recalibration_message: recalibrationMessage
        };
      }
    } catch (e) {
      console.warn("Failed to read career state from localStorage", e);
    }
    return defaultCareerState;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save career state to localStorage", e);
    }
  }, [state]);

  const updateFromGapAnalysis = (data: {
    current_role?: string;
    currentRole?: string;
    target_role?: string;
    targetRole?: string;
    match_score?: number;
    matchScore?: number;
    missing_skills?: string[];
    missingSkills?: string[];
    weekly_plan?: WeekModule[];
    weeklyPlan?: WeekModule[];
    portfolio_projects?: PortfolioProject[];
    portfolioProjects?: PortfolioProject[];
  }) => {
    setState((prev) => {
      const currentRole = data.currentRole || data.current_role || prev.currentRole;
      const targetRole = data.targetRole || data.target_role || prev.targetRole;
      const matchScore = typeof data.matchScore === "number" ? data.matchScore : (data.match_score ?? prev.matchScore);
      const missingSkills = data.missingSkills || data.missing_skills || prev.missingSkills;
      const weeklyPlan = data.weeklyPlan || data.weekly_plan || prev.weeklyPlan;
      const portfolioProjects = data.portfolioProjects || data.portfolio_projects || prev.portfolioProjects;

      return {
        ...prev,
        hasCompletedIntake: true,
        currentRole,
        targetRole,
        matchScore,
        missingSkills,
        weeklyPlan,
        portfolioProjects,
        has_recalibrated: false,
        recalibration_message: "",
        lastRecalibrationAlert: null,

        // Sync compatibility
        current_role: currentRole,
        target_role: targetRole,
        match_score: matchScore,
        missing_skills: missingSkills,
        weekly_plan: weeklyPlan,
        portfolio_projects: portfolioProjects
      };
    });
  };

  const completeProject = (projectId: string) => {
    setState((prev) => {
      const project = prev.portfolioProjects.find((p) => p.id === projectId);
      if (!project || project.completed) return prev;

      const newMatchScore = Math.min(100, prev.matchScore + 7);
      const updatedProjects = prev.portfolioProjects.map((p) =>
        p.id === projectId ? { ...p, completed: true } : p
      );

      const newBadge: VerifiedSkillBadge = {
        id: `badge-${Date.now()}`,
        skill: project.skills_covered[0] || project.title,
        score: 95,
        confidence: "high",
        verifiedAt: new Date().toISOString().split("T")[0]
      };

      const updatedBadges = [newBadge, ...prev.verifiedSkills];
      const newStreak = prev.streakDays + 1;

      return {
        ...prev,
        matchScore: newMatchScore,
        portfolioProjects: updatedProjects,
        verifiedSkills: updatedBadges,
        streakDays: newStreak,

        // Sync compatibility
        match_score: newMatchScore,
        portfolio_projects: updatedProjects,
        verified_badges: updatedBadges,
        streak: newStreak
      };
    });
  };

  const recordInterviewResult = (skill: string, evalResult: InterviewEvaluation) => {
    setState((prev) => {
      const isFail = evalResult.recalibrate_plan || evalResult.score < 70;

      const newRecord: InterviewRecord = {
        id: `interview-${Date.now()}`,
        skill,
        type: "technical",
        score: evalResult.score,
        rubric: evalResult.rubric,
        feedback: evalResult.feedback,
        recalibrate_plan: isFail,
        date: new Date().toISOString().split("T")[0]
      };

      const updatedHistory = [newRecord, ...(prev.interviewHistory || [])];

      // Closed-Loop Recalibration Rule:
      // If score < 70, recalibrate_plan is true -> prepend remediation module to Week 1
      if (isFail) {
        const remediationModuleTasks =
          evalResult.remediation_tasks && evalResult.remediation_tasks.length > 0
            ? evalResult.remediation_tasks
            : [
                `Targeted remediation: review fundamental patterns for ${skill}`,
                `Implement interactive proof-of-concept for ${skill}`,
                `Re-take verification interview after code completion`
              ];

        const updatedPlan: WeekModule[] = [
          {
            week: 1,
            focus_skill: `[Recalibrated Focus] ${skill} Remediation`,
            tasks: remediationModuleTasks,
            milestone: `Master foundational & practical edge cases for ${skill}`,
            recalibrated: true
          },
          ...prev.weeklyPlan.map((item) => ({
            ...item,
            week: item.week + 1
          }))
        ];

        const message = `Evaluation for "${skill}" scored ${evalResult.score}%. Your 4-week roadmap has been automatically recalibrated with a Week 1 Remediation module.`;

        return {
          ...prev,
          weeklyPlan: updatedPlan,
          interviewHistory: updatedHistory,
          has_recalibrated: true,
          recalibration_message: message,
          lastRecalibrationAlert: message,

          // Sync compatibility
          weekly_plan: updatedPlan
        };
      }

      // If score >= 70 -> add +5% to matchScore and issue a verified badge
      const newScore = Math.min(100, prev.matchScore + 5);
      const newBadge: VerifiedSkillBadge = {
        id: `badge-${Date.now()}`,
        skill,
        score: evalResult.score,
        confidence: evalResult.score >= 85 ? "high" : "medium",
        verifiedAt: new Date().toISOString().split("T")[0]
      };

      const updatedBadges = [newBadge, ...prev.verifiedSkills];
      const newStreak = prev.streakDays + 1;

      return {
        ...prev,
        matchScore: newScore,
        verifiedSkills: updatedBadges,
        streakDays: newStreak,
        interviewHistory: updatedHistory,

        // Sync compatibility
        match_score: newScore,
        verified_badges: updatedBadges,
        streak: newStreak
      };
    });
  };

  const addApplication = (app: Omit<JobApplication, "id">) => {
    setState((prev) => {
      const newApp: JobApplication = {
        ...app,
        id: `app-${Date.now()}`,
        date_applied: app.date_applied || app.date || new Date().toISOString().split("T")[0],
        date: app.date || app.date_applied || new Date().toISOString().split("T")[0]
      };
      return {
        ...prev,
        applications: [newApp, ...prev.applications]
      };
    });
  };

  const updateApplicationStatus = (id: string, status: string) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === id ? { ...a, status } : a
      )
    }));
  };

  const setApplicationInsights = (insights: ApplicationInsights) => {
    setState((prev) => ({
      ...prev,
      applicationInsights: insights,
      insights
    }));
  };

  const dismissRecalibrationAlert = () => {
    setState((prev) => ({
      ...prev,
      has_recalibrated: false,
      lastRecalibrationAlert: null
    }));
  };

  const loadSampleCareerPivot = () => {
    setState(defaultCareerState);
  };

  const resetState = () => {
    setState(defaultCareerState);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {}
  };

  return (
    <CareerContext.Provider
      value={{
        state,
        updateFromGapAnalysis,
        completeProject,
        recordInterviewResult,
        addApplication,
        updateApplicationStatus,
        setApplicationInsights,
        dismissRecalibrationAlert,
        loadSampleCareerPivot,
        resetState
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error("useCareer must be used within a CareerProvider");
  }
  return context;
};
