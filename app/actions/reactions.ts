'use server';

import { Reaction, NewReaction } from '@/db/schema/reactions';
import { revalidatePath } from 'next/cache';
import { formatError, generateId, isEmpty } from '@/lib/helpers';
import { getActiveProfile } from '@/lib/server-profile';
import {
  addReactionToMessage,
  removeReactionFromMessage,
  fetchMessageReactions,
  fetchMessageById
} from '@/lib/server-db';

/**
 * Add a reaction to a message
 */
export async function addReaction(
  messageId: string,
  emoji: string
): Promise<{ success: boolean; data?: Reaction; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(messageId)) {
      return { success: false, error: 'Message ID is required' };
    }

    if (isEmpty(emoji)) {
      return { success: false, error: 'Emoji is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to react to a message' };
    }

    // Create reaction with generated ID
    const reactionId = generateId('reaction_');
    const newReaction: NewReaction = {
      id: reactionId,
      emoji,
      messageId,
      profileId: profile.id,
      createdAt: new Date(),
    };

    // Insert into database
    const createdReaction = await addReactionToMessage(newReaction);

    // Get message to find out which paths to revalidate
    const message = await fetchMessageById(messageId);
    if (message) {
      if (message.parentId) {
        // If it's a thread reply, revalidate the thread path
        revalidatePath(`/channels/${message.channelId}/threads/${message.parentId}`);
      } else {
        // Otherwise revalidate the channel path
        revalidatePath(`/channels/${message.channelId}`);
      }
    }

    return {
      success: true,
      data: createdReaction,
    };
  } catch (error) {
    console.error('Error adding reaction:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Remove a reaction from a message
 */
export async function removeReaction(
  messageId: string,
  emoji: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(messageId)) {
      return { success: false, error: 'Message ID is required' };
    }

    if (isEmpty(emoji)) {
      return { success: false, error: 'Emoji is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to remove a reaction' };
    }

    // Remove from database
    await removeReactionFromMessage(messageId, profile.id, emoji);

    // Get message to find out which paths to revalidate
    const message = await fetchMessageById(messageId);
    if (message) {
      if (message.parentId) {
        // If it's a thread reply, revalidate the thread path
        revalidatePath(`/channels/${message.channelId}/threads/${message.parentId}`);
      } else {
        // Otherwise revalidate the channel path
        revalidatePath(`/channels/${message.channelId}`);
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error removing reaction:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get reactions for a message
 */
export async function getMessageReactions(
  messageId: string
): Promise<{ success: boolean; data?: Reaction[]; error?: string }> {
  try {
    if (isEmpty(messageId)) {
      return { success: false, error: 'Message ID is required' };
    }

    // Fetch reactions for the message
    const reactions = await fetchMessageReactions(messageId);

    return {
      success: true,
      data: reactions,
    };
  } catch (error) {
    console.error('Error fetching message reactions:', error);
    return { success: false, error: formatError(error) };
  }
} 