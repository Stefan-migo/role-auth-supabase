// app/dashboard/(admin)/management/page.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/utils/supabase/client';
import { User } from '@/types/user';
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper';
import { Loader2 } from 'lucide-react';

const supabase = createSupabaseClient();

export default function CombinedManagement() {
  const router = useRouter();
  const { user, role, authLoading, isLoaded } = useAuthStore();
  const [staff, setStaff] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!authLoading && isLoaded && (!user || role !== 'admin')) {
      router.push('/');
    }
  }, [user, role, authLoading, isLoaded, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (staffError || customersError) {
          throw staffError || customersError;
        }

        setStaff(staffData || []);
        setCustomers(customersData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user && role === 'admin') fetchData();
  }, [user, role]);

  const handleEdit = (user: User) => {
    const basePath = user.role === 'customer'
      ? '/dashboard/admin/customers/edit'
      : '/dashboard/admin/staff/edit';
    router.push(`${basePath}/${user.user_id}`);
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await supabase.rpc('delete_user', { user_id: userId });
        setStaff(prev => prev.filter(s => s.user_id !== userId));
        setCustomers(prev => prev.filter(c => c.user_id !== userId));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Deletion failed');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (authLoading || !isLoaded) return <div>Authenticating...</div>;
  if (!user || role !== 'admin') return null;

  const totalUsers = staff.length + customers.length;

  return (
    <AuthLoadingWrapper>
      <div className="p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Management Dashboard</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {loading && <div>Loading management data...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Staff Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{staff.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Recent Staff Members</h2>
                <DataTable
                  data={staff.slice(0, 5)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Recent Customers</h2>
                <DataTable
                  data={customers.slice(0, 5)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </AuthLoadingWrapper>
  );
}