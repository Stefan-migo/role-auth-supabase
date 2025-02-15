// src/components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuthStore } from '@/lib/stores/auth.store';

export default function LogoutButton() {
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter(); // Initialize the router

  const handleLogout = async () => {
    await signOut(); // Call the signOut function from the store
    router.push('/'); // Redirect to the home page
  };

  return (
    <button
      onClick={handleLogout} // Use the handleLogout function
      className="px-4 py-2 text-black rounded hover:bg-gray-200 transition-colors duration-200"
    >
      Logout
    </button>
  );
}