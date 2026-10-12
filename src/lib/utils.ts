import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProductImage } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getImageUrl(image: ProductImage | string | null | undefined): string {
  if (!image) return '/placeholder.svg';
  if (typeof image === 'string') return image;
  return image.url || image.thumbnail || '/placeholder.svg';
}
