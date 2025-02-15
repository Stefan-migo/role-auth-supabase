// components/global-loading.tsx
'use client';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GlobalLoading() {
  const [isClient, setIsClient] = useState(false);
  const authLoading = useAuthStore((state) => state.authLoading);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setShowLoading(authLoading), 100);
    return () => clearTimeout(timer);
  }, [authLoading]);

  if (!isClient) return null;
  if (!authLoading) return null;
  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}