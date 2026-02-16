import { supabase } from "@/lib/supabase/client";

const POST_MEDIA_BUCKET = "post-media";

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadPostImage(
  file: File,
  userId: string,
): Promise<{
  publicUrl: string | null;
  path: string | null;
  error: string | null;
}> {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name || "upload");
  const path = `posts/${userId}/${timestamp}-${safeName}`;

  const { error } = await supabase.storage
    .from(POST_MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return { publicUrl: null, path: null, error: error.message };
  }

  const { data } = supabase.storage.from(POST_MEDIA_BUCKET).getPublicUrl(path);

  return { publicUrl: data.publicUrl, path, error: null };
}
