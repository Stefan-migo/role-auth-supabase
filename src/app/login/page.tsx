// src/app/login/page.tsx
'use client'; 

import { AuthForm } from '@/app/auth/components/AuthForm';
import { useSession } from '@/app/contexts/SessionContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signIn, user, role, loading } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setIsRedirecting(true);
      const redirectPath = role === 'customer' ? '/dashboard' : '/admin';
      // Add a small delay for better UX
      const timeout = setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [user, role, router, loading]);

  const handleSubmit = async (values: any) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-sm">
          {isRedirecting ? 'Redirecting...' : 'Loading session...'}
        </p>
      </div>
    );
  }

  if (!loading && user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <AuthForm mode="login" onSubmit={handleSubmit} />
    </div>
  );
}