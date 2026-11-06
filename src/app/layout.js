import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';

export const metadata = {
  title: 'Next Store',
  description:
    'E-commerce store built with Next.js, PostgreSQL, Prisma and Stripe',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
