import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Target, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  Loader2,
  FileUp,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useCareer, defaultCareerState } from "@/contexts/CareerContext";
import { toast } from "sonner";

export default function CareerIntake() {
  const navigate = useNavigate();
  const { updateFromGapAnalysis, loadSampleCareerPivot } = useCareer();

  const [targetRole, setTargetRole] = useState("Applied AI Engineer");
  const [targetJd, setTargetJd] = useState(
    "Seeking an Applied AI Engineer with experience designing production RAG pipelines, multi-agent workflows, vector search backends (Qdrant/Pinecone), and LLM evaluation frameworks. Familiarity with FastAPI, streaming inference, and Docker is required."
  );
  const [resumeText, setResumeText] = useState(
    "Senior React & TypeScript Developer with 5+ years of experience creating complex frontend single-page applications, design systems, and stateful architectures. Proficient with Next.js, Node.js, WebSockets, REST APIs, and automated testing with Playwright. Looking to pivot into Applied AI and LLM Engineering."
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected PDF: ${file.name}`);
    }
  };

  const handleLoadSample = () => {
    loadSampleCareerPivot();
    setTargetRole("Applied AI Engineer");
    setTargetJd(defaultCareerState.target_jd);
    setResumeText(defaultCareerState.resume_text);
    setSelectedFile(null);
    toast.success("Loaded Sample Career Pivot (React Developer -> Applied AI Engineer)");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetRole.trim()) {
      toast.error("Please specify a target role");
      return;
    }

    if (!resumeText.trim() && !selectedFile) {
      toast.error("Please paste resume text or upload a PDF resume");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (selectedFile) {
        // Send multipart form-data
        const formData = new FormData();
        formData.append("target_role", targetRole);
        formData.append("target_jd", targetJd);
        formData.append("resume_text", resumeText);
        formData.append("resume_pdf", selectedFile);

        response = await fetch("http://127.0.0.1:8000/analyze-gap", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send JSON
        response = await fetch("http://127.0.0.1:8000/analyze-gap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_role: targetRole,
            target_jd: targetJd,
            resume_text: resumeText,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const report = await response.json();
      updateFromGapAnalysis(report);
      toast.success(`Gap analysis complete! Role Match: ${report.match_score}%`);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Gap analysis error:", err);
      toast.error("Analysis failed. Loading high-fidelity sample gap analysis instead.");
      handleLoadSample();
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Pivot Coach &bull; Hackathon PS 25</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Skill Gap &amp; Career Pivot Intake
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl text-base">
              Upload your existing resume and target role to generate a calibrated 4-week transition roadmap, structured interview benchmarks, and portfolio proof artifacts.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleLoadSample}
            className="flex items-center gap-2 border-primary/40 text-foreground hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4 text-primary" />
            <span>Load Sample Career Pivot</span>
          </Button>
        </div>

        {/* Split Screen Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Resume Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border border-border/50 bg-card shadow-card premium-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Your Current Experience &amp; Resume</span>
                  </CardTitle>
                  <CardDescription>
                    Provide your resume text or upload your PDF resume for server-side parsing with pypdf.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* PDF Upload Zone */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Upload PDF Resume (Optional)
                    </Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        selectedFile
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-muted/20"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="w-8 h-8 text-primary mb-2" />
                          <p className="font-semibold text-sm text-foreground">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click to change file
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="font-semibold text-sm text-foreground">
                            Click to upload PDF resume
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF documents up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resume Text Area */}
                  <div>
                    <Label htmlFor="resume-text" className="text-sm font-semibold mb-2 block">
                      Resume Summary &amp; Experience Details
                    </Label>
                    <Textarea
                      id="resume-text"
                      rows={8}
                      placeholder="Paste your resume summary, tech stack, past roles, or recent accomplishments..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="font-mono text-xs leading-relaxed"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column: Target Role & JD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border border-border/50 bg-card shadow-card premium-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span>Target Pivot Role &amp; Requirements</span>
                  </CardTitle>
                  <CardDescription>
                    Define your transition goal and paste typical job description requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label htmlFor="target-role" className="text-sm font-semibold mb-2 block">
                      Target Role Title
                    </Label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        id="target-role"
                        placeholder="e.g. Applied AI Engineer, ML Systems Engineer"
                        className="pl-9"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="target-jd" className="text-sm font-semibold mb-2 block">
                      Target Job Description / Tech Requirements
                    </Label>
                    <Textarea
                      id="target-jd"
                      rows={8}
                      placeholder="Paste the target job description, required skills, tools, and technical qualification expectations..."
                      value={targetJd}
                      onChange={(e) => setTargetJd(e.target.value)}
                      className="font-mono text-xs leading-relaxed"
                    />
                  </div>

                  {/* Key Highlights */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5 text-muted-foreground">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      What the AI Architecture analyzes:
                    </p>
                    <p>&bull; <strong>Server-side skill extraction</strong> with Gemini structured outputs</p>
                    <p>&bull; <strong>Dynamic 4-week recalibrated roadmap</strong> tailored to missing skills</p>
                    <p>&bull; <strong>3 Portfolio proof projects</strong> addressing critical hiring criteria</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-lg">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Ready to generate your calibrated transition roadmap and portfolio benchmarks.
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto min-w-[240px] h-12 gap-2 text-base font-semibold shadow-glow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Gap with AI...</span>
                </>
              ) : (
                <>
                  <span>Analyze Gap &amp; View Roadmap</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
