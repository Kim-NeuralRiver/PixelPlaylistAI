# neural-spring
Neural River's template Next.js application

## Requirements
- Node - ^20.11.0 - [Instalation Guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- Yarn - [Instalation Guide](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## Installation
### 1. Install Dependencies
```yarn install```

### 2. Setup env variables
- Copy example env file as .env

    ```cp env.example .env```

- Fill .env file with your values.  [How to Fill Doc](https://docs.google.com/document/d/1p2PaHiilrcTqcdd5MNh6ipAlMCDUN9TlTUX_zyPAcFg/edit?tab=t.0)

### 3. Running development server
```yarn run dev```


## Production Build
To create production build run ```yarn run build```

Documentation is at https://docs.google.com/document/d/1KHkraa-1gUimnNPzcQLx9hpZ2O6NfZ7ng9C-V3yQW50/edit?tab=t.0

### **Integrating Stripe for One-Time Payments and Subscriptions**

This project integrates Stripe to handle one-time payments and subscriptions seamlessly. Below is an explanation of how Stripe is set up in the project, including key components, utility functions, and API routes.

---

#### **1. Stripe Integration Overview**
Stripe is used for:
- **One-Time Payments**: Allows customers to make one-off purchases for products or services.
- **Subscriptions**: Supports recurring payments for subscription-based products.

---

#### **2. Key Components**
- **Stripe Library**:
  We use Stripe's official JavaScript library, [`@stripe/stripe-js`](https://www.npmjs.com/package/@stripe/stripe-js), for frontend payment processing and [`stripe`](https://www.npmjs.com/package/stripe) for server-side operations.

- **Utility Function**: `getStripe`
  - Located in `src/lib/get-stripe.ts`.
  - This function ensures the Stripe instance is initialized only once (using the Singleton pattern).
  - Example usage:
    ```typescript
    import getStripe from '@/lib/get-stripe';

    const stripe = await getStripe();
    ```

---

#### **3. Environment Variables**
Stripe requires both a **publishable key** (used on the client-side) and a **secret key** (used on the server-side). These keys are stored in environment variables for security.

- **`.env.local` file**:
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
  STRIPE_SECRET_KEY=your_secret_key
  ```

Ensure these keys are configured correctly in your project and restart the development server after making changes.

---

#### **4. API Routes**
We use Next.js API routes for server-side communication with Stripe:

- **`/api/create-checkout-session`**:
  - Handles the creation of a Stripe Checkout session for one-time payments.
  - Example implementation:
    ```typescript
    export async function POST(request: Request) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Test Product',
              },
              unit_amount: 2000, // $20.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/success`,
        cancel_url: `${request.headers.get('origin')}/cancel`,
      });
      return NextResponse.json({ id: session.id });
    }
    ```

- **`/api/create-subscription`**:
  - Handles the creation of a Stripe Checkout session for subscriptions.
  - Expects a `priceId` in the request body.
  - Example implementation:
    ```typescript
    export async function POST(request: Request) {
      const { priceId } = await request.json();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          { price: priceId, quantity: 1 },
        ],
        mode: 'subscription',
        success_url: `${request.headers.get('origin')}/success`,
        cancel_url: `${request.headers.get('origin')}/cancel`,
      });
      return NextResponse.json({ id: session.id });
    }
    ```

---

#### **5. Frontend Components**
Two React components are created for user interaction:
- **OneTimePaymentButton**:
  - A button that starts a one-time payment flow.
  - It fetches a session ID from the server and redirects the user to the Stripe Checkout page.

- **SubscriptionButton**:
  - A button that starts a subscription flow.
  - It accepts a `priceId` prop, fetches a session ID from the server, and redirects the user to the Stripe Checkout page.

Example usage:
```typescript
<OneTimePaymentButton />
<SubscriptionButton priceId="price_12345" />
Here’s the simplified and focused **README.md** about connecting to the database:

---

# Database Integration with Prisma and PostgreSQL

This project uses **Prisma** as an ORM to connect and interact with a **PostgreSQL** database. This README provides the steps to set up and configure the database connection for the project.

---

## Requirements

- **PostgreSQL Database**: Hosted on a platform like [Supabase](https://supabase.com/), [Neon](https://neon.tech/).
- **Node.js**: ^v22.11.0 - [Installation Guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- **Yarn**: [Installation Guide](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

---

## Setting Up the Database

### 1. Create a PostgreSQL Database
Choose a database hosting provider or set up PostgreSQL locally. For hosted solutions:
- Sign up for a service like [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres).
- Create a new PostgreSQL database instance.
- Copy the connection string for the database.

---

## Prisma Configuration

### 2. Initialize Prisma
If Prisma is not already initialized in your project, run the following command:

```bash
yarn prisma init
```

This will generate a `prisma` directory with a `schema.prisma` file.

---

### 3. Configure the Database URL
Update your `.env` file with the database connection string:

```env
DATABASE_URL="postgres://<username>:<password>@<host>:<port>/<database>"
```

The DATABASE_URL can be found in the storage tab of your Vercel Project.

---

### 4. Define Your Schema
Edit the `prisma/schema.prisma` file to define your database structure. For example, a `User` model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  image     String?
  username  String?
  createdAt DateTime @default(now())
}
```

---

For further details on Stripe integration, refer to the [Stripe Documentation](https://stripe.com/docs).
### 5. Migrate the Database
Run the following commands to create the necessary tables in the database:

```bash
yarn prisma migrate dev --name init
```

---

### 6. Generate Prisma Client
Generate the Prisma Client, which is used to interact with the database:

```bash
yarn prisma generate
```

This step ensures that TypeScript types are updated according to the schema.

---

## Using Prisma in the Project

### Example: Connecting to the Database
Create a new instance of the Prisma Client to interact with the database:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Example: Fetch all users
async function getUsers() {
  const users = await prisma.user.findMany();
  console.log(users);
}

getUsers();
```

2. **Schema Changes**:
   - After modifying the schema in `schema.prisma`, run:
     ```bash
     yarn prisma migrate dev
     yarn prisma generate
     ```

---

## References

- [Neon DB Console](https://console.neon.tech/)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))
- [Environment Variable Configuration](https://nextjs.org/docs/basic-features/environment-variables)

---
