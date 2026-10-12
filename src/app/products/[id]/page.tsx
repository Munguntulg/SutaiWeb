import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { catalogApi } from '@/lib/queries';
import { formatPrice, getImageUrl } from '@/lib/utils';
import ProductCard from '@/components/features/ProductCard';
import AddToCartButton from './AddToCartButton';
import Badge from '@/components/ui/Badge';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await catalogApi.getProduct(Number(id));
    const p = res.data.data;
    return {
      title: p.name,
      description: p.description?.substring(0, 160),
      openGraph: {
        images: p.image ? [getImageUrl(p.image)] : [],
      },
    };
  } catch {
    return { title: 'Бүтээгдэхүүн' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  let product;
  let related;
  try {
    const res = await catalogApi.getProduct(Number(id));
    product = res.data.data;
    related = res.data.related;
  } catch {
    notFound();
  }

  const category = product.categories?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-indigo-600">Нүүр</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600">Бүтээгдэхүүн</Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/products?category_id=${category.id}`} className="hover:text-indigo-600">{category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
      </nav>

      {/* Product detail */}
      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            {category && (
              <Link
                href={`/products?category_id=${category.id}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-indigo-600">{formatPrice(product.price)}</p>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Link key={t.id} href={`/products?tag_id=${t.id}`}>
                  <Badge variant="info">#{t.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          {product.description && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
          )}

          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Related products */}
      {related && related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Холбоотой бүтээгдэхүүн</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
