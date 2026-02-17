/**
 * Category Service
 *
 * This layer abstracts all category and category follow operations from Supabase.
 * When migrating to Django REST API, replace with:
 * - GET /api/categories
 * - POST /api/categories/:id/follow
 * - DELETE /api/categories/:id/unfollow
 * - GET /api/users/:id/followed-categories
 */

import { supabase } from "@/lib/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  followerCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all categories
 * Migration note: Replace with GET /api/categories
 */
export async function getCategories(): Promise<{
  categories: Category[];
  error: string | null;
}> {
  try {
    const { data, error } = await (supabase as any)
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      return { categories: [], error: error.message };
    }

    const categories: Category[] = (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      followerCount: cat.follower_count,
      postCount: cat.post_count,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    }));

    return { categories, error: null };
  } catch (error: any) {
    return { categories: [], error: error.message };
  }
}

/**
 * Follow a category
 * Migration note: Replace with POST /api/categories/:id/follow
 */
export async function followCategory(
  userId: string,
  categoryId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any).from("category_follows").insert([
      {
        user_id: userId,
        category_id: categoryId,
      },
    ]);

    if (error) {
      // Check if it's a duplicate error
      if (error.code === "23505") {
        return { success: true, error: null };
      }
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Unfollow a category
 * Migration note: Replace with DELETE /api/categories/:id/unfollow
 */
export async function unfollowCategory(
  userId: string,
  categoryId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("category_follows")
      .delete()
      .eq("user_id", userId)
      .eq("category_id", categoryId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if user follows a category
 * Migration note: Replace with GET /api/categories/:id/is-following
 */
export async function isFollowingCategory(
  userId: string,
  categoryId: string,
): Promise<boolean> {
  try {
    const { data, error } = await (supabase as any)
      .from("category_follows")
      .select("id")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Get user's followed categories
 * Migration note: Replace with GET /api/users/:id/followed-categories
 */
export async function getFollowedCategories(userId: string): Promise<{
  categories: Category[];
  error: string | null;
}> {
  try {
    const { data, error } = await (supabase as any)
      .from("category_follows")
      .select(
        `
        followed_at,
        categories (*)
      `,
      )
      .eq("user_id", userId)
      .order("followed_at", { ascending: false });

    if (error) {
      return { categories: [], error: error.message };
    }

    const categories: Category[] = (data || []).map((item: any) => ({
      id: item.categories.id,
      name: item.categories.name,
      slug: item.categories.slug,
      description: item.categories.description,
      icon: item.categories.icon,
      color: item.categories.color,
      followerCount: item.categories.follower_count,
      postCount: item.categories.post_count,
      createdAt: item.categories.created_at,
      updatedAt: item.categories.updated_at,
    }));

    return { categories, error: null };
  } catch (error: any) {
    return { categories: [], error: error.message };
  }
}

/**
 * Get category by slug
 * Migration note: Replace with GET /api/categories/:slug
 */
export async function getCategoryBySlug(slug: string): Promise<{
  category: Category | null;
  error: string | null;
}> {
  try {
    const { data, error } = await (supabase as any)
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return { category: null, error: error.message };
    }

    const category: Category = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      followerCount: data.follower_count,
      postCount: data.post_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { category, error: null };
  } catch (error: any) {
    return { category: null, error: error.message };
  }
}
