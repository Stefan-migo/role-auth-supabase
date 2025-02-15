
// src/app/dashboard/components/StaffLayout.tsx
'use client';

export default function SalesLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}