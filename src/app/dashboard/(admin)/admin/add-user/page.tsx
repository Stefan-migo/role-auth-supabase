//src/app/dev/page.tsx
'use client';

import { useState } from 'react';
import { AuthFormAdmin } from '@/app/dashboard/(admin)/admin/components/AuthFormAdmin';

export default function AuthPage() {
  const [IsCustomer, setIsCustomer] = useState(true);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="flex gap-4">
          <button
            onClick={() => setIsCustomer(true)}
            className={`flex-1 py-2 font-medium ${IsCustomer
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Customer Registration
          </button>
          <button
            onClick={() => setIsCustomer(false)}
            className={`flex-1 py-2 font-medium ${!IsCustomer
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Staff Registration
          </button>
        </div>

        <AuthFormAdmin
          key={IsCustomer ? 'customer-signup' : 'staff-signup'}
          mode={IsCustomer ? 'customer-signup' : 'staff-signup'}
          />
      </div>
    </div>
  );
}