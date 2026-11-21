import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCareer } from "@/contexts/CareerContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Home, 
  BadgeCheck, 
  Target, 
  Radar, 
  Menu, 
  X, 
  LogOut, 
  Sparkles, 
  Flame, 
  Briefcase,
  Layers,
  FileSearch,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { state: careerState } = useCareer();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isUserMenuOpen) setIsUserMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen]);

  // Define navigation items for Career Pivot Coach
  const getNavItems = () => {
    return [
      { path: "/dashboard", label: "Dashboard", icon: Home },
      { path: "/intake", label: "Gap Intake", icon: Sparkles },
      { path: "/verify-skills", label: "Verify Skills", icon: BadgeCheck },
      { path: "/projects", label: "Projects", icon: Target },
      { path: "/applications", label: "Applications", icon: Radar },
    ];
  };

  const navItems = getNavItems();
  const matchScore = careerState.matchScore ?? careerState.match_score ?? 64;
  const streakDays = careerState.streakDays ?? careerState.streak ?? 5;
  const targetRole = careerState.targetRole ?? careerState.target_role ?? "Applied AI Engineer";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-xs">JC</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Job<span className="text-primary font-normal">cadence</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all relative ${
                    isActive(item.path)
                      ? "bg-primary text-black font-semibold"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Link to={item.path}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Right side - Stats & User */}
          <div className="flex items-center gap-3">
            {/* Match Score Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Target className="w-3.5 h-3.5" />
              <span>Match: {matchScore}%</span>
            </div>

            {/* Streak Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-400">
              <Flame className="w-3.5 h-3.5" />
              <span>{streakDays}d</span>
            </div>

            <ThemeToggle />
            
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative flex items-center gap-2 pl-2 pr-3 h-9 rounded-full border border-border/50 hover:bg-muted/60"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold text-foreground max-w-[120px] truncate">
                    {user.name}
                  </span>
                </Button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 rounded-xl border bg-popover p-2 text-popover-foreground shadow-xl z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2.5 border-b border-border/50">
                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span className="truncate">{targetRole}</span>
                        </div>
                      </div>

                      <div className="p-2 space-y-1 text-xs">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/60 text-foreground transition-colors"
                        >
                          <Home className="w-4 h-4 text-primary" />
                          <span>Dashboard Overview</span>
                        </Link>
                        <Link
                          to="/intake"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/60 text-foreground transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span>Skill Gap Intake</span>
                        </Link>
                        <Link
                          to="/verify-skills"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/60 text-foreground transition-colors"
                        >
                          <BadgeCheck className="w-4 h-4 text-primary" />
                          <span>Scenario Verification</span>
                        </Link>
                        <Link
                          to="/projects"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/60 text-foreground transition-colors"
                        >
                          <Target className="w-4 h-4 text-primary" />
                          <span>Portfolio Projects</span>
                        </Link>
                        <Link
                          to="/applications"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/60 text-foreground transition-colors"
                        >
                          <Radar className="w-4 h-4 text-primary" />
                          <span>Application Funnel</span>
                        </Link>
                      </div>

                      <div className="p-2 pt-1 border-t border-border/50">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full justify-start text-xs h-8"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start rounded-full ${isActive(item.path) ? 'bg-[#FCA311] text-foreground' : 'text-foreground'}`}
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.path}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
