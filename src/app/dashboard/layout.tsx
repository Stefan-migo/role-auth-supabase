// src/app/dashboard/layout.tsx
'use client';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, authLoading, isLoaded } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !authLoading && isLoaded) {
      initialized.current = true;
      const isAuthorized = pathname.startsWith(`/dashboard/${role}`);
      const isRootDashboard = pathname === '/dashboard';
      
      if (!role) {
        router.push('/');
      } else if (!isAuthorized && !isRootDashboard) {
        router.push(`/dashboard/${role}`);
      }
    }
  }, [role, authLoading, isLoaded, pathname, router]);
 
  return (
      <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      Home Page
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{`${role} dashboard`}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}