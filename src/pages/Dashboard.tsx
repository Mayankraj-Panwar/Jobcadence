import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BadgeCheck, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  AlertTriangle, 
  ArrowRight, 
  Briefcase, 
  Layers, 
  X,
  RefreshCw,
  FolderKanban,
  FileSearch,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { EmptyState } from "@/components/ui/empty-state";
import LearningCurve from "@/components/ui/learning-curve";
import { useCareer } from "@/contexts/CareerContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, dismissRecalibrationAlert, completeProject } = useCareer();

  // Compute Target Readiness based on match score and verified skills
  const targetReadiness = Math.min(
    100,
    Math.round(state.match_score * 0.7 + state.verified_badges.length * 6)
  );

  // Transform weekly plan into LearningCurve milestones and trend data
  const learningCurveSkills = state.missing_skills.length > 0 
    ? state.missing_skills 
    : ["RAG Systems", "LLM Agents", "Vector Embeddings", "FastAPI Serving"];

  const baseDate = new Date();
  const milestones = state.weekly_plan.map((item, idx) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (4 - item.week) * 7);
    return {
      id: `ms-${idx}`,
      date: d.toISOString().split("T")[0],
      title: `Week ${item.week}: ${item.focus_skill}`,
      description: item.milestone,
      type: (item.recalibrated ? "achievement" : "project") as "achievement" | "project",
      skill: item.focus_skill
    };
  });

  // Trend progression points
  const overallData = [
    { date: "W-4", level: Math.max(20, state.match_score - 35), skill: "Overall" },
    { date: "W-3", level: Math.max(35, state.match_score - 22), skill: "Overall" },
    { date: "W-2", level: Math.max(48, state.match_score - 12), skill: "Overall" },
    { date: "W-1", level: Math.max(55, state.match_score - 5), skill: "Overall" },
    { date: "Current", level: state.match_score, skill: "Overall" },
    { date: "Projected", level: Math.min(100, state.match_score + 18), skill: "Overall" }
  ];

  const skillData: Record<string, { date: string; level: number; skill: string }[]> = {};
  learningCurveSkills.forEach((sk, i) => {
    const base = 40 + (i * 7);
    skillData[sk] = [
      { date: "W-4", level: Math.max(25, base - 25), skill: sk },
      { date: "W-2", level: Math.max(45, base - 10), skill: sk },
      { date: "Current", level: Math.min(95, base + (state.verified_badges.some(b => b.skill.includes(sk)) ? 25 : 5)), skill: sk },
      { date: "Target", level: 95, skill: sk }
    ];
  });

  const externalContributions = [
    {
      id: "ec-1",
      date: new Date().toISOString().split("T")[0],
      platform: "github" as const,
      type: "pull_request" as const,
      title: "Hybrid RAG Pipeline with Cross-Encoder",
      description: "Added reciprocal rank fusion and vector caching module",
      skill: "RAG Architecture",
      details: { commits: 14, repo: "career-pivot/rag-agent" }
    },
    {
      id: "ec-2",
      date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
      platform: "github" as const,
      type: "contest" as const,
      title: "Agentic Tool-Calling Benchmark",
      description: "Validated structured Pydantic tool responses in sandbox",
      skill: "LLM Agents",
      details: { rating: 1850 }
    }
  ];

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Recalibration Alert Banner */}
        <AnimatePresence>
          {state.has_recalibrated && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 backdrop-blur-md flex items-start justify-between gap-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-400 text-base flex items-center gap-2">
                      <span>Roadmap Recalibrated</span>
                      <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs">
                        Closed-Loop AI
                      </Badge>
                    </h4>
                    <p className="text-sm text-foreground/90 mt-1">
                      {state.recalibration_message ||
                        "A recent interview scored below 70%. Your transition roadmap has been automatically recalibrated with an urgent Week 1 Remediation module."}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissRecalibrationAlert}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header / Current Goal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Transition Goal</span>
              <span>&bull;</span>
              <span className="text-foreground font-medium">{state.current_role}</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-bold">{state.target_role}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Career Pivot Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/intake")}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
              <span>Update Gap Intake</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/verify-skills")}
              className="gap-2 shadow-glow"
            >
              <BadgeCheck className="w-4 h-4" />
              <span>Verify Next Skill</span>
            </Button>
          </div>
        </div>

        {/* 3 Core Stats Cards (Role Match %, Target Readiness, Active Streak) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1. Role Match % */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-xl border border-border/40 bg-card shadow-card premium-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Role Match
                    </p>
                    <h3 className="text-4xl font-extrabold mt-2 text-foreground">
                      {state.match_score}<span className="text-xl text-primary">%</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on AI gap analysis against target requirements
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="w-full bg-muted/40 h-2 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${state.match_score}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Target Readiness */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="rounded-xl border border-border/40 bg-card shadow-card premium-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Target Readiness
                    </p>
                    <h3 className="text-4xl font-extrabold mt-2 text-foreground">
                      {targetReadiness}<span className="text-xl text-emerald-500">%</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      Weighted by verified badges &amp; portfolio deliverables
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="w-full bg-muted/40 h-2 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${targetReadiness}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. Active Streak */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="rounded-xl border border-border/40 bg-card shadow-card premium-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Active Streak
                    </p>
                    <h3 className="text-4xl font-extrabold mt-2 text-foreground">
                      {state.streak} <span className="text-xl text-orange-500">Days</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      Consistent sprint execution &amp; verification cadence
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-glow">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="w-full bg-muted/40 h-2 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (state.streak / 7) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 4-Week Dynamic Recalibrated Roadmap */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Closed-Loop 4-Week Transition Roadmap</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Roadmap automatically adapts when mock interview or project benchmarks change.
              </p>
            </div>
            {state.weekly_plan.some(p => p.recalibrated) && (
              <Badge variant="outline" className="border-amber-500 text-amber-500 gap-1.5 px-3 py-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Recalibrated with Remediation</span>
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.weekly_plan.map((item) => (
              <Card
                key={`week-${item.week}-${item.focus_skill}`}
                className={`rounded-xl border transition-all duration-300 ${
                  item.recalibrated
                    ? "border-amber-500/60 bg-amber-500/5 shadow-md ring-1 ring-amber-500/30"
                    : "border-border/50 bg-card hover:border-primary/40 shadow-card"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Week {item.week}
                    </span>
                    {item.recalibrated ? (
                      <Badge className="bg-amber-500 text-black text-[10px] font-bold">
                        Remediation
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Sprint
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold line-clamp-1">
                    {item.focus_skill}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {item.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{task}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <p className="text-[11px] font-semibold text-foreground/90 leading-tight">
                      Milestone:
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 italic">
                      &ldquo;{item.milestone}&rdquo;
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Curve Chart Visualization */}
        <div className="mb-8">
          <LearningCurve
            skills={learningCurveSkills}
            overallData={overallData}
            skillData={skillData}
            milestones={milestones}
            externalContributions={externalContributions}
          />
        </div>

        {/* AI Verified Badges Section */}
        <div className="mb-8">
          <Card className="rounded-xl border border-border/40 bg-card shadow-card premium-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>AI-Verified Skill Badges</span>
                </CardTitle>
                <CardDescription>
                  Earned via scenario-based technical interviews &amp; verified portfolio deliverables
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/verify-skills")}
                className="gap-1.5"
              >
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span>Verify a Skill</span>
              </Button>
            </CardHeader>
            <CardContent>
              {state.verified_badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {state.verified_badges.map((badge) => (
                    <VerifiedBadge
                      key={badge.id}
                      skill={badge.skill}
                      score={badge.score}
                      confidence={badge.confidence}
                      verifiedAt={badge.verifiedAt}
                      animate
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BadgeCheck}
                  title="No verified badges yet"
                  description="Complete a scenario-based AI interview to earn verified skill proof."
                  actionLabel="Verify a Skill"
                  onAction={() => navigate("/verify-skills")}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Transition Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer border-border/50 bg-card hover:border-primary/50 hover:shadow-card-hover transition-all"
            onClick={() => navigate("/verify-skills")}
          >
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Scenario Mock Interview</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Test your skills on Gemini-evaluated edge cases &amp; trigger closed-loop recalibration.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-border/50 bg-card hover:border-primary/50 hover:shadow-card-hover transition-all"
            onClick={() => navigate("/projects")}
          >
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Portfolio Proof Projects</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Mark projects done to boost Role Match by +7% and log verifiable deliverables.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-border/50 bg-card hover:border-primary/50 hover:shadow-card-hover transition-all"
            onClick={() => navigate("/applications")}
          >
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Application Tracker &amp; Analytics</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Analyze variant conversion rates and optimize your technical positioning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
