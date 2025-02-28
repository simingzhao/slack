"use client";

import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar/sidebar-nav";
import { SidebarSection } from "@/components/sidebar/sidebar-section";
import { ProfileDisplay } from "@/components/sidebar/profile-display";
import { ChannelList } from "@/components/channel-list";
import { Channel as ChannelType } from "@/components/channel-item";
import { getChannels } from "@/app/actions/channels";

export function Sidebar() {
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        // Use the server action instead of direct database access
        const result = await getChannels();
        
        if (result.success && result.data) {
          // Convert to the Channel interface expected by ChannelList
          const formattedChannels: ChannelType[] = result.data.map((channel) => ({
            id: channel.id,
            name: channel.name,
            description: channel.description || "",
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt,
            isPrivate: channel.type === "private",
          }));
          
          setChannels(formattedChannels);
        } else {
          console.error("Error fetching channels:", result.error);
          setChannels([]);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
        // Provide some default channels as fallback during development
        setChannels([
          {
            id: "1",
            name: "general",
            description: "General discussions",
            createdAt: new Date(),
          },
          {
            id: "2",
            name: "random",
            description: "Random topics",
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleAddChannel = () => {
    // This would be implemented in Step 8
    console.log("Add channel clicked");
  };

  return (
    <aside className="flex h-full w-64 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4">
        <ProfileDisplay />
      </div>
      <div className="space-y-4 flex-1">
        <SidebarNav />
        <SidebarSection title="Channels">
          <ChannelList 
            channels={channels} 
            isLoading={isLoading} 
            onAddChannel={handleAddChannel} 
          />
        </SidebarSection>
        <SidebarSection title="Direct Messages">
          {/* Will be implemented in Step 15 */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Coming soon...
          </div>
        </SidebarSection>
      </div>
    </aside>
  );
} 