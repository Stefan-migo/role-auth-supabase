// components/auth-loading-wrapper.tsx
'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AuthLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { authLoading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always render the same structure, but conditionally show content
  return (
    <div className="relative">
      {!isClient && (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {isClient && authLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}

      {isClient && children}
    </div>
  );
};