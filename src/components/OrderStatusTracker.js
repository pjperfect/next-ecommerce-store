const trackerSteps = [
  { status: 'PENDING', label: 'Awaiting payment' },
  { status: 'PAID', label: 'Paid' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export default function OrderStatusTracker({ status }) {
  if (status === 'CANCELLED') {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
        This order was cancelled
      </p>
    );
  }

  const currentIndex = trackerSteps.findIndex((step) => step.status === status);

  return (
    <ol className="grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
      {trackerSteps.map((step, index) => {
        const isReached = index <= currentIndex;

        return (
          <li key={step.status}>
            <div
              className={`h-2 rounded-full ${isReached ? 'bg-emerald-500' : 'bg-slate-200'}`}
            />
            <p
              className={`mt-2 ${isReached ? 'font-medium text-slate-900' : 'text-slate-400'}`}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
