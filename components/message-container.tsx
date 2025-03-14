"use client";

import { useState } from "react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { useRouter } from "next/navigation";
import { createMessage, deleteMessage, updateMessage } from "@/app/actions/messages";
import { Message } from "./message-item";
import { toast } from "sonner";

interface MessageContainerProps {
  channelId: string;
  profileId: string;
  initialMessages: Message[];
}

export function MessageContainer({
  channelId,
  profileId,
  initialMessages,
}: MessageContainerProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSendMessage = async (content: string) => {
    setIsSubmitting(true);
    
    try {
      const response = await createMessage(content, channelId);
      
      if (response.success && response.data) {
        // Create a UI version of the message with profile data (optimistic update)
        const newMessage: Message = {
          ...response.data,
          profile: {
            id: response.data.profileId,
            name: "You", // This is just a placeholder, the UI will refresh with actual data
            imageUrl: ""
          },
          reactionCount: 0,
          repliesCount: 0
        };
        
        // Add the new message to the UI (at the beginning since we're displaying newest first)
        setMessages((prev) => [newMessage, ...prev]);
        
        // Refresh the data to get the complete message with profile info
        router.refresh();
      } else {
        toast.error(response.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (messageId: string) => {
    // Navigate to the thread view
    router.push(`/channels/${channelId}/threads/${messageId}`);
  };

  const handleReact = (messageId: string) => {
    // This will be implemented as part of Step 13
    toast.info(`Reactions for message ${messageId} will be implemented soon!`);
  };

  const handleEdit = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessage(message);
      setEditContent(message.content);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const handleSaveEdit = async () => {
    if (!editingMessage) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await updateMessage(editingMessage.id, editContent);
      
      if (response.success && response.data) {
        // Update the message in the UI
        setMessages((prev) => 
          prev.map(m => 
            m.id === editingMessage.id 
              ? { ...m, content: editContent, isEdited: true } 
              : m
          )
        );
        
        setEditingMessage(null);
        setEditContent("");
        
        // Refresh the data to ensure consistency
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update message");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    const confirmed = confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;
    
    try {
      const response = await deleteMessage(messageId);
      
      if (response.success) {
        // Remove the message from the UI
        setMessages((prev) => prev.filter(m => m.id !== messageId));
        
        // Refresh the data
        router.refresh();
      } else {
        toast.error(response.error || "Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          currentProfileId={profileId}
          onReply={handleReply}
          onReact={handleReact}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {editingMessage ? (
        <div className="border-t p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Edit message</h3>
            <button
              onClick={handleCancelEdit}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <MessageInput
            profileId={profileId}
            channelId={channelId}
            onSend={handleSaveEdit}
            isDisabled={isSubmitting || !editContent.trim()}
            isLoading={isSubmitting}
            initialContent={editContent}
            placeholder="Edit your message..."
            autoFocus
          />
        </div>
      ) : (
        <MessageInput
          profileId={profileId}
          channelId={channelId}
          onSend={handleSendMessage}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
} 