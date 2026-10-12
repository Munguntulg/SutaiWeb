'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { ordersApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import type { OrderStatus } from '@/types';

const STATUS_MAP: Record<OrderStatus, { label: string; variant: 'default' | 'info' | 'success' | 'danger' | 'warning' }> = {
  pending: { label: 'Хүлээгдэж байна', variant: 'warning' },
  processing: { label: 'Боловсруулж байна', variant: 'info' },
  completed: { label: 'Дууссан', variant: 'success' },
  cancelled: { label: 'Цуцлагдсан', variant: 'danger' },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(Number(id)),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancelOrder(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      setCancelError(e.response?.data?.message || 'Цуцлах боломжгүй');
    },
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-60 rounded-xl" />
      </div>
    );
  }

  const order = data?.data.data;
  if (!order) return <div className="text-center py-16 text-gray-500">Захиалга олдсонгүй</div>;

  const status = STATUS_MAP[order.status] || { label: order.status, variant: 'default' as const };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Захиалгууд руу буцах
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Захиалга #{order.id}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.created_at).toLocaleDateString('mn-MN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge variant={status.variant} className="text-sm px-3 py-1">{status.label}</Badge>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6 space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Хүргэлтийн мэдээлэл</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Хүлээн авагч</p>
            <p className="font-medium">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Утас</p>
            <p className="font-medium">{order.customer_phone}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-500">Хаяг</p>
            <p className="font-medium">{order.shipping_address}</p>
          </div>
          {order.note && (
            <div className="sm:col-span-2">
              <p className="text-gray-500">Тэмдэглэл</p>
              <p className="font-medium">{order.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Бүтээгдэхүүн</h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <Package className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-gray-500">{formatPrice(item.price)} × {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4 flex justify-between font-bold">
          <span>Нийт</span>
          <span className="text-indigo-600">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Cancel */}
      {order.status === 'pending' && (
        <div>
          {cancelError && (
            <p className="text-red-600 text-sm mb-2">{cancelError}</p>
          )}
          <Button
            variant="danger"
            onClick={() => cancelMutation.mutate()}
            loading={cancelMutation.isPending}
          >
            Захиалга цуцлах
          </Button>
        </div>
      )}
    </div>
  );
}
