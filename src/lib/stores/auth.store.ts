// lib/stores/auth.store.ts

import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { createSupabaseClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import type { Role } from '@/types';
import { CustomerSignupData, signUpCustomer, signUpStaff, StaffSignupData } from '@/utils/authActions';
import { toast } from 'sonner';


const supabase = createSupabaseClient();

// Retry wrapper from your original provider
async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 100): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

interface AuthState {
  user: User | null;
  role: Role;
  authLoading: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpCustomer: (data: CustomerSignupData) => Promise<void>;
  signUpStaff: (data: StaffSignupData) => Promise<void>;
  refreshSession: () => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {

      // Initialize listener only once
      let unsubscribe: () => void;

      return {
        user: null,
        role: null,
        isLoaded: false,
        authLoading: false,
        setAuthLoading: (loading) => set({ authLoading: loading }),

        signIn: async (email, password) => {
          set({ authLoading: true });
          try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            await get().refreshSession();
          } finally {
            set({ authLoading: false });
          }
        },

        signOut: async () => {
          set({ authLoading: true });
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Signed out successfully!');
            set({ user: null, role: null, isLoaded: true });
          } catch (error) {
            toast.error('Failed to sign out.');
            console.error('Logout failed:', error);
          } finally {
            set({ authLoading: false });
          }
        },

        signUpCustomer: async (data) => {
          set({ authLoading: true });
          try {
            const { user } = await signUpCustomer(data);
            if (user) await get().refreshSession();
          } finally {
            set({ authLoading: false });
          }
        },

        signUpStaff: async (data) => {
          set({ authLoading: true });
          try {
            const { user } = await signUpStaff(data);
            if (user) await get().refreshSession();
          } finally {
            set({ authLoading: false });
          }
        },

        refreshSession: async () => {
          set({ authLoading: true });
          try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
              toast.error('Session expired. Please sign in again.');
              console.log('No user found', error);
              set({ user: null, role: null, isLoaded: true });
              return;
            }
        
            const role = await retry(async () => {
              const { data: staff, error: staffError } = await supabase
                .from('staff')
                .select('role')
                .eq('user_id', user.id)
                .maybeSingle();
        
              if (staffError) {
                console.error('Staff role fetch error:', staffError);
                return 'customer';
              }
              
              return staff?.role || 'customer';
            });
        
            
            set({ user, role, isLoaded: true });
          } catch (error) {
            toast.error('Failed to refresh session.');
            console.error('Refresh session failed:', error);
            set({ user: null, role: null, isLoaded: true });
          } finally {
            set({ authLoading: false });
            console.log('RefreshSession triggered');
          }
        },

        signInWithGoogle: async () => {
          set({ authLoading: true });
          try {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent',
                },
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });
        
            if (error) throw error;
            if (data.url) window.location.href = data.url;
          } catch (error) {
            console.error('Google sign-in failed:', error);
          } finally {
            set({ authLoading: false });
          }
        },

        initialize: () => {
          if (typeof window === 'undefined') return; // Skip on server
          if (!unsubscribe) {
            const setupAuthListener = () => {
              const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                  console.log('Auth event:', event);
                  if (event === 'SIGNED_OUT') {
                    set({ user: null, role: null, isLoaded: true });
                  } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    // Add slight delay to ensure session is fully loaded
                    setTimeout(async () => {
                      await get().refreshSession();
                    }, 200);
                  }
                }
              );
              return () => subscription?.unsubscribe();
            };
            unsubscribe = setupAuthListener();
          }
          return unsubscribe;
          
        }

      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Persist only user
      skipHydration: true // Skip hydration for this store
    }
  )
);