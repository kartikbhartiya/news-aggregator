'use client';

import { supabase } from '@/lib/supabase';
import { NewsCategory } from '@/types/news';

export interface UserPreferences {
  categories: NewsCategory[];
  edition: 'india' | 'international';
  dailyDigestEmail: boolean;
  onboardingCompleted: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  preferences: UserPreferences;
  createdAt: string;
}

const LOCAL_STORAGE_USER_KEY = 'prism_user_profile_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  categories: ['tech', 'markets', 'business'],
  edition: 'international',
  dailyDigestEmail: true,
  onboardingCompleted: false,
};

/**
 * Get current session user from Supabase or local cache
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      const meta = user.user_metadata || {};
      const profile: UserProfile = {
        id: user.id,
        email: user.email,
        fullName: meta.full_name || meta.name || user.email.split('@')[0],
        avatarUrl: meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}`,
        role: meta.role || 'PRISM Executive Member',
        preferences: meta.preferences || DEFAULT_PREFERENCES,
        createdAt: user.created_at,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }
      return profile;
    }
  } catch (err) {
    console.debug('Supabase getUser note:', err);
  }

  // Fallback to local session cache
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // empty
      }
    }
  }

  return null;
}

/**
 * Sign Up with 6-digit Email OTP
 */
export async function signUpWithEmailOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Verify 6-digit Email OTP
 */
export async function verifyEmailOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw error;

  if (data.user && data.user.email) {
    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.email)}`,
      role: 'PRISM Executive Member',
      preferences: DEFAULT_PREFERENCES,
      createdAt: data.user.created_at,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
    }
    return profile;
  }
  return null;
}

/**
 * Sign In with Email & Password
 */
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  if (data.user && data.user.email) {
    const meta = data.user.user_metadata || {};
    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email,
      fullName: meta.full_name || data.user.email.split('@')[0],
      avatarUrl: meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.email)}`,
      role: meta.role || 'PRISM Executive Member',
      preferences: meta.preferences || DEFAULT_PREFERENCES,
      createdAt: data.user.created_at,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
    }
    return profile;
  }
  return null;
}

/**
 * Sign Out
 */
export async function signOutUser() {
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }
}

/**
 * Update User Preferences / Complete Onboarding
 */
export async function updateUserPreferences(preferences: Partial<UserPreferences>) {
  const current = await getCurrentUser();
  const merged: UserPreferences = {
    ...(current?.preferences || DEFAULT_PREFERENCES),
    ...preferences,
  };

  try {
    await supabase.auth.updateUser({
      data: {
        preferences: merged,
        onboardingCompleted: true,
      },
    });
  } catch (err) {
    console.debug('Failed to update Supabase user metadata:', err);
  }

  if (current) {
    const updated: UserProfile = {
      ...current,
      preferences: merged,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    }
    return updated;
  }
  return null;
}
