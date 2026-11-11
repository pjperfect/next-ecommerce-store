'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function ClearCart() {
  const { loaded, clearCart } = useCart();

  useEffect(() => {
    if (loaded) {
      clearCart();
    }
  }, [loaded, clearCart]);

  return null;
}
