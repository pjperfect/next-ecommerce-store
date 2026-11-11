import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markOrderPaid } from '@/lib/orders';

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature check failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = Number(session.metadata?.orderId);

    if (session.payment_status === 'paid' && orderId) {
      await markOrderPaid(orderId, session.customer_details?.email);
    }
  }

  return NextResponse.json({ received: true });
}
