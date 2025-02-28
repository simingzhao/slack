import { getActiveProfile, getProfileById } from '@/lib/server-profile';
import { getDirectMessages } from '@/app/actions/direct-messages';
import { DirectMessageContainer } from '@/components/direct-message-container';
import { notFound } from 'next/navigation';
import { DirectMessage } from '@/db/schema/direct-messages';

interface DirectMessagePageProps {
  params: {
    profileId: string;
  };
}

export default async function DirectMessagePage({ params }: DirectMessagePageProps) {
  const { profileId } = params;
  
  // Get the active profile
  const profile = await getActiveProfile();
  if (!profile) {
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

  // Get the recipient profile
  const recipientProfile = await getProfileById(profileId);
  if (!recipientProfile) {
    notFound();
  }

  // Get direct messages between the two profiles
  const { data: dbMessages = [], error: messagesError } = await getDirectMessages(profileId);
  
  if (messagesError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Messages</h2>
          <p className="text-muted-foreground">{messagesError}</p>
        </div>
      </div>
    );
  }

  // Transform database messages to the expected format
  const messages: DirectMessage[] = dbMessages;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3">
        <h1 className="text-xl font-semibold">
          {recipientProfile.name}
        </h1>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DirectMessageContainer
          recipientProfile={recipientProfile}
          currentProfileId={profile.id}
          initialMessages={messages}
        />
      </div>
    </div>
  );
} 