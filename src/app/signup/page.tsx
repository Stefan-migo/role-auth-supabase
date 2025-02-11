'use client';

import { AuthForm } from '@/app/auth/components/AuthForm';
import { signUpCustomer } from '@/utils/authActions';
import { useRouter } from 'next/navigation';

export default function CustomerSignupPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const { email, password, first_name, last_name, phone } = values;
      await signUpCustomer({
        email,
        password,
        firstName: first_name,
        lastName: last_name,
        phone,
      });
      
      // Redirect to confirmation notice
      router.push('/waiting-confirmation');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Registration</h1>
      <AuthForm mode="customer-signup" onSubmit={handleSubmit} />
    </div>
  );
}