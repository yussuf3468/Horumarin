# MIDEEYE Migration Guide: Supabase to Django REST Framework

## Overview

This application is built with a **service layer architecture** that completely abstracts the backend implementation. This means you can migrate from Supabase to Django REST Framework by only modifying the service layer files - **no changes needed in React components**.

---

## Architecture Principles

### 1. **Service Layer Pattern**

All database and API operations go through service files:

```
services/
├── auth.service.ts         # Authentication
├── user.service.ts         # User/Profile operations
├── question.service.ts     # Question operations
├── answer.service.ts       # Answer operations
├── vote.service.ts         # Voting system
├── realtime.service.ts     # Real-time features
└── email.service.ts        # Email subscriptions
```

### 2. **Component Independence**

Components **NEVER** import Supabase directly:

❌ **Wrong:**

```typescript
import { supabase } from "@/lib/supabase/client";
const { data } = await supabase.from("questions").select("*");
```

✅ **Correct:**

```typescript
import { getQuestions } from "@/services/question.service";
const questions = await getQuestions();
```

### 3. **Type Safety**

All services return clean TypeScript interfaces that are backend-agnostic:

- `AuthUser` instead of Supabase `User`
- `UserProfile` instead of raw database row
- `QuestionWithAuthor` with proper relations

---

## Migration Steps

### Phase 1: Setup Django Backend

#### 1.1 Create Django Project

```bash
# Create Django project
django-admin startproject MIDEEYE_backend
cd MIDEEYE_backend

# Create apps
python manage.py startapp accounts
python manage.py startapp questions
python manage.py startapp answers
python manage.py startapp votes
```

#### 1.2 Install Dependencies

```bash
pip install djangorestframework
pip install django-cors-headers
pip install djangorestframework-simplejwt
pip install channels  # For real-time features
pip install channels-redis
```

#### 1.3 Database Models

Create models matching the current PostgreSQL schema:

**accounts/models.py:**

```python
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(unique=True)

class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, null=True)
    avatar_url = models.URLField(null=True)
    bio = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**questions/models.py:**

```python
from django.db import models
import uuid

class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    content = models.TextField()
    category = models.CharField(max_length=100)
    view_count = models.IntegerField(default=0)
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
```

#### 1.4 API Endpoints

**urls.py:**

```python
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    # Auth
    path('api/auth/login', TokenObtainPairView.as_view()),
    path('api/auth/signup', views.SignUpView.as_view()),
    path('api/auth/logout', views.LogoutView.as_view()),
    path('api/auth/me', views.CurrentUserView.as_view()),

    # Users
    path('api/users/<uuid:id>', views.UserDetailView.as_view()),
    path('api/users/<uuid:id>/stats', views.UserStatsView.as_view()),

    # Questions
    path('api/questions', views.QuestionListCreateView.as_view()),
    path('api/questions/<uuid:id>', views.QuestionDetailView.as_view()),

    # Answers
    path('api/questions/<uuid:question_id>/answers', views.AnswerListCreateView.as_view()),

    # Votes
    path('api/questions/<uuid:id>/vote', views.VoteQuestionView.as_view()),
    path('api/answers/<uuid:id>/vote', views.VoteAnswerView.as_view()),
]
```

---

### Phase 2: Update Service Layer

This is the **ONLY** code you need to change in the frontend.

#### 2.1 Update Auth Service

**services/auth.service.ts:**

```typescript
// Before (Supabase):
export async function login(data: LoginData): Promise<AuthResponse> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  // ... handle response
}

// After (Django):
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { user: null, error: result.message };
    }

    // Store JWT token
    localStorage.setItem("access_token", result.access);
    localStorage.setItem("refresh_token", result.refresh);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        createdAt: result.user.created_at,
      },
      error: null,
    };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}
```

#### 2.2 Update Question Service

**services/question.service.ts:**

```typescript
// Before (Supabase):
export async function getQuestions(
  filters?: QuestionFilters,
): Promise<QuestionWithAuthor[]> {
  let query = supabase.from("questions").select("*, profiles:user_id (*)");
  // ... filters
  const { data } = await query;
  return data;
}

// After (Django):
export async function getQuestions(
  filters?: QuestionFilters,
): Promise<QuestionWithAuthor[]> {
  const token = localStorage.getItem("access_token");
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);

  const response = await fetch(`${API_URL}/api/questions?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.results; // Django pagination
}
```

#### 2.3 Update Real-time Service

**services/realtime.service.ts:**

```typescript
// Before (Supabase Realtime):
export function subscribeToQuestions(callback: Function): RealtimeSubscription {
  const channel = supabase
    .channel("questions")
    .on("postgres_changes", { table: "questions" }, callback)
    .subscribe();

  return { unsubscribe: () => supabase.removeChannel(channel) };
}

// After (Django Channels WebSocket):
export function subscribeToQuestions(callback: Function): RealtimeSubscription {
  const ws = new WebSocket(`${WS_URL}/ws/questions/`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data.event, data.payload);
  };

  return {
    unsubscribe: () => ws.close(),
  };
}
```

---

### Phase 3: Environment Configuration

Update environment variables:

**.env.local (Before):**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**.env.local (After):**

```bash
NEXT_PUBLIC_API_URL=https://api.MIDEEYE.com
NEXT_PUBLIC_WS_URL=wss://api.MIDEEYE.com
```

---

### Phase 4: Database Migration

#### 4.1 Export Data from Supabase

```bash
# Using Supabase CLI
supabase db dump > backup.sql

# Or using pg_dump
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

#### 4.2 Import to Django

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Import data
python manage.py loaddata backup.json
```

---

## Testing the Migration

### 1. Run Both Backends in Parallel

Keep Supabase running while testing Django:

1. Point dev environment to Django
2. Test all features
3. Compare responses
4. Fix any discrepancies

### 2. Feature Parity Checklist

- [ ] Authentication (login/signup/logout)
- [ ] User profiles
- [ ] Create questions
- [ ] List questions
- [ ] Filter questions
- [ ] Voting system
- [ ] Real-time updates
- [ ] Email subscriptions

### 3. Performance Testing

```bash
# Load test Django endpoints
ab -n 1000 -c 10 https://api.MIDEEYE.com/api/questions
```

---

## Rollback Plan

If issues arise, rollback is simple:

1. **Revert environment variables** to Supabase
2. **Deploy previous version** of service files
3. **No component changes needed**

---

## Benefits of This Architecture

✅ **Zero component changes** during migration  
✅ **Type-safe interfaces** prevent breaking changes  
✅ **Easy A/B testing** - run both backends simultaneously  
✅ **Gradual migration** - migrate one service at a time  
✅ **Team scalability** - backend and frontend teams work independently

---

## Additional Resources

- Django REST Framework: https://www.django-rest-framework.org/
- Django Channels: https://channels.readthedocs.io/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/

---

## Support

For migration questions, contact the backend team or refer to:

- `/docs/api-specification.md` - API contract
- `/services/*.service.ts` - Service layer implementation
