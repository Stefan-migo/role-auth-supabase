// src/app/contexts/SessionContext.tsx

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User } from '@supabase/supabase-js';
import {
  getCurrentUser,
  getUserRole,
  signInUser,
} from '../../utils/authActions'; // adjust the path to where your auth utilities reside
import { createClient } from '@/utils/supabase/client';

// Define the shape of our session context.
interface SessionContextProps {
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with an undefined default value.
const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

// The SessionProvider component fetches and manages the auth state.
export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to load the current user and determine their role.
  const loadUser = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const detectedRole = await getUserRole(currentUser.id);
        setRole(detectedRole);
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  // Run the loadUser function on mount and whenever the auth state changes.
  useEffect(() => {
    const supabase = createClient();
    
    // Initialize session handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        try {
          if (session?.user) {
            setUser(session.user);
            const detectedRole = await getUserRole(session.user.id);
            setRole(detectedRole);
          } else {
            setUser(null);
            setRole(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Wrap our signInUser utility to update the context state.
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: signedInUser, role: userRole } = await signInUser(
        email,
        password
      );
      setUser(signedInUser);
      setRole(userRole);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Wrap the supabase signOut method.
  const signOut = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook for consuming the session context.
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
