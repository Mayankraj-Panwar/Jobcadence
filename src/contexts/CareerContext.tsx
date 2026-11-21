import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WeeklyPlanItem {
  week: number;
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
}

export interface VerifiedBadgeData {
  id: string;
  skill: string;
  score: number;
  confidence: "high" | "medium" | "low";
  verifiedAt: string;
}

export interface ApplicationItem {
  id: string;
  company: string;
  role_variant: string;
  status: string;
  date: string;
}

export interface ApplicationInsights {
  best_performing_variant: string;
  conversion_summary: string;
  strategic_pivots: string[];
}

export interface RubricBreakdown {
  technical_accuracy: number;
  practical_depth: number;
  edge_case_reasoning: number;
  communication_clarity: number;
}

export interface InterviewEvaluation {
  score: number;
  rubric: RubricBreakdown;
  feedback: string;
  recalibrate_plan: boolean;
  remediation_tasks: string[];
}

export interface CareerState {
  current_role: string;
  target_role: string;
  target_jd: string;
  resume_text: string;
  match_score: number;
  missing_skills: string[];
  weekly_plan: WeeklyPlanItem[];
  portfolio_projects: PortfolioProject[];
  verified_badges: VerifiedBadgeData[];
  applications: ApplicationItem[];
  insights: ApplicationInsights | null;
  has_recalibrated: boolean;
  recalibration_message: string;
  streak: number;
}

interface CareerContextType {
  state: CareerState;
  updateFromGapAnalysis: (data: {
    current_role: string;
    target_role: string;
    match_score: number;
    missing_skills: string[];
    weekly_plan: WeeklyPlanItem[];
    portfolio_projects: PortfolioProject[];
  }) => void;
  completeProject: (projectId: string) => void;
  recordInterviewResult: (skill: string, evalResult: InterviewEvaluation) => void;
  addApplication: (app: Omit<ApplicationItem, "id">) => void;
  updateApplicationStatus: (id: string, status: string) => void;
  setApplicationInsights: (insights: ApplicationInsights) => void;
  dismissRecalibrationAlert: () => void;
  loadSampleCareerPivot: () => void;
  resetState: () => void;
}

const STORAGE_KEY = "career_pivot_state";

