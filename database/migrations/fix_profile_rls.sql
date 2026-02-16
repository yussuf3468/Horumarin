-- Migration: Fix Profile RLS and Auto-Create on Signup
-- This fixes the "new row violates row-level security policy" error during signup

-- ========================================
-- 1. CREATE FUNCTION TO AUTO-CREATE PROFILE
-- ========================================

-- This function runs when a new user signs up in auth.users
-- SECURITY DEFINER allows it to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, bio)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'bio', '')
  );
  RETURN NEW;
END;
$$;

-- ========================================
-- 2. CREATE TRIGGER ON AUTH.USERS
-- ========================================

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 3. UPDATE RLS POLICY FOR PROFILES INSERT
-- ========================================

-- Drop the old INSERT policy
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Create new INSERT policy that allows:
-- 1. Authenticated users to insert their own profile
-- 2. Service role (trigger) to insert profiles
CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR 
  auth.role() = 'service_role'
);

-- ========================================
-- NOTES
-- ========================================

-- Now when a user signs up:
-- 1. Supabase creates user in auth.users
-- 2. Trigger automatically creates profile in profiles table (bypasses RLS via SECURITY DEFINER)
-- 3. No RLS error occurs

-- The auth service can still manually create profiles if needed (for backward compatibility),
-- but the trigger ensures it always happens automatically

-- When migrating to Django:
-- - Remove this trigger
-- - Use Django signals (post_save on User model) to create profile
-- - Example: from django.db.models.signals import post_save
