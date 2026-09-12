import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Syntra — LeetCode to GitHub Auto-Sync & DSA Tracker',
  description: 'Automated LeetCode Accepted Solution Syncing & DSA Progress Tracker Dashboard',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
