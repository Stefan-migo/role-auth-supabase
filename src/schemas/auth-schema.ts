//src/schemas/auth-schema.ts

import { z } from 'zod';

// Base schema for common fields
const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Login schema
const loginSchema = baseSchema.extend({
  mode: z.literal('login'),
});

// Customer signup schema
const customerSignupSchema = baseSchema.extend({
  mode: z.literal('customer-signup'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Invalid phone number'),
});

// Staff signup schema
const staffSignupSchema = baseSchema.extend({
  mode: z.literal('staff-signup'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Invalid phone number'),
  role: z.enum(['sales', 'optometrist', 'admin']),
});

// Combined schema using discriminated union
export const AuthFormSchema = z.discriminatedUnion('mode', [
  loginSchema,
  customerSignupSchema,
  staffSignupSchema,
]);

// Type export for form values
export type AuthFormValues = z.infer<typeof AuthFormSchema>;