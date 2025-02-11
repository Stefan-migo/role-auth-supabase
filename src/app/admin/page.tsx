'use client';

import { useState } from 'react';
import { AuthForm } from '@/app/auth/components/AuthForm';

import {
  signInUser,
  signUpCustomer,
  signUpStaff,
} from '@/utils/authActions';
import { AuthFormValues } from '@/schemas/auth-schema';


export async function handleAuthSubmit(values: AuthFormValues) {
  try {
    if (values.mode === 'login') {
      // Login flow: call signInUser with email and password.
      const { user, session, role } = await signInUser(
        values.email,
        values.password
      );
      console.log('Logged in user:', user, session, role);
      // TODO: Redirect the user or update your session context.
    } else if (values.mode === 'customer-signup') {
      // Customer signup: combine first and last names.
      const customerData = {
        email: values.email,
        password: values.password,
        fullName: `${values.first_name} ${values.last_name}`,
        phone: values.phone,
      };
      const { user, session } = await signUpCustomer(customerData);
      console.log('Customer signed up:', user, session);
      // TODO: Redirect the user, show a success message, etc.
    } else if (values.mode === 'staff-signup') {
      // Staff signup: combine first and last names and pass the role.
      const staffData = {
        email: values.email,
        password: values.password,
        role: values.role, // should be 'sales', 'optometrist', or 'admin'
        fullName: `${values.first_name} ${values.last_name}`,
        phone: values.phone,
      };
      const { user, session } = await signUpStaff(staffData);
      console.log('Staff signed up:', user, session);
      // TODO: Redirect the user, show a success message, etc.
    }
  } catch (error: any) {
    console.error('Authentication error:', error);
    // TODO: Show an error message to the user (e.g., using a toast).
  }
}


export default function AuthPage() {
  const [IsCustomer, setIsCustomer] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

        <AuthForm key={IsCustomer ? 'customer-signup' : 'staff-signup'}
          mode={IsCustomer ? 'customer-signup' : 'staff-signup'}
          onSubmit={handleAuthSubmit} />
      </div>
    </div>
  );
}