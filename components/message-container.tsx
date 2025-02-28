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

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await createMessage(content, channelId);
      
      if (result.success && result.data) {
        // Add message to state - we'll refresh the page anyway
        // This is a simplification - in a real app we'd want to properly transform
        // the server data into the expected client Message type
        router.refresh();
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (messageId: string) => {
    // Navigate to the thread page
    router.push(`/channels/${channelId}/threads/${messageId}`);
  };

  const handleReact = () => {
    // This will be implemented in a future step
    toast.info("Reactions will be implemented in a future step");
  };

  const handleEdit = async (messageId: string) => {
    // Find the message to edit
    const messageToEdit = messages.find(m => m.id === messageId);
    if (!messageToEdit) return;
    
    // For simplicity, we'll use a prompt for now
    // In a real app, you'd use a modal or inline editing
    const newContent = prompt("Edit message:", messageToEdit.content);
    if (!newContent || newContent === messageToEdit.content) return;
    
    try {
      const result = await updateMessage(messageId, newContent);
      
      if (result.success && result.data) {
        // We'll just refresh the page instead of trying to update state
        // This avoids type conversion issues
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update message");
      }
    } catch (error) {
      toast.error("An error occurred while updating the message");
      console.error(error);
    }
  };

  const handleDelete = async (messageId: string) => {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const result = await deleteMessage(messageId);
      
      if (result.success) {
        // Remove message from state
        setMessages(prev => prev.filter(m => m.id !== messageId));
        toast.success("Message deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the message");
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
      <MessageInput
        profileId={profileId}
        channelId={channelId}
        onSend={handleSendMessage}
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
      />
    </div>
  );
} 