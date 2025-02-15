'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { toast } from 'sonner';

export default function AuthCallback() {
  const { refreshSession, user, role, isLoaded } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        toast.loading('Signing in...', { id: 'signin' }); // Show loading toast
        await refreshSession();

        // Check state after refresh
        if (user && role && isLoaded) {
          toast.success('Signed in successfully!', { id: 'signin' });
          window.location.href = `/dashboard/${role}`;
        }
      } catch (error) {
        toast.error('Failed to sign in. Please try again.', { id: 'signin' });
        console.error('Auth callback error:', error);
        window.location.href = '/';
      }
    };

    handleAuth();
  }, [refreshSession, user, role, isLoaded]);

  return <div>Loading...</div>;
}