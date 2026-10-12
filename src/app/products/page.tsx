import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import { catalogApi } from '@/lib/queries';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Бүтээгдэхүүн',
  description: 'Манай бүх бүтээгдэхүүнүүдийг үзэх',
};

export default async function ProductsPage() {
  const [categoriesRes, tagsRes] = await Promise.all([
    catalogApi.getCategories(),
    catalogApi.getTags(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      }
    >
      <ProductsClient
        categories={categoriesRes.data.data}
        tags={tagsRes.data.data}
      />
    </Suspense>
  );
}
