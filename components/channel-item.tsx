"use client";

import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Channel {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  isPrivate?: boolean;
  newMessagesCount?: number;
}

interface ChannelItemProps {
  channel: Channel;
  isActive?: boolean;
  onClick?: () => void;
}

export function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  return (
    <Link
      href={`/channels/${channel.id}`}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-x-2 w-full py-2 px-3 rounded-md hover:bg-muted/50 transition",
        isActive && "bg-muted"
      )}
    >
      <Hash className={cn(
        "h-4 w-4 flex-shrink-0 text-muted-foreground",
        isActive && "text-foreground"
      )} />
      <div className="flex items-center justify-between w-full overflow-hidden">
        <span className={cn(
          "truncate text-sm font-medium text-muted-foreground",
          isActive && "text-foreground font-semibold",
        )}>
          {channel.name}
        </span>
        {channel.newMessagesCount ? (
          <div className="ml-auto flex-shrink-0 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
            {channel.newMessagesCount > 99 ? "99+" : channel.newMessagesCount}
          </div>
        ) : null}
      </div>
    </Link>
  );
} 