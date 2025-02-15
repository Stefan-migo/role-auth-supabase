// src/hooks/useAuthActionsAdmin.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth.store';
import { AuthFormValues } from '@/schemas/auth-schema';
import { signUpCustomer, signUpStaff } from '@/utils/authActions';



export const useAuthActionsAdmin = () => {
  const router = useRouter();
  const { signIn, setAuthLoading } = useAuthStore();

  const handleAuthSubmit = async (values: AuthFormValues) => {
    try {
      setAuthLoading(true);

      if (values.mode === 'login') {
        await signIn(values.email, values.password);
        toast.success('Login successful!');
        router.push('/dashboard');
        
      } else if (values.mode === 'customer-signup') {
        await signUpCustomer({
          email: values.email,
          password: values.password,
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone
        });
        toast.success('Registration successful! Please check your email.');
        router.push('/auth');

      } else if (values.mode === 'staff-signup') {
        await signUpStaff({
          email: values.email,
          password: values.password,
          role: values.role,
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone
        });
        toast.success('Staff member created successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return { handleAuthSubmit };
};