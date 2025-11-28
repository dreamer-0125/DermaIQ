# Supabase Setup Guide - Fixing User Profile Creation

## Problem: User profile not being created in `public.users` table

This is usually caused by **Row Level Security (RLS)** policies blocking the insert operation.

## Solution 1: Create RLS Policy (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Policies**
3. Select the `users` table
4. Click **New Policy**
5. Create a policy with these settings:

### Policy Name: `Users can insert their own profile`
- **Policy Type**: `INSERT`
- **Target Roles**: `authenticated`
- **USING Expression**: `auth.uid() = id`
- **WITH CHECK Expression**: `auth.uid() = id`

### Policy Name: `Users can read their own profile`
- **Policy Type**: `SELECT`
- **Target Roles**: `authenticated`
- **USING Expression**: `auth.uid() = id`

### Policy Name: `Users can update their own profile`
- **Policy Type**: `UPDATE`
- **Target Roles**: `authenticated`
- **USING Expression**: `auth.uid() = id`
- **WITH CHECK Expression**: `auth.uid() = id`

## Solution 2: SQL Script (Quick Fix)

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## Solution 3: Temporarily Disable RLS (Development Only)

⚠️ **WARNING: Only for development/testing. Never use in production!**

```sql
-- Disable RLS on users table (DEVELOPMENT ONLY)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

## Verify the Fix

After applying the policies:

1. Sign up a new user
2. Check the `public.users` table in Supabase Dashboard
3. You should see the new user record

## Check Table Structure

Make sure your `users` table has these columns:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT,
  organization TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Add other columns as needed
);
```

## Debugging

If the issue persists, check:

1. **Browser Console**: Look for detailed error messages
2. **Supabase Logs**: Dashboard → Logs → Database
3. **RLS Policies**: Make sure policies are enabled and correct
4. **Table Permissions**: Verify the `users` table exists and is accessible

## Common Errors

- **Error 42501**: Permission denied - RLS policy issue
- **Error 23505**: Duplicate key - User already exists (this is OK, will fetch existing)
- **Error PGRST116**: No rows found - Table doesn't exist or wrong schema

