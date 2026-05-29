import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// Minimal root layout for app router
export const metadata = {
  title: 'Car Rental Admin',
  description: 'Admin dashboard for car rental system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex min-h-screen">
          {/* Sidebar will be a client component */}
          <div className="w-64 hidden md:block border-r border-slate-200 dark:border-slate-800">
            {/* Sidebar placeholder */}
            <div className="p-4">Sidebar</div>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
