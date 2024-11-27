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