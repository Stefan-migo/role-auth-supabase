import "./globals.css";
import { SessionProvider } from "./contexts/SessionContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
