/**
 * Email Service
 *
 * This layer handles email subscription functionality.
 * When migrating to Django, replace with:
 * - POST /api/subscriptions
 */

import { supabase } from "@/lib/supabase/client";

/**
 * Subscribe an email to the newsletter
 * Migration note: Replace with POST /api/subscriptions
 */
export async function subscribeEmail(
  email: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("email_subscribers")
      .insert([{ email }]);

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === "23505") {
        return { success: false, error: "Email already subscribed" };
      }
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Unsubscribe an email
 * Migration note: Replace with DELETE /api/subscriptions/:email
 */
export async function unsubscribeEmail(
  email: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("email_subscribers")
      .update({ is_active: false })
      .eq("email", email);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
