
// src/app/dashboard/components/OptometristLayout.tsx
'use client';

export default function OptometristLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}