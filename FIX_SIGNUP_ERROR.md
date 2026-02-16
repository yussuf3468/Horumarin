# Fix: "new row violates row-level security policy for table profiles"

## Problem

When users sign up, they encounter the error:

```
new row violates row-level security policy for table "profiles"
```

This happens because:

1. User signs up via `supabase.auth.signUp()`
2. Code tries to manually insert profile record
3. RLS policy requires `auth.uid() = id` for INSERT
4. During signup, auth context might not be fully established
5. INSERT fails RLS check

## Solution

Use a **database trigger** to automatically create profiles when users sign up. The trigger runs with `SECURITY DEFINER`, which bypasses RLS.

## Implementation Steps

### Step 1: Run the Migration SQL

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Copy and paste the contents of `database/migrations/fix_profile_rls.sql`
5. Click **"Run"**

This will:

- Create a function `handle_new_user()` that auto-creates profiles
- Create a trigger on `auth.users` that fires when users sign up
- Update the RLS policy to allow service role inserts

### Step 2: Update Auth Service (Optional)

The trigger now handles profile creation automatically, so you can optionally simplify the signup code.

**Current code** ([services/auth.service.ts](services/auth.service.ts)):

```typescript
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  // Manual profile creation (can fail with RLS)
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: authData.user.id,
      email: data.email,
      full_name: data.fullName,
    },
  ]);
}
```

**Updated code** (trigger handles it):

```typescript
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName, // Passed to trigger via raw_user_meta_data
      },
    },
  });

  // Profile is automatically created by trigger - no manual insert needed!
}
```

### Step 3: Test

1. Try signing up a new user
2. Verify no RLS error occurs
3. Check that profile was created in `profiles` table
4. Verify profile has correct `full_name` from signup form

## How It Works

### Before (Manual Creation)

```
1. User submits signup form
2. supabase.auth.signUp() creates auth.users record
3. Code manually inserts profiles record ❌ RLS blocks this
4. Error: "new row violates row-level security policy"
```

### After (Trigger Creation)

```
1. User submits signup form
2. supabase.auth.signUp() creates auth.users record
3. Trigger automatically creates profiles record ✅ SECURITY DEFINER bypasses RLS
4. Success! No RLS error
```

## What Changed

### 1. New Function: `handle_new_user()`

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER  -- Bypasses RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;
```

### 2. New Trigger: `on_auth_user_created`

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 3. Updated RLS Policy

```sql
CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
WITH CHECK (
  auth.uid() = id           -- Authenticated users can insert own profile
  OR
  auth.role() = 'service_role'  -- Service role (trigger) can insert
);
```

## Benefits

1. ✅ **No more RLS errors** - Trigger bypasses RLS with SECURITY DEFINER
2. ✅ **Automatic** - Profiles created immediately when users sign up
3. ✅ **Reliable** - Always happens, can't be forgotten
4. ✅ **Cleaner code** - No manual INSERT in auth service
5. ✅ **Django-ready** - Similar pattern with Django signals

## Rollback (If Needed)

If you need to revert:

```sql
-- Remove trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Restore original policy
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

## Django Migration Notes

When migrating to Django, replace this trigger with a Django signal:

```python
# In profiles/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user=instance,
            email=instance.email,
            full_name=instance.get_full_name()
        )
```

## Troubleshooting

### Error: "function handle_new_user() does not exist"

- Make sure you ran the migration SQL in Supabase SQL Editor
- Check the Functions section in Supabase Dashboard

### Profiles not being created

- Check if trigger exists: Go to Database → Triggers
- Verify function exists: Go to Database → Functions
- Check for errors in Supabase logs

### Still getting RLS error

- Verify the RLS policy was updated (check Database → Policies)
- Make sure RLS is enabled on profiles table
- Check that auth.users table is in the `auth` schema (not `public`)
