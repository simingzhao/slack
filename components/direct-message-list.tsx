"use client";

import { memo } from "react";
import { DirectMessage } from "@/db/schema/direct-messages";
import { Profile } from "@/db/schema/profiles";
import { DirectMessageItem } from "./direct-message-item";

interface DirectMessageListProps {
  messages: DirectMessage[];
  currentProfileId: string;
  recipientProfile: Profile;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  isLoading?: boolean;
}

export const DirectMessageList = memo(function DirectMessageList({
  messages,
  currentProfileId,
  recipientProfile,
  onEdit,
  onDelete,
  isLoading = false,
}: DirectMessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">No messages yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Send a message to start a conversation with {recipientProfile.name}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {messages.map((message) => (
        <DirectMessageItem
          key={message.id}
          message={message}
          currentProfileId={currentProfileId}
          recipientProfile={recipientProfile}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}); 