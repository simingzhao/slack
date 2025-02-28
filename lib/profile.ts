'use client';

// Client-side profile storage and retrieval functions
// These only use browser storage APIs and don't access the database

const PROFILE_COOKIE_NAME = 'current-profile-id';
const DEFAULT_PROFILE_ID = 'profile_1'; // Same default as server-side for testing

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
 * Initialize profile with default if none exists
 * This is useful for testing and first-time users
 */
export function initializeDefaultProfile(): void {
  if (typeof window !== 'undefined' && !getCurrentProfile()) {
    setCurrentProfile(DEFAULT_PROFILE_ID);
  }
} 