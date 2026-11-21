import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BadgeCheck, 
  Target, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  FileCheck2,
  Compass,
  Play,
  RotateCcw,
  CheckCircle2,
  FileText,
  BarChart3,
  Cpu,
  Layers,
  Award,
  AlertTriangle,
  GitBranch,
  Search,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ============================================================ */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-black text-sm">JC</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Job<span className="text-primary font-normal">cadence</span>
            </span>
          </Link>

          {/* Desktop Anchor Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#problem" className="hover:text-primary transition-colors">The Problem</a>
            <a href="#architecture" className="hover:text-primary transition-colors">Core Pillars</a>
            <a href="#closed-loop" className="hover:text-primary transition-colors">Closed-Loop Engine</a>
            <a href="#persona" className="hover:text-primary transition-colors">Case Study</a>
            <a href="#interactive-routes" className="hover:text-primary transition-colors">Modules</a>
          </div>

          {/* Action CTAs (Bypass Login) */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/intake">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                Gap Intake
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-card">
                Enter Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH LIVE CAREER STATE PREVIEW */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
        {/* Ambient subtle glow backdrops */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            {/* Project Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-primary/30 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-foreground">
                Problem Statement 25 • AI Career Pivot &amp; Proof Engine
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              Don't Just Pivot. <br />
              <span className="text-primary underline decoration-primary/40 underline-offset-8">
                Prove Your Competence.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Job descriptions reject keyword bluffers. Jobcadence diagnoses exact skill gaps with Gemini, 
              drives 4-week project deliverables, and runs rubric-evaluated AI interview simulations with 
              <strong> automatic closed-loop recalibration</strong>.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-card hover:shadow-card-hover transition-all text-base"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Launch Live Demo Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/intake">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 h-12 border-primary/40 text-foreground hover:bg-primary/10 transition-all text-base"
                >
                  <FileCheck2 className="w-4 h-4 mr-2 text-primary" />
                  Run 1-Click Gap Intake
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* ============================================================ */}
          {/* LIVE SIMULATED CAREER ENGINE CARD (Interactive Visual Proof) */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-6 md:p-8 rounded-3xl border border-primary/30 bg-card/90 shadow-card backdrop-blur-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary">
                    NJ
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">Nehal Jain</h4>
                      <Badge variant="outline" className="text-xs border-primary/40 text-primary">Active Persona</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transitioning: <span className="text-foreground">Backend Java Developer</span> &rarr; <span className="text-primary font-semibold">Applied AI Engineer</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/15 text-primary border-primary/30 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-primary" />
                    Closed-Loop State Active
                  </Badge>
                </div>
              </div>

              {/* Progress & Stat Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-surface/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Target Match Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-primary">72%</span>
                    <span className="text-xs text-emerald-400 font-semibold">+14% Earned</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Started at 58% baseline</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Portfolio Deliverables</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-foreground">1/2</span>
                    <span className="text-xs text-primary font-semibold">+7% Boost</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">RAG Pipeline with Hybrid Search</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">AI Verified Badges</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-foreground">1</span>
                    <BadgeCheck className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Python &amp; Vector Databases (88/100)</p>
                </div>
              </div>

              {/* Active Recalibration Alert Callout */}
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Closed-Loop Recalibration Armed:</strong> Any interview score &lt;70 automatically injects remedial tasks into Week 1.</span>
                </div>
                <Link to="/verify-skills" className="text-primary hover:underline font-semibold flex items-center gap-1">
                  Test Simulation &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. KEY METRICS BAR */}
      {/* ============================================================ */}
      <section className="py-12 border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-1">+7%</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Match Boost per Portfolio Project</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-1">+5%</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Boost per Passed AI Interview (&ge;70)</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-1">&lt;70%</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Triggers Dynamic Roadmap Recalibration</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-1">4-Week</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Structured Sprint with Verified Artifacts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE PROBLEM VS OUR SOLUTION */}
      {/* ============================================================ */}
      <section id="problem" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="border-primary/40 text-primary mb-3">Why Most Pivots Fail</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              The Reality of Transitioning in Tech
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Generic certificates and keyword-stuffed resumes don't convince engineering leaders. 
              Jobcadence bridges the gap between aspirations and demonstrable engineering rigor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Broken Traditional Way */}
            <Card className="border-destructive/30 bg-card/60">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <CardTitle className="text-xl text-destructive">Traditional Job Hunting (The Guesswork Loop)</CardTitle>
                <CardDescription>How candidates currently struggle with zero feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold">&times;</span>
                  <span><strong>Vague ATS Filters:</strong> Resumes get dropped without explaining which critical competencies were missing.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold">&times;</span>
                  <span><strong>Tutorial Hell:</strong> Candidates follow passive tutorials that fail to prove practical production depth.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold">&times;</span>
                  <span><strong>Static Roadmaps:</strong> If you struggle with a topic, traditional plans don't adapt or offer corrective action.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-destructive font-bold">&times;</span>
                  <span><strong>Zero Conversion Visibility:</strong> Applicants blast 100 identical resumes with no variant performance tracking.</span>
                </div>
              </CardContent>
            </Card>

            {/* The Jobcadence Closed-Loop Solution */}
            <Card className="border-primary/40 bg-card shadow-card">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Jobcadence Closed-Loop Engine</CardTitle>
                <CardDescription>Deterministic proof, real deliverables, and self-correcting feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm text-foreground">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Deterministic Gap Analysis:</strong> Strict Pydantic parsing of resume vs target JD with quantitative match score.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Proof-Heavy Deliverables:</strong> Build verifiable GitHub projects where completion awards an immediate +7% match boost.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Self-Correcting Recalibration:</strong> When interview scores drop below 70, Week 1 adapts with targeted remediation.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Variant Conversion Funnel:</strong> A/B test role titles (e.g. Applied AI vs Full-Stack) to maximize interview yield.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. THE 4 CORE ARCHITECTURAL PILLARS */}
      {/* ============================================================ */}
      <section id="architecture" className="py-24 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="border-primary/40 text-primary mb-3">System Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              The 4 Architectural Pillars of Jobcadence
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Engineered strictly to satisfy Problem Statement 25 requirements: Zero-Trust AI Execution, 
              Deterministic Structured Outputs, and Single Source of Truth state transitions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">POST /analyze-gap</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">1. AI Resume &amp; JD Gap Intake</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Extracts raw text from PDF resumes using <code className="text-xs bg-muted px-1.5 py-0.5 rounded">pypdf</code> and 
                  analyzes it against any target Job Description using <code className="text-xs bg-muted px-1.5 py-0.5 rounded">gemini-2.5-flash</code>.
                </p>
                <ul className="text-xs space-y-2 text-foreground/90 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Deterministic baseline match score calculation (0-100)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Granular missing technical skills breakdown
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Generates a customized 4-week modular sprint plan
                  </li>
                </ul>
              </div>
              <Link to="/intake">
                <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                  Open Gap Intake &rarr;
                </Button>
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">+7% Match Boost</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">2. Deliverable-Based Portfolio Projects</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Instead of disconnected tutorial snippets, users build production-grade artifacts with concrete checklists 
                  and GitHub repository links.
                </p>
                <ul className="text-xs space-y-2 text-foreground/90 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Immediate +7% match score increment upon project completion
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Automated reflection prompts that reinforce core architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Direct portfolio proof linking to live GitHub repositories
                  </li>
                </ul>
              </div>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                  View Portfolio Projects &rarr;
                </Button>
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">POST /evaluate-interview</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">3. Rubric-Evaluated AI Interviews</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Simulates realistic technical and behavioral interview pressure with multi-rubric evaluation: 
                  Technical Accuracy (35%), Practical Depth (25%), Edge Cases (20%), Clarity (20%).
                </p>
                <ul className="text-xs space-y-2 text-foreground/90 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Score &ge; 70: Awards +5% match boost &amp; verified badge
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Score &lt; 70: Automatically prepends remediation to Week 1
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Flashes Dashboard Recalibration Alert banner
                  </li>
                </ul>
              </div>
              <Link to="/verify-skills">
                <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                  Try Skill Verification &rarr;
                </Button>
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 rounded-3xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">POST /analyze-applications</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">4. Variant Conversion Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Tracks job applications segmented by role variant (e.g. "Applied AI Engineer" vs "Full-Stack AI Developer") 
                  across funnel stages (Applied, Screen, Technical, Offer).
                </p>
                <ul className="text-xs space-y-2 text-foreground/90 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Identifies highest-converting resume positioning variants
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Gemini-powered strategic pivot recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Conversion stage velocity and bottleneck diagnosis
                  </li>
                </ul>
              </div>
              <Link to="/applications">
                <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                  Inspect Funnel Analytics &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CLOSED-LOOP ENGINE WORKFLOW */}
      {/* ============================================================ */}
      <section id="closed-loop" className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="border-primary/40 text-primary mb-3">Self-Correcting Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              The Closed-Loop Feedback Flow
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Most platforms are open-ended tutorials. Jobcadence creates an unbroken feedback loop: 
              if you fail an interview simulation, your roadmap recalibrates immediately.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl border border-border/60 bg-card text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-foreground mb-2">Input Gap</h4>
              <p className="text-xs text-muted-foreground">
                Resume PDF + Target JD evaluated by Gemini to define baseline match (58%).
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/60 bg-card text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-foreground mb-2">Build Projects (+7%)</h4>
              <p className="text-xs text-muted-foreground">
                Deliver real GitHub repositories with concrete checklists. Score jumps to 65%.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-primary/40 bg-card text-center relative shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-primary mb-2">AI Interview</h4>
              <p className="text-xs text-muted-foreground">
                Score &ge;70 awards +5% and verified badge. Score &lt;70 triggers recalibration.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/60 bg-card text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-foreground mb-2">Apply with Proof</h4>
              <p className="text-xs text-muted-foreground">
                Track variants in the application funnel and measure conversion to offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. NEHAL JAIN CASE STUDY (JUDGE WALKTHROUGH GUIDE) */}
      {/* ============================================================ */}
      <section id="persona" className="py-24 border-t border-border/50 bg-card/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl border border-primary/40 bg-card p-8 md:p-12 shadow-card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/50">
              <div>
                <Badge className="bg-primary text-primary-foreground mb-2">Judge / Demo Walkthrough</Badge>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">
                  Case Study: The Nehal Jain Transition
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  How our pre-loaded candidate transitions from Backend Java Developer to Applied AI Engineer.
                </p>
              </div>
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  Open Demo Dashboard &rarr;
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-5 rounded-2xl bg-surface/60 border border-border/50">
                <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Stage 1: Gap Intake</span>
                <p className="text-2xl font-black text-foreground mt-1">58% Match</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Strong backend background in Java, APIs, SQL. Clear gaps in Vector DBs, LangChain, DSPy, and RAG architectures.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface/60 border border-border/50">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Stage 2: Project 1 Done</span>
                <p className="text-2xl font-black text-primary mt-1">65% Match</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Completed "RAG Pipeline with Hybrid Search". +7% deterministic match score boost applied with verified GitHub URL.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface/60 border border-border/50">
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Stage 3: Interview Passed</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">70% Match</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Scored 88/100 on Python &amp; Vector Databases. Earned Verified Badge +5% boost. Ready for market applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. INTERACTIVE MODULE DIRECT ACCESS */}
      {/* ============================================================ */}
      <section id="interactive-routes" className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Explore All 5 Interactive Modules
            </h2>
            <p className="text-muted-foreground text-base">
              Every page is fully connected to the unified <code className="text-xs bg-muted px-1.5 py-0.5 rounded">CareerContext</code> with zero login barriers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            <Link to="/dashboard" className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div>
                <Compass className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Dashboard</h4>
                <p className="text-xs text-muted-foreground mt-1">Unified command center, streak metrics, recalibration alerts.</p>
              </div>
              <span className="text-xs text-primary font-semibold mt-4">Open &rarr;</span>
            </Link>

            <Link to="/intake" className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div>
                <Sparkles className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Gap Intake</h4>
                <p className="text-xs text-muted-foreground mt-1">Resume PDF parsing and 1-click sample demo load.</p>
              </div>
              <span className="text-xs text-primary font-semibold mt-4">Open &rarr;</span>
            </Link>

            <Link to="/projects" className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div>
                <Target className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Projects</h4>
                <p className="text-xs text-muted-foreground mt-1">Milestones, checklists, and deterministic +7% score boost.</p>
              </div>
              <span className="text-xs text-primary font-semibold mt-4">Open &rarr;</span>
            </Link>

            <Link to="/verify-skills" className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div>
                <BadgeCheck className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Verify Skills</h4>
                <p className="text-xs text-muted-foreground mt-1">Adaptive AI interview with 4-rubric scoring.</p>
              </div>
              <span className="text-xs text-primary font-semibold mt-4">Open &rarr;</span>
            </Link>

            <Link to="/applications" className="p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div>
                <TrendingUp className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Applications</h4>
                <p className="text-xs text-muted-foreground mt-1">Role variant conversion tracking and strategic pivot AI.</p>
              </div>
              <span className="text-xs text-primary font-semibold mt-4">Open &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. BOTTOM CALL TO ACTION */}
      {/* ============================================================ */}
      <section className="py-24 border-t border-border/50 bg-card/60">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge variant="outline" className="border-primary/40 text-primary mb-4">Start Immediately</Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Ready to Experience the Closed-Loop Difference?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            No signup barriers. Launch the interactive prototype now and see how objective proof transforms career transitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-10 h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-card text-base">
                Open Dashboard (Demo Ready)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/intake">
              <Button size="lg" variant="outline" className="px-8 h-13 border-primary/40 text-foreground hover:bg-primary/10 text-base">
                Run Gap Intake
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FOOTER */}
      {/* ============================================================ */}
      <footer className="mt-auto py-8 border-t border-border/50 bg-background text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center font-bold text-primary-foreground text-[10px]">
              JC
            </div>
            <span>© 2026 Jobcadence • Closed-Loop Career Transition &amp; Proof Platform (PS 25).</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/intake" className="hover:text-foreground transition-colors">Intake</Link>
            <Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link>
            <Link to="/verify-skills" className="hover:text-foreground transition-colors">Verify Skills</Link>
            <Link to="/applications" className="hover:text-foreground transition-colors">Applications</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
