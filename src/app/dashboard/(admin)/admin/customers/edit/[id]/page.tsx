// app/dashboard/(admin)/customers/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { User } from '@/types/user';
import { createSupabaseClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper';
import { Loader2 } from 'lucide-react';

const supabase = createSupabaseClient();

export default function CustomersManagement() {
  const router = useRouter();
  const { user, role, authLoading, isLoaded } = useAuthStore();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isLoaded && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, isLoaded, router]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    if (user && role === 'admin') fetchCustomers();
  }, [user, role]);

  const handleEdit = (user: User) => {
    router.push(`/dashboard/admin/customers/edit/${user.id}`);
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        setLoading(true);
        await supabase.rpc('delete_user', { user_id: userId });
        setCustomers(prev => prev.filter(c => c.id !== userId));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Deletion failed');
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
            <BreadcrumbPage>Customers Management</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Customers Management</h1>
              <Button onClick={() => router.push('/dashboard/admin/add-user')}>
                Add New Customer
              </Button>
            </div>

            <DataTable data={customers} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        )}
      </div>
    </AuthLoadingWrapper>
  );
}