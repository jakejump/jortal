# Jortal

A member portal for a secret society. Built with Next.js 14, Prisma, and NextAuth.

## Quick Start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000

- **Admin**: `admin@jortal.local` / `admin123`
- **Sign In**: Uses NextAuth's built-in signin page (reliable, no custom form issues)

## Setup

1. **Database** (SQLite - no setup required)
   ```bash
   npx prisma migrate dev
   ```

2. **Seed admin**
   ```bash
   npm run db:seed
   ```

3. **Environment**: Ensure `.env` has:
   - `DATABASE_URL="file:./dev.db"`
   - `NEXTAUTH_SECRET` (any random string)
   - `NEXTAUTH_URL="http://localhost:3000"` (match your dev server port)

## Features

- Sign up, admin approval, profile, directory, events, newsletter, donate
- Contact: lesttheoldtraditionsfail@gmail.com

## Tech Stack

- Next.js 14 (App Router)
- SQLite + Prisma 5
- NextAuth.js (credentials)
- Tailwind CSS
