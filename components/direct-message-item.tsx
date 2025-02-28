"use client";

import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DirectMessage } from "@/db/schema/direct-messages";
import { Profile } from "@/db/schema/profiles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DirectMessageItemProps {
  message: DirectMessage;
  currentProfileId: string;
  recipientProfile: Profile;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const DirectMessageItem = memo(function DirectMessageItem({
  message,
  currentProfileId,
  recipientProfile,
  onEdit,
  onDelete,
}: DirectMessageItemProps) {
  const isCurrentUser = message.senderId === currentProfileId;
  const messageProfile = isCurrentUser ? null : recipientProfile;
  const formattedDate = format(new Date(message.createdAt), "MMM d, h:mm a");

  return (
    <div
      className={cn(
        "group flex items-start gap-x-3",
        isCurrentUser && "justify-end"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={messageProfile?.imageUrl} alt={messageProfile?.name} />
          <AvatarFallback>
            {messageProfile?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "flex flex-col",
        isCurrentUser && "items-end"
      )}>
        <div className="flex items-center gap-x-2">
          {!isCurrentUser && (
            <div className="font-semibold text-sm">{messageProfile?.name}</div>
          )}
          <div className="text-xs text-muted-foreground">
            {formattedDate}
          </div>
          {isCurrentUser && message && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center">
                  <EllipsisVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(message.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(message.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className={cn(
          "max-w-sm rounded-xl px-3 py-2 mt-1",
          isCurrentUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-accent"
        )}>
          {message.content}
          {message.isEdited && (
            <span className="text-xs ml-1 opacity-70">(edited)</span>
          )}
        </div>
      </div>
    </div>
  );
}); 