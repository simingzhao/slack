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
import { getActiveProfile } from "@/lib/profile";
import { Profile } from "@/db/schema";

export function ProfileDisplay() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const activeProfile = await getActiveProfile();
      setProfile(activeProfile);
    };

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center space-x-2 rounded-md border p-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
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