import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const res = await fetch(
    'https://dummyjson.com/products?limit=100&select=title,description,category,price,stock,thumbnail'
  );

  if (!res.ok) {
    throw new Error(`Could not load products: ${res.status}`);
  }

  const data = await res.json();
  const usedSlugs = new Set();

  for (const item of data.products) {
    let slug = slugify(item.title);
    if (usedSlugs.has(slug)) {
      slug = `${slug} - ${item.id}`;
    }
    usedSlugs.add(slug);

    const product = {
      name: item.title,
      slug,
      description: item.description,
      priceCents: Math.round(item.price * 100),
      imageUrl: item.thumbnail,
      category: item.category,
      stock: item.stock,
    };

    await prisma.product.upsert({
      where: { slug },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${usedSlugs.size} products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
