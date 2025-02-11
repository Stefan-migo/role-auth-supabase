// src/utils/authActions.ts

import { User, Session } from '@supabase/supabase-js';
import { createClient } from './supabase/client';

export type StaffRole = 'sales' | 'optometrist' | 'admin';

export interface CustomerSignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  // add other customer-specific fields as needed
}

export interface StaffSignupData {
  email: string;
  password: string;
  role: StaffRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  // add other staff-specific fields as needed
}

/**
 * Sign up a new customer.
 * 1. Creates a new auth user.
 * 2. Inserts additional profile info into the "customers" table.
 */
export async function signUpCustomer(data: CustomerSignupData) {
  const supabase = createClient();
  const { email, password, ...profile } = data;

  // 1. Create auth user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    email_confirm: true,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        user_type: 'customer'
      }
    }
  });

  if (authError) throw new Error(`Auth error: ${authError.message}`);
  if (!authData.user) throw new Error('Signup failed: No user created');

  // 2. Wait for session propagation
  let retries = 5;
  while (retries > 0) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) break;
    await new Promise(resolve => setTimeout(resolve, 200));
    retries--;
  }

  // // 3. Insert customer profile
  // const { error: dbError } = await supabase.from('customers').insert({
  //   user_id: authData.user.id,
  //   email,
  //   ...profile
  // });

  // if (dbError) {
  //   // Rollback auth user if profile creation fails
  //   await supabase.auth.admin.deleteUser(authData.user.id);
  //   throw new Error(`Profile creation failed: ${dbError.message}`);
  // }

  return {
    user: authData.user,
    session: authData.session
  };
}

/**
 * Sign up a new staff member.
 * 1. Creates a new auth user.
 * 2. Inserts additional profile info (including role) into the "staff" table.
 */
export async function signUpStaff(data: StaffSignupData): Promise<{
  user: User | null;
  session: Session | null;
}> {
  const { email, password, role, ...profile } = data;
  const supabase = createClient();

  // Create a new auth entry with email confirmed (FOR DEVELOPMENT ONLY)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        email_confirm: true, // REMOVE THIS IN PRODUCTION
      },
  });
  if (authError) {
    throw new Error(`Auth signup error: ${authError.message}`);
  }
  const user = authData.user;
  if (!user) {
    throw new Error('Staff signup failed: no user returned.');
  }

  // Insert the staff profile data into the "staff" table.
  // Again, we use "user_id" to store the auth user’s id.
  const { error: dbError } = await supabase.from('staff').insert([
    {
      user_id: user.id,
      email,
      role,
      ...profile,
    },
  ]);
  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }

  return { user, session: authData.session };
}

/**
 * Sign in an existing user (either customer or staff).
 * Authenticates the user and then checks the "staff" table to determine if the user is a staff member.
 */
export async function signInUser(email: string, password: string) {
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(`Sign in error: ${error.message}`);

  // Wait briefly for auth state propagation.
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Retrieve fresh user data.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sign in failed: no user returned.');

  // Check if the user is a staff member by querying the "staff" table.
  let role = 'customer';
  const { data: staffData } = await supabase
    .from('staff')
    .select('role')
    .eq('user_id', user.id)
    .single();
  if (staffData && staffData.role) {
    role = staffData.role;
  }

  return { user, session: authData.session, role };
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Sign out error: ${error.message}`);
  }
}

/**
 * Retrieve the current authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  // Check if we have a valid session.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  // Retrieve the user.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
  return user;
}

/**
 * (Optional) Utility function to fetch the role of the currently authenticated user.
 * Queries the "staff" table using the user_id; if not found, defaults to "customer".
 */
export async function getUserRole(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('role')
    .eq('user_id', userId)
    .single();
  if (!staffError && staffData) {
    return staffData.role;
  }
  return 'customer';
}

// Sign in with Google
export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}
