'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, Store, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const { resolvedTheme, setTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Нүүр' },
    { href: '/products', label: 'Бүтээгдэхүүн' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-600">
            <Store className="w-5 h-5" />
            <span>Дэлгүүр</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === l.href
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Загвар солих"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link href="/products" className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Хайх">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Сагс">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href={user ? '/profile' : '/login'}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Профайл"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Цэс"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 space-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block py-2 text-sm font-medium',
                pathname === l.href ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300">Захиалгууд</Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300">Профайл</Link>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300">Нэвтрэх</Link>
          )}
        </div>
      )}
    </nav>
  );
}
