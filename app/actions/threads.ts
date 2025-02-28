'use server';

import { Message } from '@/db/schema/messages';
import { formatError, isEmpty } from '@/lib/helpers';
import { 
  fetchMessageById, 
  fetchThreadMessages
} from '@/lib/server-db';

/**
 * Get thread messages for a parent message
 */
export async function getThreadMessages(
  parentId: string
): Promise<{ success: boolean; data?: Message[]; parentMessage?: Message; error?: string }> {
  try {
    if (isEmpty(parentId)) {
      return { success: false, error: 'Parent message ID is required' };
    }

    // Fetch the parent message first
    const parentMessage = await fetchMessageById(parentId);
    if (!parentMessage) {
      return { success: false, error: 'Parent message not found' };
    }

    // Fetch messages that are replies to the parent message
    const threadMessages = await fetchThreadMessages(parentId);

    return {
      success: true,
      data: threadMessages,
      parentMessage
    };
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    return { success: false, error: formatError(error) };
  }
} 