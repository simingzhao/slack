"use server";

import { db } from "@/db/db";
import { profiles, type Profile } from "@/db/schema/profiles";
import { eq } from "drizzle-orm";

/**
 * Get all profiles from the database
 */
export async function getProfiles(): Promise<Profile[]> {
  try {
    return await db.select().from(profiles).orderBy(profiles.name);
  } catch (error) {
    console.error("Failed to get profiles:", error);
    return [];
  }
}

/**
 * Get a profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | undefined> {
  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id));
    
    return result[0];
  } catch (error) {
    console.error(`Failed to get profile with ID ${id}:`, error);
    return undefined;
  }
} 