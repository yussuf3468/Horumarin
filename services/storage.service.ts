/**
 * Storage Service
 *
 * This layer abstracts all file storage operations from Supabase Storage.
 * When migrating to Django REST API, replace with:
 * - POST /api/storage/upload
 * - DELETE /api/storage/:filepath
 * - GET /api/storage/url/:filepath
 */

import { supabase } from "@/lib/supabase/client";

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

/**
 * Upload an image to Supabase Storage
 * Migration note: Replace with POST /api/storage/upload
 */
export async function uploadImage(
  file: File,
  bucket: string = "avatars",
  folder: string = "",
): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        path: null,
        error:
          "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        url: null,
        path: null,
        error: "File size exceeds 5MB limit.",
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filepath = folder ? `${folder}/${filename}` : filename;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filepath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return {
        url: null,
        path: null,
        error: error.message,
      };
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filepath);

    return {
      url: publicData.publicUrl,
      path: filepath,
      error: null,
    };
  } catch (error: any) {
    return {
      url: null,
      path: null,
      error: error.message || "Failed to upload image",
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * Migration note: Replace with DELETE /api/storage/:filepath
 */
export async function deleteImage(
  filepath: string,
  bucket: string = "avatars",
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filepath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get public URL for a file
 * Migration note: Replace with GET /api/storage/url/:filepath
 */
export function getPublicUrl(
  filepath: string,
  bucket: string = "avatars",
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filepath);
  return data.publicUrl;
}

/**
 * Upload avatar image for user profile
 * Convenience function that uploads to avatars bucket with user folder
 */
export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<UploadResult> {
  return uploadImage(file, "avatars", userId);
}

/**
 * Upload post image (for questions/posts)
 * Convenience function that uploads to posts bucket
 */
export async function uploadPostImage(
  file: File,
  userId: string,
): Promise<UploadResult> {
  return uploadImage(file, "posts", userId);
}
