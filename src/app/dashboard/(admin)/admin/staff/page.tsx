// app/dashboard/(admin)/staff/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/utils/supabase/client';
import { User } from '@/types/user';
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper';
import { toast } from 'sonner';

const supabase = createSupabaseClient();

export default function StaffManagement() {
  const router = useRouter();
  const { user, role, authLoading, isLoaded } = useAuthStore();
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isLoaded && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, isLoaded, router]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStaff(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load staff');
      } finally {
        setLoading(false);
      }
    };

    if (user && role === 'admin') fetchStaff();
  }, [user, role]);

  const handleEdit = (user: User) => {
    router.push(`/dashboard/admin/staff/edit/${user.user_id}`);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setLoading(true);
        await supabase.rpc('delete_user', { user_id: userId });
        setStaff(prev => prev.filter(s => s.user_id !== userId));
        toast.success('Staff member deleted successfully');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Deletion failed');
      } finally {
        setLoading(false);
      }
    }
  };

  if (authLoading || !isLoaded) return <div>Authenticating...</div>;
  if (!user || role !== 'admin') return null;

  return (
    <AuthLoadingWrapper>
      <div className="p-6 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Staff Management</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        
        {loading && <div>Loading staff...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Staff Management</h1>
              <Button onClick={() => router.push('/dashboard/admin/add-staff')}>
                Add New Staff
              </Button>
            </div>
            
            <DataTable data={staff} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        )}
      </div>
    </AuthLoadingWrapper>
  );
}