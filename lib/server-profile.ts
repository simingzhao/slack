'use server';

/**
 * Server-only profile utility functions
 */
import 'server-only';

import { db } from '@/db/db';
import { profiles, Profile } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Remove hardcoded profile ID
// const DEFAULT_PROFILE_ID = 'profile_1';

/**
 * Get the active profile from the database
 * This will get the first profile available if no specific profile ID is provided
 */
export async function getActiveProfile(): Promise<Profile | null> {
  try {
    // Get the first profile from the database
    // In a real app with auth, this would come from the authenticated user
    const activeProfile = await db.query.profiles.findFirst();
    
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

/**
 * Get all profiles from the database
 */
export async function getAllProfiles(): Promise<Profile[]> {
  try {
    return await db.query.profiles.findMany({
      orderBy: (profiles, { asc }) => [asc(profiles.name)],
    });
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    return [];
  }
} 