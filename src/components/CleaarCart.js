'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { load } from 'next/dist/compiled/@edge-runtime/primitives/load';

export default function ClearCart() {
  const { clearCart, loaded } = useCart();

  useEffect(() => {
    if (loaded) {
      clearCart();
    }
  }, [loaded, clearCart()]);

  return null;
}