export const defaultCareerState: CareerState = {
  current_role: "React Frontend Developer",
  target_role: "Applied AI Engineer",
  target_jd: "Seeking an Applied AI Engineer to design and deploy enterprise RAG pipelines, autonomous agentic loops, vector search backends, and fine-tuned LLM services with sub-second p95 latency.",
  resume_text: "5+ years building production web apps in React, TypeScript, Next.js, and Node.js. Experience integrating third-party REST APIs, state management, and real-time WebSockets. Looking to transition into AI Engineering and LLM application development.",
  match_score: 64,
  missing_skills: [
    "Retrieval-Augmented Generation (RAG)",
    "Vector Databases & Embeddings",
    "LLM Agent Orchestration",
    "Evaluation & Guardrails",
    "FastAPI & Model Serving"
  ],
  weekly_plan: [
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
  ],
  portfolio_projects: [
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
      completed: false
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
      completed: false
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
      completed: false
    }
  ],
  verified_badges: [
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
  ],
  applications: [
    {
      id: "app-1",
      company: "Anthropic Ecosystem Partner",
      role_variant: "Applied AI Engineer (RAG & Agents)",
      status: "Interview",
      date: "2026-11-12"
    },
    {
      id: "app-2",
      company: "Scale AI Infra",
      role_variant: "Applied AI Engineer (RAG & Agents)",
      status: "Offer",
      date: "2026-11-10"
    },
    {
      id: "app-3",
      company: "Pinecone Systems",
      role_variant: "Applied AI Engineer (RAG & Agents)",
      status: "Interview",
      date: "2026-11-14"
    },
    {
      id: "app-4",
      company: "Weights & Biases",
      role_variant: "Applied AI Engineer (RAG & Agents)",
      status: "Applied",
      date: "2026-11-17"
    },
    {
      id: "app-5",
      company: "Datadog Observability",
      role_variant: "Full-Stack AI Developer",
      status: "Rejected",
      date: "2026-11-05"
    },
    {
      id: "app-6",
      company: "Snowflake Cortex",
      role_variant: "Applied AI Engineer (RAG & Agents)",
      status: "Interview",
      date: "2026-11-16"
    },
    {
      id: "app-7",
      company: "Vercel AI Cloud",
      role_variant: "Full-Stack AI Developer",
      status: "Rejected",
      date: "2026-11-03"
    },
    {
      id: "app-8",
      company: "Cohere AI Labs",
      role_variant: "Applied AI Engineer (RAG & Agents)",
      status: "Applied",
      date: "2026-11-19"
    },
    {
      id: "app-9",
      company: "Replit Agentic Team",
      role_variant: "Full-Stack AI Developer",
      status: "Applied",
      date: "2026-11-18"
    }
  ],
  insights: null,
  has_recalibrated: false,
  recalibration_message: "",
  streak: 5
};

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CareerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist
        return { ...defaultCareerState, ...parsed };
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
    current_role: string;
    target_role: string;
    match_score: number;
    missing_skills: string[];
    weekly_plan: WeeklyPlanItem[];
    portfolio_projects: PortfolioProject[];
  }) => {
    setState((prev) => ({
      ...prev,
      current_role: data.current_role,
      target_role: data.target_role,
      match_score: data.match_score,
      missing_skills: data.missing_skills,
      weekly_plan: data.weekly_plan,
      portfolio_projects: data.portfolio_projects,
      has_recalibrated: false,
      recalibration_message: ""
    }));
  };

  const completeProject = (projectId: string) => {
    setState((prev) => {
      const project = prev.portfolio_projects.find((p) => p.id === projectId);
      if (!project || project.completed) return prev;

      const newMatchScore = Math.min(100, prev.match_score + 7);
      const updatedProjects = prev.portfolio_projects.map((p) =>
        p.id === projectId ? { ...p, completed: true } : p
      );

      const newBadge: VerifiedBadgeData = {
        id: `badge-${Date.now()}`,
        skill: project.skills_covered[0] || project.title,
        score: 95,
        confidence: "high",
        verifiedAt: new Date().toISOString().split("T")[0]
      };

      return {
        ...prev,
        match_score: newMatchScore,
        portfolio_projects: updatedProjects,
        verified_badges: [newBadge, ...prev.verified_badges],
        streak: prev.streak + 1
      };
    });
  };

  const recordInterviewResult = (skill: string, evalResult: InterviewEvaluation) => {
    setState((prev) => {
      // Closed-Loop Recalibration Rule:
      // If score < 70, recalibrate_plan is true -> prepend remediation module to Week 1
      if (evalResult.recalibrate_plan || evalResult.score < 70) {
        const remediationModuleTasks =
          evalResult.remediation_tasks && evalResult.remediation_tasks.length > 0
            ? evalResult.remediation_tasks
            : [
                `Targeted remediation: review fundamental patterns for ${skill}`,
                `Implement interactive proof-of-concept for ${skill}`,
                `Re-take verification interview after code completion`
              ];

        const updatedPlan: WeeklyPlanItem[] = [
          {
            week: 1,
            focus_skill: `[Recalibrated Focus] ${skill} Remediation`,
            tasks: remediationModuleTasks,
            milestone: `Master foundational & practical edge cases for ${skill}`,
            recalibrated: true
          },
          ...prev.weekly_plan.map((item) => ({
            ...item,
            week: item.week + 1
          }))
        ];

        return {
          ...prev,
          weekly_plan: updatedPlan,
          has_recalibrated: true,
          recalibration_message: `Evaluation for "${skill}" scored ${evalResult.score}%. Your 4-week roadmap has been automatically recalibrated with a Week 1 Remediation module.`
        };
      }

      // If score >= 70 -> add +5% to match_score and issue a verified badge
      const newScore = Math.min(100, prev.match_score + 5);
      const newBadge: VerifiedBadgeData = {
        id: `badge-${Date.now()}`,
        skill,
        score: evalResult.score,
        confidence: evalResult.score >= 85 ? "high" : "medium",
        verifiedAt: new Date().toISOString().split("T")[0]
      };

      return {
        ...prev,
        match_score: newScore,
        verified_badges: [newBadge, ...prev.verified_badges],
        streak: prev.streak + 1
      };
    });
  };

  const addApplication = (app: Omit<ApplicationItem, "id">) => {
    setState((prev) => ({
      ...prev,
      applications: [
        {
          ...app,
          id: `app-${Date.now()}`
        },
        ...prev.applications
      ]
    }));
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
      insights
    }));
  };

  const dismissRecalibrationAlert = () => {
    setState((prev) => ({
      ...prev,
      has_recalibrated: false
    }));
  };

  const loadSampleCareerPivot = () => {
    setState(defaultCareerState);
  };

  const resetState = () => {
    setState(defaultCareerState);
    try {
      localStorage.removeItem(STORAGE_KEY);
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
