import { prisma } from '@/lib/prisma';
import { formatCategory } from '@/lib/format';
import ProductCard from '@/components/ProductCard';

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

const sortOptions = {
  newest: { createdAt: 'desc' },
  'price-asc': { priceCents: 'asc' },
  'price-desc': { priceCents: 'desc' },
  name: { name: 'asc' },
};

export default async function Home({ searchParams }) {
  const { search = '', category = '', sort = 'newest' } = await searchParams;

  const where = {};
  if (search) where.name = { contains: search, mode: 'insensitive' };
  if (category) where.category = category;

  const products = await prisma.product.findMany({
    where,
    orderBy: sortOptions[sort] ?? sortOptions.newest,
  });

  const categoryRows = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Store</h1>

      <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search products"
          className={fieldClass}
        />
        <select name="category" defaultValue={category} className={fieldClass}>
          <option value="">All categories</option>
          {categoryRows.map((row) => (
            <option key={row.category} value={row.category}>
              {formatCategory(row.category)}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className={fieldClass}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name: A to Z</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Apply
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">{products.length} products</p>

      {products.length === 0 ? (
        <p className="mt-6 text-slate-500">No products match your search.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
