import Link from 'next/link';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600">
            <Store className="w-5 h-5" />
            <span>Дэлгүүр</span>
          </Link>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/products" className="hover:text-gray-900 dark:hover:text-white transition-colors">Бүтээгдэхүүн</Link>
            <Link href="/cart" className="hover:text-gray-900 dark:hover:text-white transition-colors">Сагс</Link>
            <Link href="/orders" className="hover:text-gray-900 dark:hover:text-white transition-colors">Захиалгууд</Link>
          </div>
          <p className="text-sm text-gray-400">© 2024 Дэлгүүр. Бүх эрх хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}
