'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock === 0;

  return(
    <button
      type="button"
      onClick={() => addItem(product)}
      disabled={outOfStock}
      className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {outOfStock ? 'Out of stock' : 'Add to cart'}
    </button>
  );
}
