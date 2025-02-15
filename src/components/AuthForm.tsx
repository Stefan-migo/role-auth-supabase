
//src/app/auth/components/AuthForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuthFormSchema, type AuthFormValues } from '@/schemas/auth-schema';
import { useAuthActions } from '@/hooks/useAuthActions';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/auth.store'; 

interface AuthFormProps {
  mode: 'login' | 'customer-signup' | 'staff-signup';
  loading?: boolean;
}

export function AuthForm({ mode, loading }: AuthFormProps) {
  const { handleAuthSubmit } = useAuthActions();
  const { authLoading } = useAuthStore();
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      mode, // Ensure the mode is included
      email: '',
      password: '',
      ...(mode !== 'login' && {
        first_name: '',
        last_name: '',
        phone: '',
      }),
      ...(mode === 'staff-signup' && {
        role: 'sales',
      }),
    },
  });


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAuthSubmit)} className={cn("flex flex-col gap-4")}>

        {mode == 'login' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
        )}
        {mode !== 'login' && (

          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-bold">Create a new account</h1>
          </div>
        )}


        {/* Hidden mode field */}
        <input type="hidden" {...form.register('mode')} />

        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode == 'login' && (
          <a
            href="/auth/reset-password"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        )}


        {/* Additional fields for signup */}
        {mode !== 'login' && (
          <>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Role selection for staff signup */}
        {mode === 'staff-signup' && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="optometrist">Optometrist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={authLoading}
        >
          {authLoading ? 'Loading...' : `${mode === 'login' ? 'Sign In' : 'Create Account'}`}
          {/* {mode === 'login' ? 'Sign In' : 'Create Account'} */}
        </Button>
      </form>
    </Form>
  );
}


