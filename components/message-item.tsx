"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MessageReactions } from "./message-reactions";
import { ReactionPicker } from "./reaction-picker";

interface Profile {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  profileId: string;
  channelId: string;
  createdAt: Date;
  updatedAt?: Date;
  profile: Profile;
  reactionCount?: number;
  repliesCount?: number;
  isEdited?: boolean;
}

interface MessageItemProps {
  message: Message;
  currentProfileId: string;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showThreadButton?: boolean;
}

export function MessageItem({
  message,
  currentProfileId,
  onReply,
  onReact,
  onEdit,
  onDelete,
  showThreadButton = true,
}: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOwner = message.profileId === currentProfileId;
  const [showReactions, setShowReactions] = useState(false);
  
  const handleReactionSelect = () => {
    // When a reaction is selected, we refresh the reactions
    setShowReactions(true);
    // Also call the parent onReact handler if provided
    onReact?.(message.id);
  };
  
  return (
    <div 
      className="group flex items-start gap-x-3 py-4 px-4 hover:bg-muted/50 transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.profile.imageUrl} />
        <AvatarFallback>
          {message.profile.name.split(" ").map(n => n[0]).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-x-2">
          <div className="font-semibold text-sm">
            {message.profile.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            {message.isEdited && <span className="ml-1 text-xs text-muted-foreground">(edited)</span>}
          </div>
        </div>
        
        <p className="text-sm">
          {message.content}
        </p>
        
        {/* Show message reactions */}
        {(showReactions || !!message.reactionCount) && (
          <MessageReactions
            messageId={message.id}
            currentProfileId={currentProfileId}
            onReactionUpdated={() => onReact?.(message.id)}
          />
        )}
        
        <div className="flex items-center gap-x-2 pt-1">
          {!!message.repliesCount && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Link href={`/channels/${message.channelId}/threads/${message.id}`}>
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                {message.repliesCount} {message.repliesCount === 1 ? 'reply' : 'replies'}
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {isHovered && (
        <div className={cn(
          "flex items-center gap-x-2 absolute right-4",
          isOwner ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {showThreadButton && onReply && (
            <Button
              onClick={() => onReply(message.id)}
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
          <ReactionPicker 
            messageId={message.id}
            onSelect={handleReactionSelect}
          />
          {isOwner && (
            <>
              {onEdit && (
                <Button
                  onClick={() => onEdit(message.id)}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(message.id)}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 