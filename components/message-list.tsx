"use client";

import { memo } from "react";
import { MessageItem, Message } from "./message-item";

interface MessageListProps {
  messages: Message[];
  currentProfileId: string;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  isLoading?: boolean;
}

const MessageListComponent = ({
  messages,
  currentProfileId,
  onReply,
  onReact,
  onEdit,
  onDelete,
  isLoading,
}: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">No messages yet. Be the first to start the conversation!</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-0.5">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          currentProfileId={currentProfileId}
          onReply={onReply}
          onReact={onReact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export const MessageList = memo(MessageListComponent); 