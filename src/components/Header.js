'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold">
          Next Store
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/orders"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            Orders
          </Link>
          <Link
            href="/cart"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            Cart{itemCount > 0 ? ` (${itemCount})` : ''}
          </Link>
        </nav>
      </div>
    </header>
  );
}
