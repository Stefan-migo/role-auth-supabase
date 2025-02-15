// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const { data: { session }, error } = await supabase.auth.getSession();
  const path = request.nextUrl.pathname;

  // Auth required paths
  const authPaths = ['/dashboard', '/dashboard/admin', '/dashboard/sales', '/dashboard/optometrist'];

  if (!session && authPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Check role-based access for authenticated users
  if (session && path.startsWith('/dashboard')) {
    const { data: staff } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    const userRole = staff?.role || 'customer';

    let requiredRole: string | null = null;
    if (path.startsWith('/dashboard/admin')) requiredRole = 'admin';
    else if (path.startsWith('/dashboard/sales')) requiredRole = 'sales';
    else if (path.startsWith('/dashboard/optometrist')) requiredRole = 'optometrist';
    else if (path === '/dashboard') requiredRole = 'customer';

    if (requiredRole && userRole !== requiredRole) {
      const redirectPath = userRole === 'customer' ? '/dashboard' : `/dashboard/${userRole}`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }


  return response;
}