'use client';

import { Button } from "@/components/ui/button"; // shadcn/ui Button component
import { useRouter } from "next/navigation"; // Next.js navigation

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
        {/* Icon or Illustration */}
        <div className="text-6xl">🚫</div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">Unauthorized Access</h1>

        {/* Description */}
        <p className="text-gray-600">
          You don't have permission to view this page. Please contact the
          administrator if you believe this is a mistake.
        </p>

        {/* Action Button */}
        <Button
          onClick={() => router.push("/")} // Redirect to home page
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
        >
          Go Back to Home
        </Button>
      </div>
    </div>
  );
}