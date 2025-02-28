'use server';

/**
 * Server-only profile utility functions
 */
import 'server-only';

import { db } from '@/db/db';
import { profiles, Profile } from '@/db/schema';
import { eq } from 'drizzle-orm';

// A fixed profile ID for testing - this should be replaced with proper auth
const DEFAULT_PROFILE_ID = 'profile_1';

/**
 * Get the active profile from the database
 */
export async function getActiveProfile(): Promise<Profile | null> {
  try {
    // In this simplified example, we'll just use the default profile ID
    // In a real app, this would come from proper server-side authentication
    const profileId = DEFAULT_PROFILE_ID;
    
    const activeProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });
    
    return activeProfile || null;
  } catch (error) {
    console.error('Error fetching active profile:', error);
    return null;
  }
}

/**
 * Get a profile by ID
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
  if (!profileId) return null;
  
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });
    
    return profile || null;
  } catch (error) {
    console.error('Error fetching profile by ID:', error);
    return null;
  }
} 