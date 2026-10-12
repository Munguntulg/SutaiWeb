import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { catalogApi } from '@/lib/queries';
import ProductCard from '@/components/features/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Suspense } from 'react';
import type { Category, Product } from '@/types';

async function FeaturedProducts() {
  const res = await catalogApi.getProducts({ sort: 'newest', per_page: 8 });
  const products: Product[] = res.data.data;

  if (!products.length) return <p className="text-gray-500">Бүтээгдэхүүн байхгүй байна.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

async function CategoriesSection() {
  const res = await catalogApi.getCategories();
  const categories: Category[] = res.data.data;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category_id=${cat.id}`}
          className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">
            {cat.name}
          </p>
          {cat.products_count !== undefined && (
            <p className="text-sm text-gray-500 mt-1">{cat.products_count} бүтээгдэхүүн</p>
          )}
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 md:p-14 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Таны хүссэн бүтээгдэхүүн</h1>
        <p className="text-indigo-100 text-lg mb-8">Хамгийн шинэ, чанартай бараанууд нэг дороос</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Бүтээгдэхүүн үзэх <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ангиллууд</h2>
          <Link href="/products" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            Бүгдийг үзэх <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ))}
            </div>
          }
        >
          <CategoriesSection />
        </Suspense>
      </section>

      {/* Newest products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Шинэ бүтээгдэхүүн</h2>
          <Link href="/products?sort=newest" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            Бүгдийг үзэх <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>
      </section>
    </div>
  );
}
