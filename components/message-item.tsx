"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function MessageItem({
  message,
  currentProfileId,
  onReply,
  onReact,
  onEdit,
  onDelete,
}: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOwner = message.profileId === currentProfileId;
  
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
        
        <div className="flex items-center gap-x-2 pt-1">
          {!!message.reactionCount && (
            <div className="flex items-center text-xs text-muted-foreground">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              {message.reactionCount}
            </div>
          )}
          
          {!!message.repliesCount && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              {message.repliesCount}
            </div>
          )}
        </div>
      </div>
      
      {isHovered && (
        <div className={cn(
          "flex items-center gap-x-2 absolute right-4",
          isOwner ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <Button
            onClick={() => onReply?.(message.id)}
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onReact?.(message.id)}
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          {isOwner && (
            <>
              <Button
                onClick={() => onEdit?.(message.id)}
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => onDelete?.(message.id)}
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
} 