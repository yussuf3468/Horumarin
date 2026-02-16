/**
 * Auth Service
 *
 * This layer abstracts all authentication logic from Supabase.
 * When migrating to Django REST API, only this file needs to be rewritten
 * to call Django endpoints instead of Supabase auth methods.
 *
 * Components should NEVER import supabase directly for auth.
 */

import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

/**
 * Sign up a new user
 * Migration note: Replace with POST /api/auth/signup
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: "User creation failed" };
    }

    // Create profile (this will move to Django user model)
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
      },
    ]);

    if (profileError) {
      return { user: null, error: profileError.message };
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        createdAt: authData.user.created_at,
      },
      error: null,
    };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Log in an existing user
 * Migration note: Replace with POST /api/auth/login
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: "Login failed" };
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        createdAt: authData.user.created_at,
      },
      error: null,
    };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Log out the current user
 * Migration note: Replace with POST /api/auth/logout
 */
export async function logout(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get the current authenticated user
 * Migration note: Replace with GET /api/auth/me
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      createdAt: user.created_at,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Subscribe to auth state changes
 * Migration note: Replace with WebSocket connection to Django
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email!,
        createdAt: session.user.created_at,
      });
    } else {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}
