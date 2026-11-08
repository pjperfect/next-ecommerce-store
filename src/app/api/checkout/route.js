import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

function isValidItem(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    Number.isInteger(item.id) &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'The request body must be valid JSON' },
      { status: 400 }
    );
  }

  const items = body?.items;

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !items.every(isValidItem)
  ) {
    return Response.json(
      { error: 'Your cart is empty or invalid' },
      { status: 400 }
    );
  }

  const ids = items.map((item) => item.id);

  if (new Set(ids).size !== ids.length) {
    return Response.json(
      { error: 'Each product can only appear once' },
      { status: 400 }
    );
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  const lineItems = [];

  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.id);

    if (!product) {
      return Response.json(
        { error: 'A product in your cart no longer exists' },
        { status: 400 }
      );
    }

    if (item.quantity > product.stock) {
      return Response.json(
        { error: `Only ${product.stock} of ${product.name} left in stock` },
        { status: 400 }
      );
    }

    lineItems.push({ product, quantity: item.quantity });
  }

  const totalCents = lineItems.reduce(
    (total, line) => total + line.product.priceCents * line.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      totalCents,
      items: {
        create: lineItems.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
          priceCents: line.product.priceCents,
        })),
      },
    },
  });

  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: line.product.priceCents,
          product_data: { name: line.product.name },
        },
      })),
      metadata: { orderId: String(order.id) },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });
  } catch (error) {
    console.error(error);
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });
    return Response.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 502 }
    );
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return Response.json({ url: session.url });
}
