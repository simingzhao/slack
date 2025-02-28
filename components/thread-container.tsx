"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThreadList } from "./thread-list";
import { MessageInput } from "./message-input";
import { Message } from "./message-item";
import { createMessage, deleteMessage, updateMessage } from "@/app/actions/messages";

interface ThreadContainerProps {
  channelId: string;
  messageId: string;
  profileId: string;
  parentMessage: Message;
  initialMessages: Message[];
}

export function ThreadContainer({
  channelId,
  messageId,
  profileId,
  parentMessage,
  initialMessages,
}: ThreadContainerProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSendMessage = async (content: string) => {
    setIsSubmitting(true);
    
    try {
      const response = await createMessage(content, channelId, messageId);
      
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
        
        // Add the new message to the UI
        setMessages((prev) => [...prev, newMessage]);
        
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

  const handleEdit = (messageId: string) => {
    // Check if it's the parent message or a reply
    if (messageId === parentMessage.id) {
      setEditingMessage(parentMessage);
      setEditContent(parentMessage.content);
    } else {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        setEditingMessage(message);
        setEditContent(message.content);
      }
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
        if (editingMessage.id === parentMessage.id) {
          // Update parent message
          parentMessage.content = editContent;
          parentMessage.isEdited = true;
        } else {
          // Update reply message
          setMessages((prev) => 
            prev.map(m => 
              m.id === editingMessage.id 
                ? { ...m, content: editContent, isEdited: true } 
                : m
            )
          );
        }
        
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
        if (messageId === parentMessage.id) {
          // If the parent message is deleted, go back to the channel
          toast.success("Thread deleted");
          router.push(`/channels/${channelId}`);
        } else {
          // Remove the message from the UI
          setMessages((prev) => prev.filter(m => m.id !== messageId));
          
          // Refresh the data
          router.refresh();
        }
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
        <ThreadList
          parentMessage={parentMessage}
          messages={messages}
          currentProfileId={profileId}
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
        <div className="mt-auto">
          <MessageInput
            profileId={profileId}
            channelId={channelId}
            onSend={handleSendMessage}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            placeholder="Reply to thread..."
          />
        </div>
      )}
    </>
  );
} 