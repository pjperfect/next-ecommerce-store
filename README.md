# Next Store

A full-stack online store with a product catalogue, a shopping cart, Stripe test checkout and order tracking.

**Live store:** https://next-ecommerce-store-two.vercel.app

The store runs in Stripe test mode so no real money moves. Pay with a test card, e.g. `4242 4242 4242 4242` with any future expiry date and any three-digit security code.

## Features

- Catalogue of 100 products with search, a category filter and sorting by newest, price or name
- Product detail pages with stock status
- Shopping cart with quantity controls limited by stock and saved in the browser
- Stripe Checkout in test mode
- Orders marked as paid by a Stripe webhook after its signature is verified
- Order lookup by email with an optional order number
- Order status tracker showing Awaiting payment, Paid, Shipped and Delivered or Cancelled
- Responsive layout built with Tailwind CSS

## Tech stack

- Next.js 16 with the App Router
- PostgreSQL on Neon
- Prisma 6
- Stripe Checkout and webhooks
- Tailwind CSS 4
- Vercel for hosting

## How checkout works

1. The cart sends only product ids and quantities to `/api/checkout`.
2. The server reads prices and stock from the database and creates a pending order and a Stripe Checkout Session.
3. The customer pays on the Stripe page and returns to the success page.
4. Stripe sends `checkout.session.completed` to `/api/webhooks/stripe`. The route verifies the signature on the raw request body and marks the order as paid.

Prices never come from the browser so a customer cannot change what they pay.

## Getting started

You need Node.js 20 or later and a PostgreSQL database. You also need a Stripe account in test mode and the Stripe CLI.

1. Clone the repo and install the packages:

   ```
   git clone https://github.com/pjperfect/next-ecommerce-store.git
   cd next-ecommerce-store
   npm i
   ```

2. Copy `.env.example` to `.env` and fill in the values from the table below.

3. Create the tables and load the products:

   ```
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the app:

   ```
   npm run dev
   ```

5. In a second terminal start the webhook listener:

   ```
   stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe
   ```

   Copy the `whsec_` secret it prints into `STRIPE_WEBHOOK_SECRET` and restart the app.

## Environment variables

| Name                    | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`          | Pooled PostgreSQL connection string used by the app           |
| `DIRECT_URL`            | Direct PostgreSQL connection string used by Prisma migrations |
| `STRIPE_SECRET_KEY`     | Stripe secret key in test mode                                |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the webhook                                 |
| `SITE_URL`              | Address of the site such as `http://localhost:3000`           |

## Project structure

    prisma/                       schema, migrations and seed script
    src/app/page.js               catalogue with search, filter and sort
    src/app/products/[slug]/      product detail page
    src/app/cart/                 cart page
    src/app/orders/               order lookup and status tracker
    src/app/checkout/success/     page shown after payment
    src/app/api/checkout/         creates the order and the Stripe session
    src/app/api/webhooks/stripe/  receives Stripe events
    src/components/               shared interface pieces
    src/context/CartContext.js    cart state shared across pages
    src/lib/                      Prisma client, Stripe client and helpers

## Deployment

The app runs on Vercel with the five environment variables above. In the Stripe dashboard a webhook destination points to `/api/webhooks/stripe` and listens for `checkout.session.completed`. The `postinstall` script runs `prisma generate` during the build.

## Known limits

- There are no user accounts. Orders are found by email so anyone who knows an email can see the status of its orders. Nothing sensitive is shown but a production store would ask customers to sign in.
- There is no admin page. Shipped and Delivered are set directly in the database.
- Payments run in Stripe test mode only.
- Product names and images come from DummyJSON so they are placeholder data.

## What I learned

The hardest parts were webhooks and the rules of hooks. A webhook must read the raw request body because the signature covers the exact text. In the cart I once put a hook inside a function and React refused to run it. That bug only appeared after a test payment on the live site because nothing called that function until then.
