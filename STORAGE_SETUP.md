# Supabase Storage Setup Guide

## Overview

This guide will help you set up Supabase Storage buckets for handling image uploads in MIDEEYE.

## Required Buckets

You need to create **2 storage buckets** in your Supabase project:

1. **avatars** - For user profile pictures
2. **posts** - For images in questions/posts

## Step-by-Step Setup

### 1. Create Storage Buckets

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**

#### Create Avatars Bucket:

- **Name**: `avatars`
- **Public**: ✅ Yes (images need to be publicly accessible)
- **File size limit**: 5242880 (5MB)
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/gif,image/webp`
- Click **"Create bucket"**

#### Create Posts Bucket:

- **Name**: `posts`
- **Public**: ✅ Yes
- **File size limit**: 5242880 (5MB)
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/gif,image/webp`
- Click **"Create bucket"**

### 2. Set Up Storage Policies

For each bucket, you need to set up Row Level Security (RLS) policies.

#### Go to Storage Policies:

1. In **Storage**, click on the bucket name
2. Click **"Policies"** tab
3. Click **"New policy"**

#### Policy 1: Allow Authenticated Users to Upload (INSERT)

```sql
-- Policy name: Allow authenticated uploads
-- Operation: INSERT
-- Policy definition:

CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

This ensures users can only upload to their own folder (based on user ID).

#### Policy 2: Allow Public Access (SELECT)

```sql
-- Policy name: Public access
-- Operation: SELECT
-- Policy definition:

CREATE POLICY "Public access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

This allows anyone to view the images (needed for profile pictures to be visible).

#### Policy 3: Allow Users to Delete Their Own Files (DELETE)

```sql
-- Policy name: Users can delete own files
-- Operation: DELETE
-- Policy definition:

CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: Allow Users to Update Their Own Files (UPDATE)

```sql
-- Policy name: Users can update own files
-- Operation: UPDATE
-- Policy definition:

CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Repeat for Posts Bucket

Create the same 4 policies for the `posts` bucket, just replace `'avatars'` with `'posts'` in the SQL.

### 3. Quick Setup SQL (Alternative)

If you prefer, run this SQL in the Supabase SQL Editor to create all policies at once:

```sql
-- Avatars bucket policies
CREATE POLICY "Allow authenticated uploads to avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Posts bucket policies
CREATE POLICY "Allow authenticated uploads to posts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public access to posts"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'posts');

CREATE POLICY "Users can delete own posts"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own posts"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Testing

### Test Avatar Upload:

1. Log in to your application
2. Go to **Settings → Profile** (`/settings/profile`)
3. Click **"Choose Image"**
4. Select an image (max 5MB)
5. Click **"Save Changes"**
6. Verify the image appears on your profile

### Verify in Supabase:

1. Go to **Storage** → **avatars** bucket
2. You should see a folder with your user ID
3. Inside that folder, you'll find the uploaded image

## File Structure

Uploaded files are organized as follows:

```
avatars/
  ├── {user_id}/
  │   ├── {timestamp}-{random}.jpg
  │   └── {timestamp}-{random}.png

posts/
  ├── {user_id}/
  │   ├── {timestamp}-{random}.jpg
  │   └── {timestamp}-{random}.png
```

## Troubleshooting

### Error: "new row violates row-level security policy"

- Make sure you've created the storage policies
- Verify the user is authenticated
- Check that the bucket name matches exactly

### Error: "Failed to upload image"

- Check file size (must be < 5MB)
- Verify file type is one of: JPG, PNG, GIF, WebP
- Check browser console for detailed error

### Images not loading

- Verify the bucket is set to **Public**
- Check the image URL in the database
- Make sure the SELECT policy exists for public access

## Environment Variables

No additional environment variables needed! The storage service uses the same Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Notes

- Files are scoped to user folders (user can only access their own uploads)
- File size is limited to 5MB
- Only image files are allowed
- Public access is read-only
- Only authenticated users can upload/delete/update

## Migration to Django

When migrating to Django, you'll need to:

1. Set up Django storage backend (e.g., AWS S3, Google Cloud Storage)
2. Update `services/storage.service.ts` to call Django API endpoints
3. Django endpoints will handle file uploads and return URLs

The storage service layer is already set up for easy migration - only the service file needs changes, not the components.
