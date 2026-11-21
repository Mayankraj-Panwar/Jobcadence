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
  id: "nehal_user_1",
  name: "Nehal Jain",
  email: "nehaljain848@gmail.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nehal",
  role: "student",
  skillDNA: "Executor",
  trustScore: 847,
  nexusCredits: 1250,
  alphaCredits: 500,
  verifiedBadges: [
    { id: "1", skill: "React.js", score: 92, verifiedAt: "2024-01-15", confidence: "high" },
    { id: "2", skill: "Python", score: 85, verifiedAt: "2024-01-10", confidence: "high" },
  ],
};

export const mockAlumniUser: User = {
  id: "alumni_demo_2",
  name: "Nehal Jain (Alumni / Mentor)",
  email: "nehaljain848@gmail.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NehalAlumni",
  role: "alumni",
  skillDNA: "Architect",
  trustScore: 920,
  nexusCredits: 2000,
  alphaCredits: 1000,
  verifiedBadges: [],
};

const LOCAL_STORAGE_KEY = "jobcadence_user";
const LEGACY_STORAGE_KEY = "samarth_auth_user";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (role: UserRole, customUser?: User) => void;
  updateUserName: (name: string) => void;
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
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== "Alex Chen" && parsed.name !== "Test User") {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Default to Nehal Jain so user is always authenticated and sees their name immediately
    return mockStudentUser;
  });
  const [isNewUser, setIsNewUser] = useState(false);

  // Sync default user to storage on load if not already saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!saved || saved.includes("Alex Chen") || saved.includes("Test User")) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockStudentUser));
        setUser(mockStudentUser);
      }
    } catch {}
  }, []);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            setUser(mockStudentUser);
          }
        } else {
          setUser(mockStudentUser);
        }
        return;
      }

      const ref = doc(db, "users", firebaseUser.uid);

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

  const updateUserName = (name: string) => {
    setUser((prev) => {
      if (!prev) return mockStudentUser;
      const updated = { ...prev, name: name.trim() || "Nehal Jain" };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const loginWithGoogle = async (role: UserRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const u = result.user;

    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const initialUser = {
        name: u.displayName || "Nehal Jain",
        email: u.email || "nehaljain848@gmail.com",
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
    } catch {}
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
        updateUserName,
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
