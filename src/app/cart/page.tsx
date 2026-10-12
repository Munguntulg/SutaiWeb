'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Сагс хоосон байна</h1>
        <p className="text-gray-500 mb-6">Бүтээгдэхүүн сонгоод сагсанд нэмнэ үү</p>
        <Link href="/products">
          <Button size="lg">Дэлгүүр хэсэх</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Миний сагс</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <Link href={`/products/${product.id}`} className="shrink-0">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition-colors line-clamp-2 text-sm">
                  {product.name}
                </Link>
                <p className="text-indigo-600 font-bold mt-1">{formatPrice(product.price)}</p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Хасах"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium">{quantity}</span>
                    <button
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Нэмэх"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 ml-auto">{formatPrice(product.price * quantity)}</p>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    aria-label="Устгах"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 mt-2"
          >
            <Trash2 className="w-4 h-4" /> Сагс цэвэрлэх
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="font-bold text-lg mb-4">Нийт</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="line-clamp-1 flex-1 mr-2">{product.name} ×{quantity}</span>
                  <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between font-bold text-lg mb-6">
              <span>Нийт дүн</span>
              <span className="text-indigo-600">{formatPrice(totalPrice())}</span>
            </div>
            <Link href="/checkout">
              <Button size="lg" className="w-full">Захиалга хийх</Button>
            </Link>
            <Link href="/products" className="block text-center text-sm text-gray-500 mt-3 hover:text-indigo-600 transition-colors">
              Дэлгүүр хэсэх
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
