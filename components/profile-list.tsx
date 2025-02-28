"use client";

import { useState } from "react";
import { Profile } from "@/db/schema/profiles";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProfileListProps {
  profiles: Profile[];
  currentProfileId: string;
  selectedProfileId?: string;
}

export function ProfileList({
  profiles,
  currentProfileId,
  selectedProfileId,
}: ProfileListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter((profile) => 
    profile.id !== currentProfileId && // Don't show current user
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search profiles"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-1">
        {filteredProfiles.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 py-2">
            {searchQuery
              ? "No profiles found matching your search"
              : "No profiles available for direct messaging"}
          </p>
        ) : (
          filteredProfiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/messages/${profile.id}`}
              className={cn(
                "flex items-center gap-x-2 px-2 py-2 rounded-md hover:bg-accent group",
                selectedProfileId === profile.id && "bg-accent"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.imageUrl} alt={profile.name} />
                <AvatarFallback>
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="font-medium">{profile.name}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 