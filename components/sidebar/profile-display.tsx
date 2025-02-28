import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { getCurrentProfile, setCurrentProfile } from "@/lib/profile";
import { Profile } from "@/db/schema";

export function ProfileDisplay() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get the current profile ID from client storage
        const profileId = getCurrentProfile();
        
        if (!profileId) {
          // If no profile is selected, try to get the first available profile
          const response = await fetch(`/api/profiles`);
          if (!response.ok) throw new Error('Failed to load profiles');
          
          const data = await response.json();
          if (data.profiles && data.profiles.length > 0) {
            // Use the first profile and set it as current
            setProfile(data.profiles[0]);
            setCurrentProfile(data.profiles[0].id);
            return;
          }
          
          setLoading(false);
          return;
        }
        
        // Fetch the profile data from the server
        const response = await fetch(`/api/profiles/${profileId}`);
        if (!response.ok) throw new Error('Failed to load profile');
        
        const data = await response.json();
        setProfile(data.profile);
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 rounded-md border p-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (error) {
    return (
      <Link href="/" className="flex w-full items-center space-x-2 rounded-md border px-3 py-2 text-left hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <span>!</span>
        </div>
        <span className="text-sm font-medium">Error: {error}</span>
      </Link>
    );
  }

  if (!profile) {
    return (
      <Link href="/" className="flex w-full items-center space-x-2 rounded-md border px-3 py-2 text-left hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <span>?</span>
        </div>
        <span className="text-sm font-medium">Select Profile</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center space-x-2 rounded-md border px-3 py-2 text-left hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{profile.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/" className="flex cursor-pointer items-center">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Switch Profile</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 