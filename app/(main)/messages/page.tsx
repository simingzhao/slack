import { getAllProfiles, getActiveProfile } from '@/lib/server-profile';
import { ProfileList } from '@/components/profile-list';

export default async function MessagesPage() {
  // Get the active profile
  const activeProfile = await getActiveProfile();
  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Profile Selected</h2>
          <p className="text-muted-foreground">
            Please select a profile to use direct messaging
          </p>
        </div>
      </div>
    );
  }

  // Get all available profiles
  const profiles = await getAllProfiles();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Direct Messages</h1>
      </div>
      <div className="p-4">
        <ProfileList 
          profiles={profiles}
          currentProfileId={activeProfile.id}
        />
      </div>
    </div>
  );
} 