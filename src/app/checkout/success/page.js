import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/format';
import ClearCart from '@/components/ClearCart';

export default async function CheckoutSuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    notFound();
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    notFound();
  }

  if (session.payment_status !== 'paid') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Payment not completed</h1>
        <p className="mt-2 text-slate-500">
          Your cart is still saved, so you can try again.
        </p>
        <Link
          href="/cart"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          Back to your cart
        </Link>
      </main>
    );
  }

  const email = session.customer_details?.email;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <ClearCart />
      <h1 className="text-3xl font-semibold">Thank you for your order</h1>
      <p className="mt-2 text-slate-600">Order number: {order.id}</p>
      {email && <p className="text-slate-600">Email: {email}</p>}

      <ul className="mt-6 divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-slate-500">
                {item.quantity} x {formatPrice(item.priceCents)}
              </p>
            </div>
            <p className="font-semibold">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <span className="text-lg">Total</span>
        <span className="text-2xl font-semibold">
          {formatPrice(order.totalCents)}
        </span>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        Continue shopping
      </Link>
    </main>
  );
}
