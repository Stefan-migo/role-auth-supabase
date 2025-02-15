// app/contexts/AuthRouter.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRef } from 'react';

export const AuthRouter = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, role, authLoading, isLoaded } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useAuthStore.getState().initialize();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    const handleRouting = () => {
      if (!authLoading && isLoaded) {
        const currentPath = window.location.pathname;
        const isCallback = currentPath.startsWith('/auth/callback');

        // Skip redirection if the user is on an admin route
        const isAdminRoute = currentPath.startsWith('/dashboard/admin');

        if (user && role) {
          // Allow admin to stay on admin routes
          if (role === 'admin' && isAdminRoute) {
            return; // No redirection needed
          }

          const targetPath = `/dashboard/${role}`;
          if (currentPath !== targetPath && !isCallback && !isAdminRoute) {
            router.push(targetPath);
          }
          if (isCallback) {
            router.replace(targetPath); // Force redirect out of callback
          }
        } else if (!isCallback) {
          router.push('/');
        }
      }
    };

    const timer = setTimeout(handleRouting, 100);
    return () => clearTimeout(timer);
  }, [user, role, authLoading, isLoaded, router]);

  return <>{children}</>;
};