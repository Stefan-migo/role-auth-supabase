// types/user.ts
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    email: string;
    role?: 'admin' | 'sales' | 'optometrist' | 'customer';
    created_at: string;
    user_id?: string; // Match Supabase auth.users id
  }