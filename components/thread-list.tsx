"use client";

import { memo } from "react";
import { ThreadItem } from "./thread-item";
import { Message } from "./message-item";

interface ThreadListProps {
  parentMessage: Message;
  messages: Message[];
  currentProfileId: string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  isLoading?: boolean;
}

const ThreadListComponent = ({
  parentMessage,
  messages,
  currentProfileId,
  onEdit,
  onDelete,
  isLoading,
}: ThreadListProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading thread...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Parent message */}
      <ThreadItem 
        message={parentMessage}
        currentProfileId={currentProfileId}
        onEdit={onEdit}
        onDelete={onDelete}
        isParent
      />
      
      {/* Thread replies */}
      {messages.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          No replies yet. Be the first to reply to this thread!
        </div>
      ) : (
        <div className="space-y-0.5 ml-4 pl-4 border-l">
          {messages.map((message) => (
            <ThreadItem
              key={message.id}
              message={message}
              currentProfileId={currentProfileId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export const ThreadList = memo(ThreadListComponent); 