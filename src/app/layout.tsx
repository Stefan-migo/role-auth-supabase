// app/layout.tsx
'use client';

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { GlobalLoading } from '@/components/global-loading';
import { AuthRouter } from "@/app/contexts/AuthRouter";
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper';
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
          <AuthRouter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position="top-center" />
              <GlobalLoading />
              {children}
            </ThemeProvider>
          </AuthRouter>
        </Suspense>
        
      </body>
    </html>
  );
}