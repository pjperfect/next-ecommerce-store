import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import OrderStatusTracker from '@/components/OrderStatusTracker';

export const metadata = { title: 'Find your orders' };

export default async function OrdersPage({ searchParams }) {
  const { email = '', orderNumber = '' } = await searchParams;
  const trimmedEmail = email.trim();
  const trimmedOrderNumber = orderNumber.trim();
  const hasSearched = trimmedEmail !== '';

  let orders = [];

  if (hasSearched) {
    const where = { email: { equals: trimmedEmail, mode: 'insensitive' } };

    if (trimmedOrderNumber !== '') {
      const orderId = Number(trimmedOrderNumber);
      where.id = Number.isInteger(orderId) ? orderId : 0;
    }

    orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Find your orders</h1>
      <p className="mt-1 text-sm text-slate-600">
        Enter the email you used at checkout. Add an order number to narrow it
        down.
      </p>

      <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_10rem_auto]">
        <input
          name="email"
          type="email"
          required
          defaultValue={email}
          placeholder="Email"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          name="orderNumber"
          inputMode="numeric"
          defaultValue={orderNumber}
          placeholder="Order number"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
        >
          Find orders
        </button>
      </form>

      {hasSearched && orders.length === 0 && (
        <p className="mt-8 text-slate-600">
          No orders found for those details.
        </p>
      )}

      <ul className="mt-8 space-y-6">
        {orders.map((order) => (
          <li key={order.id} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold">Order #{order.id}</h2>
              <p className="text-sm text-slate-500">
                {order.createdAt.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="mt-4">
              <OrderStatusTracker status={order.status} />
            </div>

            <ul className="mt-4 divide-y divide-slate-100 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-2">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.priceCents * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-right font-semibold">
              Total {formatPrice(order.totalCents)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
