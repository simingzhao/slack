'use server';

import { Channel, NewChannel } from '@/db/schema/channels';
import { revalidatePath } from 'next/cache';
import { formatError, generateId, isEmpty } from '@/lib/helpers';
import { getActiveProfile } from '@/lib/server-profile';
import { fetchAllChannels, fetchChannelById, createChannelInDb } from '@/lib/server-db';

/**
 * Create a new channel
 */
export async function createChannel(
  name: string,
  description?: string,
  type: 'public' | 'private' = 'public'
): Promise<{ success: boolean; data?: Channel; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(name)) {
      return { success: false, error: 'Channel name is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to create a channel' };
    }

    // Create channel with generated ID
    const channelId = generateId('channel_');
    const newChannel: NewChannel = {
      id: channelId,
      name,
      description: description || null,
      creatorId: profile.id,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database using server-only function
    const createdChannel = await createChannelInDb(newChannel);

    // Revalidate the channels path
    revalidatePath('/channels');

    return {
      success: true,
      data: createdChannel!,
    };
  } catch (error) {
    console.error('Error creating channel:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get all channels
 */
export async function getChannels(
  search?: string
): Promise<{ success: boolean; data?: Channel[]; error?: string }> {
  try {
    // Use server-only function to fetch channels
    const allChannels = await fetchAllChannels(search);

    return {
      success: true,
      data: allChannels,
    };
  } catch (error) {
    console.error('Error fetching channels:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get a channel by ID
 */
export async function getChannelById(
  channelId: string
): Promise<{ success: boolean; data?: Channel; error?: string }> {
  try {
    if (isEmpty(channelId)) {
      return { success: false, error: 'Channel ID is required' };
    }

    // Use server-only function to fetch channel by ID
    const channel = await fetchChannelById(channelId);

    if (!channel) {
      return { success: false, error: 'Channel not found' };
    }

    return {
      success: true,
      data: channel,
    };
  } catch (error) {
    console.error('Error fetching channel:', error);
    return { success: false, error: formatError(error) };
  }
} 