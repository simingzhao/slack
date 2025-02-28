"use client";

import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar/sidebar-nav";
import { SidebarSection } from "@/components/sidebar/sidebar-section";
import { ProfileDisplay } from "@/components/sidebar/profile-display";
import { ChannelList } from "@/components/channel-list";
import { Channel as ChannelType } from "@/components/channel-item";
import { getChannels } from "@/app/actions/channels";
import { Profile } from "@/db/schema/profiles";
import { getDirectMessageConversations } from "@/app/actions/direct-messages";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isChannelsLoading, setIsChannelsLoading] = useState(true);
  const [dmProfiles, setDmProfiles] = useState<Profile[]>([]);
  const [isDmLoading, setIsDmLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsChannelsLoading(true);
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
        setIsChannelsLoading(false);
      }
    };

    const fetchDmConversations = async () => {
      try {
        setIsDmLoading(true);
        const result = await getDirectMessageConversations();
        
        if (result.success && result.data) {
          setDmProfiles(result.data);
        } else {
          console.error("Error fetching DM conversations:", result.error);
          setDmProfiles([]);
        }
      } catch (error) {
        console.error("Error fetching DM conversations:", error);
        setDmProfiles([]);
      } finally {
        setIsDmLoading(false);
      }
    };

    fetchChannels();
    fetchDmConversations();
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
            isLoading={isChannelsLoading} 
            onAddChannel={handleAddChannel} 
          />
        </SidebarSection>
        <SidebarSection title="Direct Messages">
          {isDmLoading ? (
            <div className="text-sm text-slate-500 dark:text-slate-400 py-1">
              Loading...
            </div>
          ) : dmProfiles.length === 0 ? (
            <div className="text-sm text-slate-500 dark:text-slate-400 py-1">
              No direct messages
            </div>
          ) : (
            <div className="space-y-1">
              {dmProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/messages/${profile.id}`}
                  className={cn(
                    "flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white",
                    pathname === `/messages/${profile.id}` && "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile.imageUrl} alt={profile.name} />
                    <AvatarFallback>
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{profile.name}</span>
                </Link>
              ))}
            </div>
          )}
          <Link 
            href="/messages"
            className={cn(
              "flex items-center gap-x-2 rounded-md px-3 py-2 mt-1 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white",
              pathname === "/messages" && "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
            )}
          >
            <UserPlus className="h-4 w-4" />
            <span>New Message</span>
          </Link>
        </SidebarSection>
      </div>
    </aside>
  );
} 