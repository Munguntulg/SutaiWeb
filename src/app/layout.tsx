import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import QueryProvider from '@/components/providers/QueryProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Дэлгүүр — E-commerce',
    template: '%s | Дэлгүүр',
  },
  description: 'Чанартай бүтээгдэхүүнүүдийн онлайн дэлгүүр',
  keywords: ['дэлгүүр', 'e-commerce', 'бүтээгдэхүүн', 'захиалга'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <Suspense fallback={<div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
