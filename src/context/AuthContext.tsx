import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase/config";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = res.user;

      if (!newUser || !newUser.uid) {
        throw new Error("User creation failed");
      }

      // ❌ Removed password storage (important fix)
      await setDoc(doc(db, "user", newUser.uid), {
        uid: newUser.uid,
        name,
        email,
        authProvider: "local",
        wishlist: [],
      });

      toast.success("Signup successful");
    } catch (error: any) {
      const code = error?.code;

      if (code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else if (code === "auth/invalid-email") {
        toast.error("Invalid email");
      } else if (code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else {
        toast.error("Signup failed");
      }
      throw error
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
    } catch (error: any) {
      const code = error?.code;

      if (code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (code === "auth/user-not-found") {
        toast.error("User not found");
      } else if (code === "auth/invalid-email") {
        toast.error("Invalid email");
      } else {
        toast.error("Login failed");
      }
      throw error
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);