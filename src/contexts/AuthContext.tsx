import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "student" | "alumni";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  skillDNA: "Executor" | "Architect" | "Researcher";
  trustScore: number;
  nexusCredits: number;
  alphaCredits: number;
  verifiedBadges: any[];
  whatsapp?: string;
  college?: string;
}

export const mockStudentUser: User = {
  id: "student_demo_1",
  name: "Alex Chen",
  email: "alex.chen@university.edu",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  role: "student",
  skillDNA: "Executor",
  trustScore: 847,
  nexusCredits: 1250,
  alphaCredits: 500,
  verifiedBadges: [
    { id: "1", skill: "React.js", score: 92, verifiedAt: "2024-01-15", confidence: "high" },
    { id: "2", skill: "Python", score: 85, verifiedAt: "2024-01-10", confidence: "high" },
    { id: "3", skill: "Machine Learning", score: 78, verifiedAt: "2024-01-08", confidence: "medium" },
    { id: "4", skill: "UI/UX Design", score: 88, verifiedAt: "2024-01-05", confidence: "high" },
  ],
};

export const mockAlumniUser: User = {
  id: "alumni_demo_2",
  name: "Sarah Johnson",
  email: "sarah.johnson@techcorp.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  role: "alumni",
  skillDNA: "Architect",
  trustScore: 920,
  nexusCredits: 2000,
  alphaCredits: 1000,
  verifiedBadges: [],
};

const LOCAL_STORAGE_KEY = "samarth_auth_user";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (role: UserRole, customUser?: User) => void;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  completeStudentProfile: (data: {
    whatsapp: string;
    college: string;
  }) => Promise<void>;
  updateUserCredits: (nexusDelta: number, alphaDelta: number) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // If not in Firebase, keep user if logged in via mock/localStorage, or null
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            setUser(null);
          }
        }
        return;
      }

      const ref = doc(db, "users", firebaseUser.uid);

      // Real-time listener
      unsubDoc = onSnapshot(
        ref,
        (snap) => {
          if (!snap.exists()) {
            setIsNewUser(true);
            return;
          }
          const userData = { id: firebaseUser.uid, ...snap.data() } as User;
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
          setIsNewUser(false);
        },
        (error) => {
          console.warn("Firestore snapshot error:", error);
        }
      );
    });

    return () => {
      unsub();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const login = (role: UserRole, customUser?: User) => {
    const newUser = customUser || (role === "alumni" ? mockAlumniUser : mockStudentUser);
    setUser(newUser);
    setIsNewUser(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
  };

  const loginWithGoogle = async (role: UserRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const u = result.user;

    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const initialUser = {
        name: u.displayName || "Student",
        email: u.email || "",
        avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
        role,
        skillDNA: (role === "student" ? "Executor" : "Architect") as "Executor" | "Architect",
        trustScore: role === "student" ? 700 : 0,
        nexusCredits: role === "student" ? 500 : 0,
        alphaCredits: 0,
        verifiedBadges: [],
        createdAt: serverTimestamp()
      };
      await setDoc(ref, initialUser);
      setIsNewUser(true);
      setUser({ id: u.uid, ...initialUser } as User);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ id: u.uid, ...initialUser }));
    } else {
      const userData = { id: u.uid, ...snap.data() } as User;
      setUser(userData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
      setIsNewUser(false);
    }
  };

  const completeStudentProfile = async (data: {
    whatsapp: string;
    college: string;
  }) => {
    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        whatsapp: data.whatsapp,
        college: data.college
      });

      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const updated = { id: auth.currentUser.uid, ...snap.data() } as User;
      setUser(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } else if (user) {
      const updated = {
        ...user,
        whatsapp: data.whatsapp,
        college: data.college
      };
      setUser(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
    setIsNewUser(false);
  };

  const updateUserCredits = async (nexusDelta: number, alphaDelta: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: User = {
        ...prev,
        nexusCredits: Math.max(0, (prev.nexusCredits ?? 0) + nexusDelta),
        alphaCredits: Math.max(0, (prev.alphaCredits ?? 0) + alphaDelta),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          nexusCredits: updated.nexusCredits,
          alphaCredits: updated.alphaCredits,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore sign out error
    }
    setUser(null);
    setIsNewUser(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem("samarthSaarthiVerifySkillsState");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isNewUser,
        login,
        loginWithGoogle,
        completeStudentProfile,
        updateUserCredits,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
