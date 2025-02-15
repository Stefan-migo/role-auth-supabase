
// src/app/dashboard/(admin)/layout.tsx
'use client';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}