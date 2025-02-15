// src/utils/authActions.ts
'use server'
import { User, Session } from '@supabase/supabase-js';
import { createSupabaseServerClient } from './supabase/server';
import { redirect } from 'next/navigation';


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
  const supabase = await createSupabaseServerClient();
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        ...data,
        user_type: 'customer'
      }
    }
  });

  if (error) throw error;
  return authData;
}

/**
 * Sign up a new staff member.
 * 1. Creates a new auth user.
 * 2. Inserts additional profile info (including role) into the "staff" table.
 */
export async function signUpStaff(data: StaffSignupData) {
  const supabase = await createSupabaseServerClient();
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        ...data,
        user_type: 'staff'
      }
    }
  });

  if (error) throw error;
  return authData;
}

/**
 * Sign in an existing user (either customer or staff).
 * Authenticates the user and then checks the "staff" table to determine if the user is a staff member.
 */
export async function signInUser(email: string, password: string) {
  const supabase = await createSupabaseServerClient();

  console.log('[1] Attempting sign in with:', email);

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(`Sign in error: ${error.message}`);
  if (!authData.session) throw new Error('Sign in failed: No session created');

  return { session: authData.session };
}


/**
 * Retrieve the current authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
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



export async function resetPassword(email: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
  return true;
}

export async function deleteUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  // Use transaction to delete from both tables
  const { error } = await supabase.rpc('delete_user', {
    user_id: userId
  });

  if (error) throw new Error(error.message);
  return true;
}

// Basic update (name, phone)
export async function updateMemberBasic(userId: string, data: Partial<User>) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('staff')
    .update(data)
    .eq('user_id', userId)
    .select();

  if (error) {
    const { error: customerError } = await supabase
      .from('customers')
      .update(data)
      .eq('user_id', userId)
      .select();
      
    if (customerError) throw new Error(customerError.message);
  }
  
  return true;
}

// Advanced update (email/password)
export async function updateMemberAdvanced(userId: string, updates: { 
  email?: string, 
  password?: string 
}) {
  const supabase = await createSupabaseServerClient();
  
  if (updates.email) {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email: updates.email
    });
    if (error) throw new Error(error.message);
  }

  if (updates.password) {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: updates.password
    });
    if (error) throw new Error(error.message);
  }
  
  return true;
}