"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageInput } from "./message-input";
import { createDirectMessage, deleteDirectMessage, updateDirectMessage } from "@/app/actions/direct-messages";
import { DirectMessage } from "@/db/schema/direct-messages";
import { Profile } from "@/db/schema/profiles";
import { DirectMessageList } from "./direct-message-list";

interface DirectMessageContainerProps {
  recipientProfile: Profile;
  currentProfileId: string;
  initialMessages: DirectMessage[];
}

export function DirectMessageContainer({
  recipientProfile,
  currentProfileId,
  initialMessages,
}: DirectMessageContainerProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMessage, setEditingMessage] = useState<DirectMessage | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSendMessage = async (content: string) => {
    setIsSubmitting(true);
    
    try {
      const response = await createDirectMessage(content, recipientProfile.id);
      
      if (response.success && response.data) {
        // Create a UI version of the message (optimistic update)
        const newMessage: DirectMessage = {
          ...response.data,
        };
        
        // Add the new message to the UI
        setMessages((prev) => [newMessage, ...prev]);
        
        // Refresh the data to ensure consistency
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
      const response = await updateDirectMessage(editingMessage.id, editContent);
      
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
    try {
      const response = await deleteDirectMessage(messageId);
      
      if (response.success) {
        // Remove the message from the UI
        setMessages((prev) => prev.filter(m => m.id !== messageId));
        
        // Refresh the data to ensure consistency
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
    <>
      <div className="flex-1 overflow-y-auto">
        <DirectMessageList
          messages={messages}
          currentProfileId={currentProfileId}
          recipientProfile={recipientProfile}
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
            profileId={currentProfileId}
            channelId="" // Not used for DMs
            onSend={handleSaveEdit}
            isDisabled={isSubmitting || !editContent.trim()}
            isLoading={isSubmitting}
            initialContent={editContent}
            placeholder="Edit your message..."
            autoFocus
          />
        </div>
      ) : (
        <div className="mt-auto">
          <MessageInput
            profileId={currentProfileId}
            channelId="" // Not used for DMs
            onSend={handleSendMessage}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            placeholder={`Message ${recipientProfile.name}`}
          />
        </div>
      )}
    </>
  );
} 