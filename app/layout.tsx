import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import Providers from '@/lib/providers';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });

export const metadata: Metadata = {
  title: 'PulseFit - Unlock Your Potential',
  description: 'Premium Gym Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable}`}>
      <body className="antialiased font-sans bg-slate-950 text-white min-h-screen selection:bg-neon selection:text-slate-950">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
