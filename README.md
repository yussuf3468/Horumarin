# Horumarin - Somali Community Q&A Platform

**Weydii. Wadaag. Horumar.** (Ask. Share. Progress.)

A modern, scalable question and answer platform for the Somali community, built with clean architecture principles that allow seamless migration from Supabase to Django REST Framework.

---

## 🎯 Project Vision

Horumarin is designed as a **long-term, production-ready platform**. While we start with Supabase for MVP speed, the architecture is built to scale into a Django-powered enterprise application.

---

## 🏗️ Architecture Overview

### Service Layer Pattern

This project uses a **strict service layer architecture**:

```
Frontend (Next.js)
    ↓
Service Layer (services/*.ts)
    ↓
Backend (Supabase → Django)
```

**Key Principle:** Components NEVER call the database directly.

### Why This Matters

✅ **Future-proof:** Migrate backends without touching React components  
✅ **Type-safe:** Consistent interfaces across the app  
✅ **Testable:** Mock services easily  
✅ **Team-friendly:** Frontend and backend teams work independently

---

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - App Router for optimal performance
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management (if needed)

### Backend (Current)

- **Supabase** - PostgreSQL database + Auth + Realtime

### Backend (Future)

- **Django REST Framework** - Scalable API
- **Django Channels** - WebSocket support
- **PostgreSQL** - Same database, different ORM
- **Redis** - Caching and pub/sub

---

## 📁 Folder Structure

```
horumarin/
├── app/                      # Next.js pages (App Router)
│   ├── page.tsx             # Landing page
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── questions/           # Question feed
│   └── ask/                 # Create question
│
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   └── layout/              # Layout components
│
├── services/                # 🔥 SERVICE LAYER (Backend abstraction)
│   ├── auth.service.ts      # Authentication
│   ├── user.service.ts      # User operations
│   ├── question.service.ts  # Question operations
│   ├── answer.service.ts    # Answer operations
│   ├── vote.service.ts      # Voting system
│   ├── realtime.service.ts  # Real-time features
│   └── email.service.ts     # Email subscriptions
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Authentication hook
│   └── useProfile.ts        # User profile hook
│
├── lib/                     # Library code
│   └── supabase/            # Supabase client (isolated)
│
├── types/                   # TypeScript types
│   ├── database.ts          # Database types
│   └── index.ts             # Shared types
│
├── utils/                   # Utility functions
│   ├── helpers.ts           # Helper functions
│   └── constants.ts         # App constants
│
└── MIGRATION.md             # Guide for Django migration
```

---

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for now)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd horumarin

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

### Tables

#### `profiles`

- User profile information
- Links to Supabase auth.users

#### `questions`

- User-submitted questions
- Categories, view counts, status

#### `answers`

- Answers to questions
- Acceptance status

#### `votes`

- Upvotes/downvotes
- Polymorphic (questions or answers)

#### `email_subscribers`

- Newsletter subscriptions

### SQL Setup

```sql
-- Run this in Supabase SQL editor

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  is_answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answers
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  votable_id UUID NOT NULL,
  votable_type TEXT NOT NULL CHECK (votable_type IN ('question', 'answer')),
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, votable_id, votable_type)
);

-- Email Subscribers
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic examples)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 🔐 Environment Variables

Create `.env.local`:

```bash
# Supabase Configuration (Current)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Django Configuration (Future)
# NEXT_PUBLIC_API_URL=https://api.horumarin.com
# NEXT_PUBLIC_WS_URL=wss://api.horumarin.com
```

---

## 🎨 UI/UX Features

### Animations

- Framer Motion for all transitions
- Stagger effects on lists
- Hover micro-interactions
- Page transitions

### Responsive Design

- Mobile-first approach
- Tailwind breakpoints
- Touch-optimized

### User Experience

- Loading skeletons
- Optimistic UI updates
- Real-time notifications
- Error boundaries

---

## 🧪 Testing (TODO)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add these in Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔄 Migration to Django

See [MIGRATION.md](./MIGRATION.md) for complete guide.

**TL;DR:** Only update service layer files (`services/*.ts`). Components remain unchanged.

---

## 🤝 Contributing

### Code Style

- Use TypeScript strict mode
- Follow Airbnb style guide
- Use Prettier for formatting
- Write meaningful commits

### Service Layer Rules

1. **Never** import Supabase in components
2. **Always** use service functions
3. **Document** migration notes in comments
4. **Return** clean TypeScript interfaces

### Example

❌ **Don't:**

```typescript
// In a component
import { supabase } from "@/lib/supabase/client";
const { data } = await supabase.from("questions").select();
```

✅ **Do:**

```typescript
// In a component
import { getQuestions } from "@/services/question.service";
const questions = await getQuestions();
```

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👥 Team

- **Architecture:** Senior Full-Stack Engineer
- **Design:** UI/UX Designer
- **Backend (Future):** Django Developer
- **Frontend:** React Developer

---

## 🎯 Roadmap

### Phase 1: MVP (Current)

- [x] Landing page
- [x] Authentication
- [x] Question feed
- [x] Ask questions
- [x] Dashboard
- [ ] Answer questions
- [ ] Voting system

### Phase 2: Enhancement

- [ ] User profiles
- [ ] Search functionality
- [ ] Categories page
- [ ] Notifications
- [ ] Email integration

### Phase 3: Django Migration

- [ ] Setup Django backend
- [ ] Migrate auth service
- [ ] Migrate data services
- [ ] Migrate real-time
- [ ] Full deployment

### Phase 4: Scale

- [ ] Analytics
- [ ] Admin panel
- [ ] Mobile app
- [ ] API for third parties

---

## 📞 Support

For questions or issues:

- Email: support@horumarin.com
- Docs: See `MIGRATION.md` and code comments
- Architecture: Review `/services` folder

---

## 🌟 Key Differentiators

1. **Migration-Ready:** Seamlessly switch backends
2. **Type-Safe:** End-to-end TypeScript
3. **Production-Grade:** Enterprise architecture from day one
4. **Developer-Friendly:** Clear separation of concerns
5. **Scalable:** Built for growth

---

**Built with ❤️ for the Somali community**
