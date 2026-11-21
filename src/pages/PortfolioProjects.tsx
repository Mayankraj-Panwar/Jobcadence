import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FolderKanban, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Check, 
  Layers, 
  Award, 
  ExternalLink,
  Code2,
  ListChecks,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useCareer, PortfolioProject } from "@/contexts/CareerContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PortfolioProjects() {
  const navigate = useNavigate();
  const { state, completeProject } = useCareer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newDeliverables, setNewDeliverables] = useState("");

  const handleComplete = (project: PortfolioProject) => {
    if (project.completed) return;
    completeProject(project.id);
    toast.success(`Completed "${project.title}"! +7% added to Role Match & verified badge issued!`);
  };

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Pivot Proof Artifacts</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Target Portfolio Projects
            </h1>
            <p className="text-muted-foreground mt-1 text-base max-w-2xl">
              Production-grade deliverables required to prove hands-on readiness for <strong>{state.target_role}</strong>. Completing each project adds <strong>+7%</strong> to your Match Score and awards a verified badge.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.portfolio_projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={`h-full flex flex-col rounded-xl border transition-all duration-300 ${
                  project.completed
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-md ring-1 ring-emerald-500/20"
                    : "border-border/50 bg-card hover:border-primary/40 shadow-card hover:shadow-card-hover"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Project #{idx + 1}
                    </span>
                    {project.completed ? (
                      <Badge className="bg-emerald-500 text-black text-xs font-bold gap-1">
                        <Check className="w-3 h-3" />
                        <span>Completed (+7%)</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-500">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold leading-snug">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1.5 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  {/* Skills Covered */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-primary" />
                      <span>Skills Covered</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills_covered.map((skill, sIdx) => (
                        <Badge key={sIdx} variant="secondary" className="text-[11px] px-2 py-0.5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-primary" />
                      <span>Deliverables Checklist</span>
                    </p>
                    <div className="space-y-1.5">
                      {project.deliverable_checklist.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-foreground/80">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                              project.completed ? "text-emerald-500" : "text-muted-foreground/60"
                            }`}
                          />
                          <span className={project.completed ? "line-through text-muted-foreground" : ""}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completion Action */}
                  <div className="pt-4 border-t border-border/40 mt-auto">
                    {project.completed ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>Verified Proof Issued &bull; Score +7%</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleComplete(project)}
                        className="w-full gap-2 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Mark Completed (+7% Match)</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
