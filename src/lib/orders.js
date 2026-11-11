import { prisma } from '@/lib/prisma';

export async function markOrderPaid(orderId, customerEmail) {
  const result = await prisma.order.updateMany({
    where: { id: orderId, status: 'PENDING' },
    data: { status: 'PAID', email: customerEmail },
  });

  return result.count === 1;
}
