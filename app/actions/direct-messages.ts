'use server';

import { DirectMessage, NewDirectMessage } from '@/db/schema/direct-messages';
import { revalidatePath } from 'next/cache';
import { formatError, generateId, isEmpty } from '@/lib/helpers';
import { getActiveProfile } from '@/lib/server-profile';
import { 
  createDirectMessageInDb, 
  fetchDirectMessageById, 
  fetchDirectMessages, 
  updateDirectMessageInDb, 
  deleteDirectMessageFromDb,
  fetchDirectMessageConversations
} from '@/lib/server-db';
import { Profile } from '@/db/schema/profiles';

/**
 * Create a new direct message
 */
export async function createDirectMessage(
  content: string,
  recipientId: string
): Promise<{ success: boolean; data?: DirectMessage; error?: string }> {
  try {
    // Validate inputs
    if (isEmpty(content)) {
      return { success: false, error: 'Message content is required' };
    }

    if (isEmpty(recipientId)) {
      return { success: false, error: 'Recipient ID is required' };
    }

    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to send a message' };
    }

    // Create message with generated ID
    const messageId = generateId('dm_');
    const newMessage: NewDirectMessage = {
      id: messageId,
      content,
      senderId: profile.id,
      recipientId,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const createdMessage = await createDirectMessageInDb(newMessage);

    // Revalidate the appropriate path
    revalidatePath(`/messages/${recipientId}`);

    return {
      success: true,
      data: createdMessage!,
    };
  } catch (error) {
    console.error('Error creating direct message:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get direct messages between the current user and another profile
 */
export async function getDirectMessages(
  profileId: string
): Promise<{ success: boolean; data?: DirectMessage[]; error?: string }> {
  try {
    if (isEmpty(profileId)) {
      return { success: false, error: 'Profile ID is required' };
    }

    // Get active profile
    const currentProfile = await getActiveProfile();
    if (!currentProfile) {
      return { success: false, error: 'You must be logged in to view messages' };
    }

    // Fetch direct messages between the two profiles
    const directMessages = await fetchDirectMessages(currentProfile.id, profileId);

    return {
      success: true,
      data: directMessages,
    };
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Update a direct message
 */
export async function updateDirectMessage(
  messageId: string,
  content: string
): Promise<{ success: boolean; data?: DirectMessage; error?: string }> {
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
    const message = await fetchDirectMessageById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Ensure the profile owns the message
    if (message.senderId !== profile.id) {
      return { success: false, error: 'You can only edit your own messages' };
    }

    // Update the message
    const updatedMessage = await updateDirectMessageInDb(messageId, content);

    // Revalidate the appropriate path
    revalidatePath(`/messages/${message.recipientId}`);

    return {
      success: true,
      data: updatedMessage!,
    };
  } catch (error) {
    console.error('Error updating direct message:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Delete a direct message
 */
export async function deleteDirectMessage(
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
    const message = await fetchDirectMessageById(messageId);
    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    // Ensure the profile owns the message
    if (message.senderId !== profile.id) {
      return { success: false, error: 'You can only delete your own messages' };
    }

    // Delete the message
    await deleteDirectMessageFromDb(messageId);

    // Revalidate the appropriate path
    revalidatePath(`/messages/${message.recipientId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting direct message:', error);
    return { success: false, error: formatError(error) };
  }
}

/**
 * Get all direct message conversations for the current user
 */
export async function getDirectMessageConversations(): Promise<{ success: boolean; data?: Profile[]; error?: string }> {
  try {
    // Get active profile
    const profile = await getActiveProfile();
    if (!profile) {
      return { success: false, error: 'You must be logged in to view conversations' };
    }

    // Fetch conversations
    const conversations = await fetchDirectMessageConversations(profile.id);

    return {
      success: true,
      data: conversations,
    };
  } catch (error) {
    console.error('Error fetching direct message conversations:', error);
    return { success: false, error: formatError(error) };
  }
} 