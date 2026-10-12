'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ordersApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import type { OrderStatus } from '@/types';

const STATUS_MAP: Record<OrderStatus, { label: string; variant: 'default' | 'info' | 'success' | 'danger' | 'warning' }> = {
  pending: { label: 'Хүлээгдэж байна', variant: 'warning' },
  processing: { label: 'Боловсруулж байна', variant: 'info' },
  completed: { label: 'Дууссан', variant: 'success' },
  cancelled: { label: 'Цуцлагдсан', variant: 'danger' },
};

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders(1),
    enabled: !!user,
  });

  const orders = data?.data.data ?? [];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Миний захиалгууд</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">Захиалга байхгүй байна</p>
          <Link href="/products" className="text-indigo-600 hover:underline">
            Дэлгүүр хэсэх
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_MAP[order.status] || { label: order.status, variant: 'default' as const };
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Захиалга #{order.id}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('mn-MN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {order.items?.length || 0} бүтээгдэхүүн
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <p className="font-bold text-indigo-600">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
