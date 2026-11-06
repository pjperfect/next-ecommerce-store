import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCategory, formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  let stockMessage = 'In stock';
  if (product.stock === 0) {
    stockMessage = 'Out of stock';
  } else if (product.stock <= 5) {
    stockMessage = `Only ${product.stock} left`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        Back to all products
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={600}
          priority
          className="aspect-square w-full rounded-2xl bg-slate-100 object-cover"
        />

        <div>
          <p className="text-sm text-slate-500">
            {formatCategory(product.category)}
          </p>
          <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold">
            {formatPrice(product.priceCents)}
          </p>
          <p className="mt-2 text-sm text-slate-500">{stockMessage}</p>
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
          <p className="mt-6 text-slate-700">{product.description}</p>
        </div>
      </div>
    </main>
  );
}
