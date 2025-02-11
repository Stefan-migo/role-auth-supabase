//src/app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
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
      </div>
    </div>
  );
}