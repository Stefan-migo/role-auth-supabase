// app/dashboard/(admin)/staff/edit/[id]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { EditUserForm } from '@/components/edit-user-form';
import { useAuthStore } from '@/lib/stores/auth.store';
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper';
import { Loader2 } from 'lucide-react';

const supabase = createSupabaseClient();

export default function StaffEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, role, authLoading, isLoaded } = useAuthStore();
  const [staffMember, setStaffMember] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isLoaded && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, isLoaded, router]);

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setStaffMember(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load staff member');
      } finally {
        setLoading(false);
      }
    };

    if (user && role === 'admin') fetchStaffMember();
  }, [id, user, role]);

  const handleSubmit = async (values: User) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('staff')
        .update(values)
        .eq('id', id);

      if (error) throw error;
      router.push('/dashboard/admin/staff');
    } catch (err) {
      console.error('Update failed:', err);
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !isLoaded) return <div>Authenticating...</div>;
  if (!user || role !== 'admin') return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  if (!staffMember) {
    return <div className="p-6">Staff member not found</div>;
  }

  return (
    <AuthLoadingWrapper>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Staff</h1>
        <EditUserForm user={staffMember} onSubmit={handleSubmit} />
      </div>
    </AuthLoadingWrapper>
  );
}