'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, getImageUrl } from '@/lib/utils';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const category = product.categories?.[0];

  return (
    <div className="group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        {category && <p className="text-xs text-indigo-600 mb-1">{category.name}</p>}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-indigo-600 transition-colors text-sm">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
        <Button
          size="sm"
          className="mt-3 w-full"
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="w-4 h-4 mr-1.5" />
          Сагсанд нэмэх
        </Button>
      </div>
    </div>
  );
}
