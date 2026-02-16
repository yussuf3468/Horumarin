# MIDEEYE Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
copy .env.local.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

- Get them from: https://supabase.com/dashboard/project/_/settings/api

### 3. Database Setup

1. Go to your Supabase Dashboard → SQL Editor
2. Copy the contents of `database/schema.sql`
3. Run it in the SQL Editor

This will create all tables, indexes, RLS policies, and triggers.

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Project Structure

```
MIDEEYE/
├── app/                     # Next.js 14 App Router pages
│   ├── page.tsx            # Landing page
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # User dashboard
│   ├── questions/          # Questions feed & detail
│   └── ask/                # Ask question page
├── services/               # 🔴 SERVICE LAYER (backend abstraction)
│   ├── auth.service.ts     # Authentication
│   ├── user.service.ts     # User profiles
│   ├── question.service.ts # Questions CRUD
│   ├── answer.service.ts   # Answers CRUD
│   ├── vote.service.ts     # Voting system
│   ├── realtime.service.ts # Real-time subscriptions
│   └── email.service.ts    # Email subscriptions
├── hooks/                  # React hooks (use services)
├── components/             # UI components
├── lib/                    # Supabase client
├── types/                  # TypeScript interfaces
└── docs/                   # Documentation
```

## Architecture Principles

### 🚨 CRITICAL RULE: Service Layer Pattern

**NEVER call Supabase directly from components or hooks!**

✅ **Correct:**

```typescript
import { getQuestions } from "@/services/question.service";

const questions = await getQuestions();
```

❌ **Wrong:**

```typescript
import { createClient } from "@/lib/supabase/client";

const { data } = await supabase.from("questions").select();
```

### Why?

When migrating to Django REST Framework:

1. **Components don't change** - They still call the same service functions
2. **Service layer changes** - Replace Supabase calls with `fetch()` to Django API
3. **Types stay the same** - `Question`, `Answer`, `UserProfile` interfaces remain identical

---

## Migration to Django

See [MIGRATION.md](docs/MIGRATION.md) for the complete migration guide.

**TL;DR:**

1. Build Django REST API matching the endpoints in [API.md](docs/API.md)
2. Update service functions to call Django instead of Supabase
3. Components work without any changes!

Example service migration:

```typescript
// BEFORE (Supabase)
export async function getQuestions() {
  const { data } = await supabase.from("questions").select("*");
  return data;
}

// AFTER (Django)
export async function getQuestions() {
  const response = await fetch(`${API_URL}/api/questions/`);
  const data = await response.json();
  return data;
}
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend (current):** Supabase (PostgreSQL + Auth + Realtime)
- **Backend (future):** Django REST Framework + PostgreSQL + Django Channels

---

## Need Help?

1. **API Reference:** See [API.md](docs/API.md)
2. **Migration Guide:** See [MIGRATION.md](docs/MIGRATION.md)
3. **Full Documentation:** See [README.md](README.md)

---

## Development Tips

### Real-time Features

- Questions feed updates live
- New answers appear automatically
- Vote counts update in real-time

### Authentication

- Email/password based
- Protected routes redirect to login
- User sessions persist across page refreshes

### UI/UX

- Full Somali language support
- Responsive design (mobile-first)
- Smooth animations with Framer Motion
- Loading states and error handling

---

## Common Issues

### "Module not found" errors

```bash
npm install
```

### Supabase connection errors

1. Check `.env.local` has correct values
2. Verify Supabase project is active
3. Check database schema is created

### TypeScript errors

```bash
npm run build
```

This will show all type errors that need fixing.

---

**Ready to build? Run `npm run dev` and start coding! 🚀**
