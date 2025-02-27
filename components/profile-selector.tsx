"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfiles } from "@/actions/profiles";
import { setCurrentProfile, getCurrentProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Profile type definition
interface Profile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

export function ProfileSelector() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profiles on component mount
  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      try {
        const fetchedProfiles = await getProfiles();
        setProfiles(fetchedProfiles);
        
        // Check if there's a previously selected profile
        const currentProfileId = getCurrentProfile();
        if (currentProfileId) {
          const currentProfile = fetchedProfiles.find(p => p.id === currentProfileId);
          if (currentProfile) {
            setSelectedProfile(currentProfile);
          }
        }
      } catch (error) {
        console.error("Failed to load profiles:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfiles();
  }, []);

  // Handle profile selection
  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setCurrentProfile(profile.id);
    router.refresh();
  };

  // Display loading state
  if (loading) {
    return <div className="text-center py-4">Loading profiles...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Current profile display */}
      {selectedProfile ? (
        <div className="flex items-center gap-2 p-2 rounded-lg border">
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedProfile.imageUrl} alt={selectedProfile.name} />
            <AvatarFallback>{selectedProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{selectedProfile.name}</div>
            <div className="text-sm text-muted-foreground">{selectedProfile.email}</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">No profile selected</div>
      )}

      {/* Profile dropdown selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedProfile ? "Switch Profile" : "Select a Profile"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select a Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedProfile?.id || ""}
            onValueChange={(value) => {
              const profile = profiles.find(p => p.id === value);
              if (profile) {
                handleSelectProfile(profile);
              }
            }}
          >
            {profiles.map((profile) => (
              <DropdownMenuRadioItem
                key={profile.id}
                value={profile.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.imageUrl} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-xs text-muted-foreground">{profile.email}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 