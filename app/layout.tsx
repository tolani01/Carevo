import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../lib/design-tokens.css';
import { AppProvider } from '@/components/AppProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Carevo - Command Center',
  description: 'PHI-lite Kanban board for outpatient clinics',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Skip link for keyboard users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <AppProvider>
          {/* Landmark regions */}
          <div role="application" className="min-h-screen flex flex-col">
            {/* GlobalHeader and nav are rendered inside AppProvider */}
            <main id="main" role="main" className="flex-1 flex flex-col">
              {children}
            </main>
            <footer role="contentinfo" className="sr-only" aria-hidden="true" />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
