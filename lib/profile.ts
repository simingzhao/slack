'use client';

import { db } from '@/db/db';
import { profiles, Profile } from '@/db/schema';
import { eq } from 'drizzle-orm';

const PROFILE_COOKIE_NAME = 'current-profile-id';

/**
 * Save the current profile ID to client storage
 */
export function setCurrentProfile(profileId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_COOKIE_NAME, profileId);
    sessionStorage.setItem(PROFILE_COOKIE_NAME, profileId);
  }
}

/**
 * Get the current profile ID from client storage
 * First checks sessionStorage, then falls back to localStorage
 */
export function getCurrentProfile(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Try to get from session storage first (for current browser tab)
  const sessionProfile = sessionStorage.getItem(PROFILE_COOKIE_NAME);
  if (sessionProfile) {
    return sessionProfile;
  }
  
  // Fall back to local storage (persists across tabs/windows)
  return localStorage.getItem(PROFILE_COOKIE_NAME);
}

/**
 * Clear the current profile ID from client storage
 */
export function clearCurrentProfile() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROFILE_COOKIE_NAME);
    sessionStorage.removeItem(PROFILE_COOKIE_NAME);
  }
}

/**
 * Hook to check if a profile is selected
 */
export function hasSelectedProfile(): boolean {
  return !!getCurrentProfile();
}

/**
 * Get the active profile from the database
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const profileId = getCurrentProfile();
  
  if (!profileId) {
    return null;
  }
  
  try {
    const activeProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });
    
    return activeProfile || null;
  } catch (error) {
    console.error('Error fetching active profile:', error);
    return null;
  }
} 