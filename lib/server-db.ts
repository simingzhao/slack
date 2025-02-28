'use server';

/**
 * This file contains server-only database utility functions.
 * It should ONLY be imported from server components or server actions.
 */
import 'server-only';

import { db } from '@/db/db';
import { channels, NewChannel } from '@/db/schema/channels';
import { messages, NewMessage } from '@/db/schema/messages';
import { desc, eq, like, and, isNull, asc, or } from 'drizzle-orm';
import { reactions, NewReaction } from '@/db/schema/reactions';
import { directMessages, NewDirectMessage } from '@/db/schema/direct-messages';
import { profiles, Profile } from '@/db/schema/profiles';

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

/**
 * Fetch thread messages for a parent message
 */
export async function fetchThreadMessages(parentId: string, limit = 50) {
  try {
    return await db.query.messages.findMany({
      where: eq(messages.parentId, parentId),
      with: {
        profile: true,
      },
      orderBy: [asc(messages.createdAt)], // Thread replies are shown in chronological order
      limit,
    });
  } catch (error) {
    console.error('Error in fetchThreadMessages:', error);
    throw error;
  }
}

/**
 * Add a reaction to a message
 */
export async function addReactionToMessage(reactionData: NewReaction) {
  try {
    // We need to handle the uniqueness constraint - if the same user reacts with the
    // same emoji to the same message, we should not create a duplicate
    // First we check if the reaction already exists
    const existingReaction = await db.query.reactions.findFirst({
      where: and(
        eq(reactions.messageId, reactionData.messageId),
        eq(reactions.profileId, reactionData.profileId),
        eq(reactions.emoji, reactionData.emoji)
      )
    });

    if (existingReaction) {
      // Reaction already exists, so return it
      return existingReaction;
    }

    // Insert the new reaction
    await db.insert(reactions).values(reactionData);
    
    // Return the newly created reaction
    return await db.query.reactions.findFirst({
      where: eq(reactions.id, reactionData.id)
    });
  } catch (error) {
    console.error('Error in addReactionToMessage:', error);
    throw error;
  }
}

/**
 * Remove a reaction from a message
 */
export async function removeReactionFromMessage(messageId: string, profileId: string, emoji: string) {
  try {
    await db.delete(reactions)
      .where(
        and(
          eq(reactions.messageId, messageId),
          eq(reactions.profileId, profileId),
          eq(reactions.emoji, emoji)
        )
      );
    
    return true;
  } catch (error) {
    console.error('Error in removeReactionFromMessage:', error);
    throw error;
  }
}

/**
 * Fetch reactions for a message
 */
export async function fetchMessageReactions(messageId: string) {
  try {
    return await db.query.reactions.findMany({
      where: eq(reactions.messageId, messageId),
      with: {
        profile: true,
      },
    });
  } catch (error) {
    console.error('Error in fetchMessageReactions:', error);
    throw error;
  }
}

/**
 * Create a new direct message
 */
export async function createDirectMessageInDb(messageData: NewDirectMessage) {
  try {
    await db.insert(directMessages).values(messageData);
    return await fetchDirectMessageById(messageData.id);
  } catch (error) {
    console.error('Error in createDirectMessageInDb:', error);
    throw error;
  }
}

/**
 * Fetch a direct message by ID
 */
export async function fetchDirectMessageById(messageId: string) {
  try {
    return await db.query.directMessages.findFirst({
      where: eq(directMessages.id, messageId),
    });
  } catch (error) {
    console.error('Error in fetchDirectMessageById:', error);
    throw error;
  }
}

/**
 * Fetch direct messages between two profiles
 */
export async function fetchDirectMessages(profileId1: string, profileId2: string, limit = 50) {
  try {
    return await db.query.directMessages.findMany({
      where: or(
        and(
          eq(directMessages.senderId, profileId1),
          eq(directMessages.recipientId, profileId2)
        ),
        and(
          eq(directMessages.senderId, profileId2),
          eq(directMessages.recipientId, profileId1)
        )
      ),
      orderBy: [desc(directMessages.createdAt)],
      limit,
    });
  } catch (error) {
    console.error('Error in fetchDirectMessages:', error);
    throw error;
  }
}

/**
 * Update a direct message
 */
export async function updateDirectMessageInDb(messageId: string, content: string) {
  try {
    await db.update(directMessages)
      .set({ 
        content, 
        isEdited: true,
        updatedAt: new Date()
      })
      .where(eq(directMessages.id, messageId));
    
    return await fetchDirectMessageById(messageId);
  } catch (error) {
    console.error('Error in updateDirectMessageInDb:', error);
    throw error;
  }
}

/**
 * Delete a direct message
 */
export async function deleteDirectMessageFromDb(messageId: string) {
  try {
    await db.delete(directMessages)
      .where(eq(directMessages.id, messageId));
    
    return true;
  } catch (error) {
    console.error('Error in deleteDirectMessageFromDb:', error);
    throw error;
  }
}

/**
 * Get direct message conversations for a profile
 */
export async function fetchDirectMessageConversations(profileId: string): Promise<Profile[]> {
  try {
    // Find all unique profiles this user has direct messaged with
    // This is a bit more complex - we need all profiles where they're either
    // the sender or recipient in direct messages
    
    // First, get all direct messages where the profile is either sender or recipient
    const dmMessages = await db.query.directMessages.findMany({
      where: or(
        eq(directMessages.senderId, profileId),
        eq(directMessages.recipientId, profileId)
      ),
      orderBy: [desc(directMessages.createdAt)],
    });
    
    // Now extract unique profile IDs (the other person in each conversation)
    const uniqueProfileIds = new Set<string>();
    
    dmMessages.forEach(message => {
      if (message.senderId === profileId) {
        uniqueProfileIds.add(message.recipientId);
      } else {
        uniqueProfileIds.add(message.senderId);
      }
    });
    
    // Now get all the profile information for these IDs
    const conversationProfiles = await Promise.all(
      Array.from(uniqueProfileIds).map(id => 
        db.query.profiles.findFirst({
          where: eq(profiles.id, id)
        })
      )
    );
    
    // Filter out any nulls and sort by name
    return conversationProfiles
      .filter((profile): profile is Profile => Boolean(profile))
      .sort((a: Profile, b: Profile) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error in fetchDirectMessageConversations:', error);
    throw error;
  }
} 