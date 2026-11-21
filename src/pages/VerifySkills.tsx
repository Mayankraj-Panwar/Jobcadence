import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BadgeCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Loader2, 
  BookOpen, 
  Cpu, 
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ScoreRing } from "@/components/ui/score-ring";
import { useNavigate } from "react-router-dom";
import { useCareer } from "@/contexts/CareerContext";
import { generateSkillQuestions, evaluateFullInterview, InterviewEvaluationResult } from "@/lib/geminiService";
import { toast } from "sonner";

export default function VerifySkills() {
  const navigate = useNavigate();
  const { state, recordInterviewResult } = useCareer();

  // Pre-populate with missing_skills from CareerContext
  const availableSkills = state.missing_skills.length > 0 
    ? state.missing_skills 
    : [
        "Retrieval-Augmented Generation (RAG)",
        "Vector Databases & Embeddings",
        "LLM Agent Orchestration",
        "Evaluation & Guardrails",
        "FastAPI & Model Serving"
      ];

  const [selectedSkill, setSelectedSkill] = useState<string>(availableSkills[0]);
  const [interviewState, setInterviewState] = useState<"idle" | "loading_questions" | "interviewing" | "evaluating" | "completed">("idle");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<InterviewEvaluationResult | null>(null);

  // Update selectedSkill if availableSkills change
  useEffect(() => {
    if (availableSkills.length > 0 && !selectedSkill) {
      setSelectedSkill(availableSkills[0]);
    }
  }, [availableSkills, selectedSkill]);

  const handleStartInterview = async () => {
    if (!selectedSkill) {
      toast.error("Please select a skill to verify");
      return;
    }

    setInterviewState("loading_questions");
    try {
      const fetchedQuestions = await generateSkillQuestions(selectedSkill, state.target_role);
      const finalQuestions = fetchedQuestions.slice(0, 3);
      setQuestions(finalQuestions);
      setAnswers(["", "", ""]);
      setCurrentQuestionIndex(0);
      setCurrentAnswer("");
      setInterviewState("interviewing");
      toast.success(`Generated scenario questions for ${selectedSkill}!`);
    } catch (err) {
      console.error("Failed to generate questions:", err);
      toast.error("Could not fetch questions from server. Loading fallback questions.");
      setQuestions([
        `Explain how you architect and scale ${selectedSkill} in a production environment with low latency constraints.`,
        `Describe a critical edge case or failure mode with ${selectedSkill} and how your system detects and handles it.`,
        `How do you measure accuracy, evaluate regressions, and assert guardrails for ${selectedSkill}?`
      ]);
      setAnswers(["", "", ""]);
      setCurrentQuestionIndex(0);
      setCurrentAnswer("");
      setInterviewState("interviewing");
    }
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      toast.error("Please provide an answer before continuing");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(updatedAnswers[currentQuestionIndex + 1] || "");
    } else {
      handleSubmitInterview(updatedAnswers);
    }
  };

  const handleInsertSampleAnswer = (quality: "pass" | "fail") => {
    if (quality === "pass") {
      const comprehensive = `In our production system, we deployed a hybrid retrieval pipeline combining dense embeddings via Qdrant with sparse BM25 scoring, fused through Reciprocal Rank Fusion (RRF). We resolved latency spikes by adding Redis semantic caching with a cosine threshold of 0.94, which reduced upstream LLM calls by 38%. For edge cases like out-of-domain queries, we implemented an asynchronous classification guardrail that falls back to structured web search when confidence drops below 0.70. Automated evaluations run nightly using RAG Triad metrics in CI/CD, guaranteeing faithfulness > 0.88 before deployment.`;
      setCurrentAnswer(comprehensive);
    } else {
      const minimal = `I just use a basic vector DB and connect it to an LLM with try/catch.`;
      setCurrentAnswer(minimal);
    }
  };

  const handleSubmitInterview = async (finalAnswers: string[]) => {
    setInterviewState("evaluating");
    try {
      const evalResult = await evaluateFullInterview(questions, finalAnswers, {
        skill: selectedSkill,
        type: "technical",
      });

      setEvaluation(evalResult);
      recordInterviewResult(selectedSkill, evalResult);
      setInterviewState("completed");

      if (evalResult.score < 70) {
        toast.warning(`Scored ${evalResult.score}%. Closed-loop recalibration triggered: Week 1 roadmap updated!`);
      } else {
        toast.success(`Passed with ${evalResult.score}%! +5% added to Match Score & Verified Badge issued!`);
      }
    } catch (err: any) {
      console.error("Evaluation error:", err);
      toast.error("Evaluation failed. Please try again.");
      setInterviewState("interviewing");
    }
  };

  const handleReset = () => {
    setInterviewState("idle");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers(["", "", ""]);
    setCurrentAnswer("");
    setEvaluation(null);
  };

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Closed-Loop Scenario Verification</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Scenario Mock Interview &amp; Rubric
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              Test your proficiency in missing skills for <strong>{state.target_role}</strong>. Failing scores (&lt;70%) automatically trigger closed-loop roadmap recalibration.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* STAGE 1: Skill Selection & Start */}
        {interviewState === "idle" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/50 bg-card shadow-card premium-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  <span>Select Target Skill to Verify</span>
                </CardTitle>
                <CardDescription>
                  Pre-populated with identified gaps from your career pivot analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Choose Skill for 3-Question Scenario Evaluation
                  </label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map((sk) => (
                        <SelectItem key={sk} value={sk}>
                          {sk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Closed-Loop Evaluation Rules:
                  </p>
                  <p>&bull; <strong>Score &ge; 70%:</strong> Issues verified skill badge and adds <strong>+5%</strong> to Role Match.</p>
                  <p>&bull; <strong>Score &lt; 70%:</strong> Prepend a customized remediation module to <strong>Week 1</strong> of your roadmap.</p>
                  <p>&bull; <strong>4-Dimension Rubric:</strong> Technical Accuracy, Practical Depth, Edge Case Reasoning, and Communication Clarity.</p>
                </div>

                <Button
                  onClick={handleStartInterview}
                  size="lg"
                  className="w-full h-12 text-base font-semibold gap-2 shadow-glow"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Scenario Questions &amp; Begin</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* LOADING QUESTIONS */}
        {interviewState === "loading_questions" && (
          <Card className="border border-border/50 bg-card shadow-card p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold">Synthesizing Technical Scenarios...</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Gemini is constructing 3 real-world architectural scenarios tailored for <strong>{selectedSkill}</strong> in the context of <strong>{state.target_role}</strong>.
            </p>
          </Card>
        )}

        {/* STAGE 2: Interactive Interview Questions */}
        {interviewState === "interviewing" && questions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/50 bg-card shadow-card premium-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {selectedSkill}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <Progress
                  value={((currentQuestionIndex + 1) / questions.length) * 100}
                  className="h-2 mb-3"
                />
                <CardTitle className="text-xl font-bold leading-relaxed">
                  {questions[currentQuestionIndex]}
                </CardTitle>
                <CardDescription>
                  Provide a detailed, practical response explaining design decisions, trade-offs, and operational limits.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  rows={7}
                  placeholder="Type your technical response here (explain architecture, edge cases, recovery strategies)..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="font-mono text-sm leading-relaxed"
                />

                {/* Testing Helpers */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground/80">Demo Shortcuts:</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInsertSampleAnswer("pass")}
                      className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    >
                      Fill Strong Answer (&ge;70%)
                    </Button>
                    <span>&bull;</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInsertSampleAnswer("fail")}
                      className="h-7 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      Fill Weak Answer (&lt;70% Recalibrate)
                    </Button>
                  </div>

                  <span>
                    Word count: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleReset} size="sm">
                    Cancel Interview
                  </Button>

                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="gap-2 font-semibold min-w-[180px] shadow-glow"
                  >
                    <span>
                      {currentQuestionIndex < questions.length - 1
                        ? "Next Question"
                        : "Submit for Evaluation"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STAGE 3: Evaluating with Gemini */}
        {interviewState === "evaluating" && (
          <Card className="border border-border/50 bg-card shadow-card p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold">Grading with Server-Side Gemini Rubric...</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Evaluating your answers across Technical Accuracy, Practical Depth, Edge Cases, and Clarity. Testing closed-loop recalibration threshold (70%).
            </p>
          </Card>
        )}

        {/* STAGE 4: Evaluation Results & Rubric */}
        {interviewState === "completed" && evaluation && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border border-border/50 bg-card shadow-card premium-border overflow-hidden">
              {/* Header Status Banner */}
              <div
                className={`p-6 text-center ${
                  evaluation.score >= 70
                    ? "bg-emerald-500/10 border-b border-emerald-500/30"
                    : "bg-amber-500/10 border-b border-amber-500/30"
                }`}
              >
                <div className="inline-flex p-3 rounded-full mb-3 shadow-md bg-card">
                  {evaluation.score >= 70 ? (
                    <Award className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                  )}
                </div>

                <h2 className="text-2xl font-extrabold text-foreground">
                  {evaluation.score >= 70
                    ? "Skill Verified Successfully!"
                    : "Roadmap Recalibrated"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {evaluation.score >= 70
                    ? `You demonstrated proficient technical competence in ${selectedSkill}. A verified badge has been issued, and +5% was added to your Role Match.`
                    : `Score was below the 70% threshold. A customized remediation sprint has been automatically prepended to Week 1 of your roadmap.`}
                </p>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Score & 4-Dimension Rubric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  {/* Overall Score */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/40 text-center md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Overall Composite Score
                    </p>
                    <div className="relative">
                      <ScoreRing
                        score={evaluation.score}
                        size="lg"
                      />
                    </div>
                    <Badge
                      className={`mt-3 ${
                        evaluation.score >= 70
                          ? "bg-emerald-500 text-black font-bold"
                          : "bg-amber-500 text-black font-bold"
                      }`}
                    >
                      {evaluation.score >= 70 ? "PASSED (>= 70%)" : "NEEDS REMEDIATION (< 70%)"}
                    </Badge>
                  </div>

                  {/* 4 Rubric Breakdown Bars */}
                  <div className="space-y-3.5 md:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      4-Dimension Evaluator Rubric
                    </p>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Technical Accuracy</span>
                        <span className="font-bold">{evaluation.rubric.technical_accuracy}%</span>
                      </div>
                      <Progress value={evaluation.rubric.technical_accuracy} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Practical Depth</span>
                        <span className="font-bold">{evaluation.rubric.practical_depth}%</span>
                      </div>
                      <Progress value={evaluation.rubric.practical_depth} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Edge Case Reasoning</span>
                        <span className="font-bold">{evaluation.rubric.edge_case_reasoning}%</span>
                      </div>
                      <Progress value={evaluation.rubric.edge_case_reasoning} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Communication Clarity</span>
                        <span className="font-bold">{evaluation.rubric.communication_clarity}%</span>
                      </div>
                      <Progress value={evaluation.rubric.communication_clarity} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Evaluator Feedback</span>
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {evaluation.feedback}
                  </p>
                </div>

                {/* Remediation Tasks (if score < 70) */}
                {evaluation.score < 70 && evaluation.remediation_tasks && evaluation.remediation_tasks.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Prepended Week 1 Remediation Tasks:</span>
                    </p>
                    <div className="space-y-1.5">
                      {evaluation.remediation_tasks.map((task, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2 text-xs text-foreground/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/40">
                  <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto gap-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Test Another Skill</span>
                  </Button>

                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full sm:w-auto gap-2 font-semibold shadow-glow"
                  >
                    <span>View Recalibrated Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
