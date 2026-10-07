import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, syncUserProfile, signInWithEmail, signUpWithEmail } from '../lib/firebase';
import { UserProfile, CurrencyCode, Madhhab } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, role?: 'donor' | 'mahal' | 'vakeel') => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePreferences: (currency: CurrencyCode, madhhab: Madhhab) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        const userProf = await syncUserProfile(auth.currentUser);
        setProfile(userProf);
      } catch (err) {
        console.error("Failed to refresh profile:", err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProf = await syncUserProfile(currentUser);
          setProfile(userProf);
        } catch (err) {
          console.error("Failed to sync profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const userProf = await syncUserProfile(res.user);
        setProfile(userProf);
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error("Sign in failed:", err);
      }
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const fbUser = await signInWithEmail(email, pass);
    setUser(fbUser);
    const userProf = await syncUserProfile(fbUser);
    setProfile(userProf);
  };

  const registerWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    role: 'donor' | 'mahal' | 'vakeel' = 'donor'
  ) => {
    const fbUser = await signUpWithEmail(email, pass, name, role);
    setUser(fbUser);
    const userProf = await syncUserProfile(fbUser, { displayName: name, role });
    setProfile(userProf);
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tazku_active_role');
      }
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const updatePreferences = async (currency: CurrencyCode, madhhab: Madhhab) => {
    if (!user) return;
    try {
      const updated = await syncUserProfile(user, { preferredCurrency: currency, madhhab });
      setProfile(updated);
    } catch (err) {
      console.error("Failed to update preferences:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signInWithGoogle, 
      loginWithEmail, 
      registerWithEmail, 
      refreshProfile, 
      signOut, 
      updatePreferences 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
