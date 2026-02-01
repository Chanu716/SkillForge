# Database Setup with Neon PostgreSQL

## Quick Start

### 1. Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free, no credit card needed)
3. Click "Create Project"

### 2. Get Connection Strings
1. In Neon Console → Select your project
2. Go to "Connection Details"
3. Copy the **Pooled connection** string (starts with `postgresql://`)

### 3. Configure Local Environment
1. Open `.env.local` file
2. Replace `DATABASE_URL` with your Neon connection string
3. Replace `DIRECT_URL` with the same connection string

Example:
```env
DATABASE_URL="postgresql://username:password@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 4. Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Add it to `.env.local`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 5. Push Database Schema
```bash
npx prisma db push
```

This creates all tables in your Neon database.

### 6. Generate Prisma Client
```bash
npx prisma generate
```

## Deploy to Netlify

### Add Environment Variables
1. Go to Netlify Dashboard → Your Site → Site settings
2. Click "Environment variables" → "Add a variable"
3. Add these:
   - `DATABASE_URL` → Your Neon connection string
   - `DIRECT_URL` → Same Neon connection string
   - `NEXTAUTH_SECRET` → Your generated secret
   - `NEXTAUTH_URL` → Your Netlify site URL (e.g., `https://your-site.netlify.app`)

### Trigger Deploy
Push to GitHub, and Netlify will automatically rebuild with the new database.

## Prisma Commands

```bash
# View database in browser
npx prisma studio

# Create migration
npx prisma migrate dev --name init

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format
```

## Neon Features
- ✅ **10GB storage** free tier
- ✅ **Auto-scaling** - scales to zero when idle
- ✅ **Branching** - create database copies for testing
- ✅ **Point-in-time restore** - time travel your data
- ✅ **Connection pooling** - handles serverless connections

## Troubleshooting

### "Connection timed out"
- Check if DATABASE_URL includes `?sslmode=require`
- Verify your IP is not blocked (Neon allows all IPs by default)

### "Too many connections"
- Use connection pooling URL (should be default)
- Consider using `DIRECT_URL` for migrations

### Schema out of sync
```bash
npx prisma db push --force-reset
```

## Alternative: Supabase
If you prefer Supabase instead:
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Project Settings → Database
4. Use the **Transaction pooler** connection string

Both work great with Prisma!
