import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@src/lib/supabase/client';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  role: 'GUEST',
  loading: true,
  isAdmin: false,
  isCreator: false,
  isBuyer: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch public.profiles record for the authenticated user
  const fetchProfile = async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }

    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) {
        // If profile doesn't exist yet (e.g. race condition with trigger), fallback
        return null;
      }

      setProfile(data);
      return data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Real-time Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign In with email & password
  const signIn = async ({ email, password }) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Sign Up with full name, email & password
  const signUp = async ({ email, password, fullName }) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'BUYER',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  // Sign Out
  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user]);

  const role = profile?.role || (user ? 'BUYER' : 'GUEST');
  const isAdmin = role === 'ADMIN';
  const isCreator = role === 'CREATOR';
  const isBuyer = role === 'BUYER';

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      loading,
      isAdmin,
      isCreator,
      isBuyer,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, role, loading, isAdmin, isCreator, isBuyer, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
