'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ordersApi } from '@/lib/queries';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useState } from 'react';

const schema = z.object({
  customer_name: z.string().min(2, 'Нэр оруулна уу'),
  customer_phone: z.string().min(8, 'Утасны дугаар оруулна уу'),
  shipping_address: z.string().min(10, 'Хаяг оруулна уу'),
  note: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) router.push('/login?redirect=/checkout');
    if (items.length === 0) router.push('/cart');
  }, [user, items.length, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customer_name: user?.name || '' },
  });

  const onSubmit = async (data: FormData) => {
    setServerErrors({});
    try {
      const res = await ordersApi.placeOrder({
        ...data,
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
      });
      clearCart();
      router.push(`/orders/${res.data.data.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      if (e.response?.data?.errors) {
        const flat: Record<string, string> = {};
        Object.entries(e.response.data.errors).forEach(([k, v]) => {
          flat[k] = v[0];
        });
        setServerErrors(flat);
      }
    }
  };

  if (!user || items.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Захиалга хийх</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
          <Input
            label="Хүлээн авагчийн нэр"
            id="customer_name"
            error={errors.customer_name?.message || serverErrors.customer_name}
            {...register('customer_name')}
          />
          <Input
            label="Утасны дугаар"
            id="customer_phone"
            type="tel"
            placeholder="99112233"
            error={errors.customer_phone?.message || serverErrors.customer_phone}
            {...register('customer_phone')}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Хүргэлтийн хаяг
            </label>
            <textarea
              id="shipping_address"
              rows={3}
              placeholder="УБ, СБД, 1-р хороо, 5-р байр, 12 тоот"
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.shipping_address || serverErrors.shipping_address
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              {...register('shipping_address')}
            />
            {(errors.shipping_address?.message || serverErrors.shipping_address) && (
              <p className="mt-1 text-xs text-red-600">{errors.shipping_address?.message || serverErrors.shipping_address}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Тэмдэглэл (заавал биш)
            </label>
            <textarea
              id="note"
              rows={2}
              placeholder="Хүргэлтийн тэмдэглэл..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('note')}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Захиалга баталгаажуулах
          </Button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="font-bold text-lg mb-4">Захиалгын дэлгэрэнгүй</h2>
            <div className="space-y-2 text-sm">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="line-clamp-1 flex-1 mr-2">{product.name} ×{quantity}</span>
                  <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3 flex justify-between font-bold">
              <span>Нийт</span>
              <span className="text-indigo-600">{formatPrice(totalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
