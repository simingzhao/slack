'use server';

/**
 * This file contains server-only database utility functions.
 * It should ONLY be imported from server components or server actions.
 */
import 'server-only';

import { db } from '@/db/db';
import { channels, NewChannel } from '@/db/schema/channels';
import { desc, eq, like } from 'drizzle-orm';

/**
 * Get all channels from the database
 */
export async function fetchAllChannels(search?: string) {
  try {
    if (search && search.trim() !== '') {
      return await db.query.channels.findMany({
        where: like(channels.name, `%${search}%`),
        orderBy: [desc(channels.createdAt)],
      });
    } else {
      return await db.query.channels.findMany({
        orderBy: [desc(channels.createdAt)],
      });
    }
  } catch (error) {
    console.error('Error in fetchAllChannels:', error);
    throw error;
  }
}

/**
 * Get a channel by ID from the database
 */
export async function fetchChannelById(channelId: string) {
  try {
    return await db.query.channels.findFirst({
      where: eq(channels.id, channelId),
    });
  } catch (error) {
    console.error('Error in fetchChannelById:', error);
    throw error;
  }
}

/**
 * Create a new channel in the database
 */
export async function createChannelInDb(channelData: NewChannel) {
  try {
    await db.insert(channels).values(channelData);
    return await fetchChannelById(channelData.id);
  } catch (error) {
    console.error('Error in createChannelInDb:', error);
    throw error;
  }
} 