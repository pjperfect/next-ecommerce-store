import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-500">
        We could not find what you were looking for.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        back to the store
      </Link>
    </main>
  );
}
