// src/app/dashboard/page.tsx
'use client';
import { useAuthStore } from '@/lib/stores/auth.store';
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper';

export default function Dashboard() {
  const { role } = useAuthStore();

  return (
    <AuthLoadingWrapper>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to your {role} dashboard</h1>
        {/* Add role-specific content here */}
      </div>
    </AuthLoadingWrapper>
  );
}