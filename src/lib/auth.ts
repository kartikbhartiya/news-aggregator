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
 * Sign Up with 6-digit Email OTP dispatched via Hostinger SMTP
 */
export async function signUpWithEmailOtp(email: string) {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Dispatch real 6-digit OTP via server SMTP endpoint
  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to dispatch verification code to your email.');
  }

  // 2. Also register in Supabase Auth if accessible
  try {
    await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true },
    });
  } catch (supaErr) {
    console.debug('Supabase background OTP note:', supaErr);
  }

  return { success: true, email: cleanEmail };
}

/**
 * Verify 6-digit Email OTP with real server validation
 */
export async function verifyEmailOtp(email: string, token: string): Promise<UserProfile> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanToken = token.trim();

  // 1. Verify code against server OTP store
  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail, code: cleanToken }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid 6-digit verification code. Please check your email.');
  }

  // 2. Verification succeeded - create/retrieve user profile
  try {
    const supaRes = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'email',
    });
    if (supaRes.data?.user) {
      const u = supaRes.data.user;
      const meta = u.user_metadata || {};
      const profile: UserProfile = {
        id: u.id,
        email: u.email || cleanEmail,
        fullName: meta.full_name || cleanEmail.split('@')[0],
        avatarUrl: meta.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`,
        role: 'PRISM Executive Member',
        preferences: meta.preferences || DEFAULT_PREFERENCES,
        createdAt: u.created_at,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }
      return profile;
    }
  } catch (supaErr) {
    console.debug('Supabase verifyOtp background note:', supaErr);
  }

  const profile: UserProfile = {
    id: `user-${Date.now()}`,
    email: cleanEmail,
    fullName: cleanEmail.split('@')[0],
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`,
    role: 'PRISM Executive Member',
    preferences: {
      ...DEFAULT_PREFERENCES,
      onboardingCompleted: false,
    },
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  }
  return profile;
}

/**
 * Set or update the authenticated user's password
 */
export async function setUserPassword(password: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      console.warn('Supabase updateUser password notice:', error.message);
    }
  } catch (err) {
    console.warn('Supabase updateUser password error:', err);
  }

  // Also cache password for local fallback
  const current = await getCurrentUser();
  if (current && typeof window !== 'undefined') {
    const credKey = `prism_pwd_${current.email.toLowerCase().trim()}`;
    localStorage.setItem(credKey, password);
  }
  return true;
}

/**
 * Sign In with Email & Password
 */
export async function signInWithPassword(email: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (!error && data.user && data.user.email) {
      const meta = data.user.user_metadata || {};
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        fullName: meta.full_name || meta.name || data.user.email.split('@')[0],
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
  } catch (err) {
    console.warn('Supabase signInWithPassword note:', err);
  }

  // Check local fallback credential
  if (typeof window !== 'undefined') {
    const storedPwd = localStorage.getItem(`prism_pwd_${cleanEmail}`);
    if (storedPwd && storedPwd === password) {
      const localProfile: UserProfile = {
        id: `user-local-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`,
        role: 'PRISM Executive Member',
        preferences: DEFAULT_PREFERENCES,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localProfile));
      return localProfile;
    }
  }

  throw new Error('Invalid email or password. Please verify your credentials or sign up.');
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
