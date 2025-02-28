"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "./message-item";

interface ThreadItemProps {
  message: Message;
  currentProfileId: string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  isParent?: boolean;
}

export function ThreadItem({
  message,
  currentProfileId,
  onEdit,
  onDelete,
  isParent = false,
}: ThreadItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOwner = message.profileId === currentProfileId;
  
  return (
    <div 
      className={cn(
        "group flex items-start gap-x-3 py-4 px-4 hover:bg-muted/50 transition",
        isParent && "border-b mb-2"
      )}
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
      </div>
      
      {isHovered && isOwner && (
        <div className="flex items-center gap-x-2 absolute right-4">
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
        </div>
      )}
    </div>
  );
} 