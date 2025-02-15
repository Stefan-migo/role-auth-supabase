"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class" // Use class-based theming to avoid hydration issues
      defaultTheme="system" // Default to system theme to match server and client
      enableSystem={true} // Enable system theme detection
      disableTransitionOnChange // Disable theme transition to avoid flickering
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}