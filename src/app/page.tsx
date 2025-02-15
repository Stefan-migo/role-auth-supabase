//src/app/page.tsx
'use client';

import LogoutButton from '@/components/LogoutButton';
import { useAuthStore } from '@/lib/stores/auth.store';

import Link from 'next/link';

export default function Home() {
  const { role, user } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Our Platform
        </h1>
        <p className="text-lg text-gray-600">
          Get started by creating an account or logging in
        </p>
        <div className="space-x-4">
          <Link
            href="/auth"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <p>Logged in as: {user.email}</p>
            <p>Your role: {role}</p>
            <LogoutButton />
          </div>
        ) : (
          <p>No user is logged in.</p>
        )}
      </div>
    </div>
  );
}