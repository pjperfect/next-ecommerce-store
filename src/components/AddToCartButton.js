'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 3000);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {outOfStock ? 'Out of stock' : 'Add to cart'}
      </button>

      {justAdded && (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          Added to cart.{' '}
          <Link href="/cart" className="font-medium underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
