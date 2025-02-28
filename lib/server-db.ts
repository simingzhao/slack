'use server';

/**
 * This file contains server-only database utility functions.
 * It should ONLY be imported from server components or server actions.
 */
import 'server-only';

import { db } from '@/db/db';
import { channels, NewChannel } from '@/db/schema/channels';
import { messages, NewMessage } from '@/db/schema/messages';
import { desc, eq, like, and, isNull } from 'drizzle-orm';

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

/**
 * Create a new message in the database
 */
export async function createMessageInDb(messageData: NewMessage) {
  try {
    await db.insert(messages).values(messageData);
    return await fetchMessageById(messageData.id);
  } catch (error) {
    console.error('Error in createMessageInDb:', error);
    throw error;
  }
}

/**
 * Fetch a message by ID
 */
export async function fetchMessageById(messageId: string) {
  try {
    return await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
      with: {
        profile: true,
      },
    });
  } catch (error) {
    console.error('Error in fetchMessageById:', error);
    throw error;
  }
}

/**
 * Fetch messages for a channel
 */
export async function fetchChannelMessages(channelId: string, limit = 50) {
  try {
    return await db.query.messages.findMany({
      where: and(
        eq(messages.channelId, channelId),
        isNull(messages.parentId) // Only top-level messages (not thread replies)
      ),
      with: {
        profile: true,
      },
      orderBy: [desc(messages.createdAt)],
      limit,
    });
  } catch (error) {
    console.error('Error in fetchChannelMessages:', error);
    throw error;
  }
}

/**
 * Update a message in the database
 */
export async function updateMessageInDb(messageId: string, content: string) {
  try {
    await db.update(messages)
      .set({ 
        content, 
        isEdited: true,
        updatedAt: new Date()
      })
      .where(eq(messages.id, messageId));
    
    return await fetchMessageById(messageId);
  } catch (error) {
    console.error('Error in updateMessageInDb:', error);
    throw error;
  }
}

/**
 * Delete a message from the database
 */
export async function deleteMessageFromDb(messageId: string) {
  try {
    await db.delete(messages)
      .where(eq(messages.id, messageId));
    
    return true;
  } catch (error) {
    console.error('Error in deleteMessageFromDb:', error);
    throw error;
  }
} 