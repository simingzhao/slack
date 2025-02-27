"use client";

import { usePathname } from "next/navigation";
import { memo } from "react";
import { Channel, ChannelItem } from "./channel-item";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ChannelListProps {
  channels: Channel[];
  onAddChannel?: () => void;
  isLoading?: boolean;
}

const ChannelListComponent = ({
  channels,
  onAddChannel,
  isLoading,
}: ChannelListProps) => {
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="px-2 py-2">
        <div className="text-xs text-muted-foreground">Loading channels...</div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between px-2 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
          Channels
        </h3>
        {onAddChannel && (
          <Button
            onClick={onAddChannel}
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-md"
          >
            <PlusCircle className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div className="space-y-0.5">
        {channels.length === 0 ? (
          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground">No channels yet</div>
          </div>
        ) : (
          <>
            {channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={pathname === `/channels/${channel.id}`}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export const ChannelList = memo(ChannelListComponent); 