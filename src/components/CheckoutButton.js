'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CheckoutButton() {
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleCheckout() {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? 'Something went wrong');
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div>
      {errorMessage && (
        <p
          role="alert"
          className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Redirecting to payment...' : 'Checkout'}
      </button>
    </div>
  );
}
