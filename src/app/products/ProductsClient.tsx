'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { catalogApi } from '@/lib/queries';
import ProductCard from '@/components/features/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Category, Tag } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Шинэ эхэлж' },
  { value: 'price_asc', label: 'Үнэ: бага → их' },
  { value: 'price_desc', label: 'Үнэ: их → бага' },
  { value: 'name', label: 'Нэр' },
] as const;

export default function ProductsClient({
  categories,
  tags,
}: {
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
  const tagId = searchParams.get('tag_id') ? Number(searchParams.get('tag_id')) : undefined;
  const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined;
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined;
  const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'price_asc' | 'price_desc' | 'name';
  const page = Number(searchParams.get('page') || 1);

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '1');
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, categoryId, tagId, minPrice, maxPrice, sort, page }],
    queryFn: () =>
      catalogApi.getProducts({
        search,
        category_id: categoryId,
        tag_id: tagId,
        min_price: minPrice,
        max_price: maxPrice,
        sort,
        page,
        per_page: 12,
      }),
  });

  const products = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Бүтээгдэхүүн хайх..."
              defaultValue={search}
              onChange={(e) => {
                const val = e.target.value;
                const timeout = setTimeout(() => updateParam('search', val || undefined), 500);
                return () => clearTimeout(timeout);
              }}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Шүүлтүүр
          </Button>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Ангилал</label>
              <select
                value={categoryId || ''}
                onChange={(e) => updateParam('category_id', e.target.value || undefined)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              >
                <option value="">Бүгд</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Таг</label>
              <select
                value={tagId || ''}
                onChange={(e) => updateParam('tag_id', e.target.value || undefined)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              >
                <option value="">Бүгд</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <Input
              label="Хамгийн бага үнэ"
              type="number"
              placeholder="0"
              defaultValue={minPrice}
              onChange={(e) => updateParam('min_price', e.target.value || undefined)}
            />
            <Input
              label="Хамгийн их үнэ"
              type="number"
              placeholder="1000000"
              defaultValue={maxPrice}
              onChange={(e) => updateParam('max_price', e.target.value || undefined)}
            />
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push('/products');
                  setFiltersOpen(false);
                }}
                className="text-gray-500 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Шүүлтүүр цэвэрлэх
              </Button>
            </div>
          </div>
        )}

        {/* Active filters chips */}
        <div className="flex flex-wrap gap-2">
          {categoryId && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {categories.find((c) => c.id === categoryId)?.name}
              <button onClick={() => updateParam('category_id', undefined)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {tagId && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {tags.find((t) => t.id === tagId)?.name}
              <button onClick={() => updateParam('tag_id', undefined)}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>

        {/* Results count */}
        {meta && (
          <p className="text-sm text-gray-500">
            Нийт <span className="font-medium text-gray-900 dark:text-white">{meta.total}</span> бүтээгдэхүүн
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Бүтээгдэхүүн олдсонгүй</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/products')}>
              Шүүлтүүр цэвэрлэх
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => updateParam('page', String(page - 1))}
            >
              ← Өмнөх
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {page} / {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.last_page}
              onClick={() => updateParam('page', String(page + 1))}
            >
              Дараах →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
