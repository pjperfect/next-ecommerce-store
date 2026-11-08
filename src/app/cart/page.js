'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import CheckoutButton from '@/components/CheckoutButton';

const quantityButtonClass =
  'h-8 w-8 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

export default function CartPage() {
  const { items, loaded, totalCents, setQuantity, removeItem } = useCart();

  if (!loaded) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 text-slate-500">
        Loading your cart...
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold">Your cart</h1>
        <p className="mt-4 text-slate-500">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Your cart</h1>

      <ul className="mt-6 divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-lg bg-slate-100 object-cover"
            />

            <div className="flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium hover:underline"
              >
                {item.name}
              </Link>
              <p className="text-sm text-slate-500">
                {formatPrice(item.priceCents)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={quantityButtonClass}
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className={quantityButtonClass}
              >
                +
              </button>
            </div>

            <p className="w-24 font-semibold sm:text-right">
              {formatPrice(item.priceCents * item.quantity)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-700 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <span className="text-lg">Total</span>
        <span className="text-2xl font-semibold">
          {formatPrice(totalCents)}
        </span>
      </div>
      <div className="mt-6">
        <CheckoutButton />
      </div>
    </main>
  );
}
