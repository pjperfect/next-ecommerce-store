import Image from 'next/image';
import Link from 'next/link';
import { formatCategory, formatPrice } from '@/lib/format';

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={400}
        className="aspect-square w-full bg-slate-100 object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-slate-500">
          {formatCategory(product.category)}
        </p>
        <h2 className="mt-1 font-medium">{product.name}</h2>
        <p className="mt-auto pt-3 text-lg font-semibold">
          {formatPrice(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}
