import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Chrome,
  GraduationCap,
  Briefcase,
  ArrowLeft,
  Phone,
  MapPin,
  Sparkles,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { toast } from "sonner";

import { useAuth, UserRole } from "@/contexts/AuthContext";

export default function Auth() {
  const {
    user,
    isAuthenticated,
    isNewUser,
    login,
    loginWithGoogle,
    completeStudentProfile
  } = useAuth();

  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [studentData, setStudentData] = useState({
    whatsapp: "",
    college: ""
  });

  /* 🔁 Redirect existing users */
  useEffect(() => {
    if (!isAuthenticated || isNewUser) return;

    if (user?.role === "student") navigate("/dashboard");
    if (user?.role === "alumni") navigate("/alumni-portal");
  }, [isAuthenticated, isNewUser, user, navigate]);

  const handleGoogleLogin = async () => {
    if (!selectedRole) return;
    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle(selectedRole);
      toast.success("Successfully logged in with Google!");
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error(
        err?.message?.includes("popup-closed-by-user")
          ? "Login cancelled"
          : "Google login unavailable. Please use Instant Demo Access below."
      );
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    login(role || "student");
    toast.success(`Logged in as ${role === "alumni" ? "Alumni" : "Student"} (Demo Mode)!`);
    navigate(role === "alumni" ? "/alumni-portal" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Back */}
      <Link to="/" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="premium-glass border-[hsl(var(--border)/0.5)]">
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-2xl">JC</span>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">
              Welcome to Job<span className="text-primary">cadence</span>
            </CardTitle>
            <CardDescription className="text-base">
              Closed-Loop Career Pivot & Skill Proof Platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ROLE SELECTION */}
            {!isAuthenticated && (
              <div>
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Select your role
                </p>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole("student")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRole === "student"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <GraduationCap
                      className={`w-8 h-8 mx-auto mb-2 ${
                        selectedRole === "student"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p className="font-medium text-sm">Student</p>
                    <p className="text-xs text-muted-foreground">
                      Learn & Teach
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole("alumni")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRole === "alumni"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Briefcase
                      className={`w-8 h-8 mx-auto mb-2 ${
                        selectedRole === "alumni"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p className="font-medium text-sm">Alumni / Recruiter</p>
                    <p className="text-xs text-muted-foreground">
                      Discover Talent
                    </p>
                  </motion.button>
                </div>

                {/* INSTANT DEMO / GUEST LOGIN BUTTON */}
                <Button
                  onClick={() => handleDemoLogin(selectedRole)}
                  size="lg"
                  className="w-full gap-2 h-12 mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  Instant Access ({selectedRole === "student" ? "Student Dashboard" : "Alumni Portal"})
                </Button>

                {/* GOOGLE SIGN-IN */}
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoadingGoogle}
                  size="lg"
                  className="w-full gap-3 h-12 mt-3"
                  variant="outline"
                >
                  {isLoadingGoogle ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Chrome className="w-5 h-5" />
                  )}
                  Continue with Google
                </Button>
              </div>
            )}

            {/* 🆕 STUDENT PROFILE FORM */}
            {isAuthenticated && isNewUser && user?.role === "student" && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Complete your profile
                </p>

                <div className="space-y-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="WhatsApp Number (10 digits)"
                      className="pl-10"
                      value={studentData.whatsapp}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          whatsapp: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="College / University"
                      className="pl-10"
                      value={studentData.college}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          college: e.target.value
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={() => completeStudentProfile(studentData)}
                  disabled={
                    !studentData.whatsapp ||
                    !studentData.college ||
                    studentData.whatsapp.replace(/\D/g, "").length !== 10
                  }
                  size="lg"
                  className="w-full h-12"
                  variant={
                    !studentData.whatsapp ||
                    !studentData.college ||
                    studentData.whatsapp.replace(/\D/g, "").length !== 10
                      ? "secondary"
                      : "default"
                  }
                >
                  Continue to Dashboard
                </Button>
              </div>
            )}

            {/* TERMS */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="underline cursor-pointer hover:text-foreground">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-foreground">
                Privacy Policy
              </span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
