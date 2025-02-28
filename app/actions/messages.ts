'use server';

import { Message, NewMessage } from '@/db/schema/messages';
import { revalidatePath } from 'next/cache';
import { formatError, generateId, isEmpty } from '@/lib/helpers';
import { getActiveProfile } from '@/lib/server-profile';
import { 
  fetchMessageById, 
  createMessageInDb, 
  fetchChannelMessages, 
  updateMessageInDb, 
  deleteMessageFromDb
} from '@/lib/server-db';

/**
 * Create a new message
 */
export async function createMessage(
  content: string,
  channelId: string,
  parentId?: string
): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(content)) {
      return { success: false, error: 'Message content is required' };
    }

    if (isEmpty(channelId)) {
      return { success: false, error: 'Channel ID is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to send a message' };
    }

    // Create message with generated ID
    const messageId = generateId('msg_');
    const newMessage: NewMessage = {
      id: messageId,
      content,
      channelId,
      profileId: profile.id,
      parentId: parentId || null,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const createdMessage = await createMessageInDb(newMessage);

    // Revalidate the appropriate path
    if (parentId) {
      // If it's a thread reply, revalidate the thread path
      revalidatePath(`/channels/${channelId}/threads/${parentId}`);
    } else {
      // Otherwise revalidate the channel path
      revalidatePath(`/channels/${channelId}`);
    }

    return {
      success: true,
      data: createdMessage!,
    };
  } catch (error) {
    console.error('Error creating message:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get messages for a channel
 */
export async function getChannelMessages(
  channelId: string
): Promise<{ success: boolean; data?: Message[]; error?: string }> {
  try {
    if (isEmpty(channelId)) {
      return { success: false, error: 'Channel ID is required' };
    }

    // Fetch messages for the channel
    const messages = await fetchChannelMessages(channelId);

    return {
      success: true,
      data: messages,
    };
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get a specific message by ID
 */
export async function getMessageById(
  messageId: string
): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    if (isEmpty(messageId)) {
      return { success: false, error: 'Message ID is required' };
    }

    // Fetch the message
    const message = await fetchMessageById(messageId);

    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    return {
      success: true,
      data: message,
    };
  } catch (error) {
    console.error('Error fetching message:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Update a message
 */
export async function updateMessage(
  messageId: string,
  content: string
): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(messageId)) {
      return { success: false, error: 'Message ID is required' };
    }

    if (isEmpty(content)) {
      return { success: false, error: 'Message content is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to update a message' };
    }

    // Fetch the message to check ownership
    const message = await fetchMessageById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Ensure the profile owns the message
    if (message.profileId !== profile.id) {
      return { success: false, error: 'You can only edit your own messages' };
    }

    // Update the message
    const updatedMessage = await updateMessageInDb(messageId, content);

    // Revalidate the appropriate paths
    if (message.parentId) {
      // If it's a thread reply, revalidate the thread path
      revalidatePath(`/channels/${message.channelId}/threads/${message.parentId}`);
    } else {
      // Otherwise revalidate the channel path
      revalidatePath(`/channels/${message.channelId}`);
    }

    return {
      success: true,
      data: updatedMessage!,
    };
  } catch (error) {
    console.error('Error updating message:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(messageId)) {
      return { success: false, error: 'Message ID is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to delete a message' };
    }

    // Fetch the message to check ownership
    const message = await fetchMessageById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Ensure the profile owns the message
    if (message.profileId !== profile.id) {
      return { success: false, error: 'You can only delete your own messages' };
    }

    // Delete the message
    await deleteMessageFromDb(messageId);

    // Revalidate the appropriate paths
    if (message.parentId) {
      // If it's a thread reply, revalidate the thread path
      revalidatePath(`/channels/${message.channelId}/threads/${message.parentId}`);
    } else {
      // Otherwise revalidate the channel path
      revalidatePath(`/channels/${message.channelId}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: formatError(error) };
  }
} 