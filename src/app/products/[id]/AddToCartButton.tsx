'use client';
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';
import type { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <button
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Хасах"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
        <button
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setQuantity(quantity + 1)}
          aria-label="Нэмэх"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <Button size="lg" onClick={handleAdd} className="flex-1 sm:flex-none sm:min-w-[200px]">
        {added ? (
          <>
            <Check className="w-4 h-4 mr-2" /> Нэмэгдлээ!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" /> Сагсанд нэмэх
          </>
        )}
      </Button>
    </div>
  );
}
