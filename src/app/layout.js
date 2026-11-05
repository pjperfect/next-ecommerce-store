import './globals.css';

export const metadata = {
  title: 'Next Store',
  description:
    'E-commerce store built with Next.js, PostreSQL, Prisma and Stripe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
