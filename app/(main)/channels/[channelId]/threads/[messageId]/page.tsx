import { getActiveProfile, getProfileById } from '@/lib/server-profile';
import { getThreadMessages } from '@/app/actions/threads';
import { ThreadContainer } from '@/components/thread-container';
import { notFound } from 'next/navigation';
import { Message } from '@/components/message-item';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ThreadPageProps {
  params: {
    channelId: string;
    messageId: string;
  };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { channelId, messageId } = params;
  
  // Get the active profile
  const profile = await getActiveProfile();
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Profile Selected</h2>
          <p className="text-muted-foreground">
            Please select a profile to view this thread
          </p>
        </div>
      </div>
    );
  }

  // Get the thread messages
  const { data: dbMessages = [], parentMessage: dbParentMessage, error: messagesError } = 
    await getThreadMessages(messageId);
  
  if (messagesError || !dbParentMessage) {
    notFound();
  }
  
  // Transform parent message to UI component format
  const parentProfileData = await getProfileById(dbParentMessage.profileId);
  const parentMessage: Message = {
    ...dbParentMessage,
    profile: {
      id: parentProfileData?.id || dbParentMessage.profileId,
      name: parentProfileData?.name || 'Unknown User',
      imageUrl: parentProfileData?.imageUrl || ''
    },
    reactionCount: 0,
    repliesCount: 0
  };
  
  // Transform thread messages to UI component format
  const threadMessages: Message[] = await Promise.all(
    dbMessages.map(async (msg) => {
      const msgProfile = await getProfileById(msg.profileId);
      
      return {
        ...msg,
        profile: {
          id: msgProfile?.id || msg.profileId,
          name: msgProfile?.name || 'Unknown User',
          imageUrl: msgProfile?.imageUrl || ''
        },
        reactionCount: 0,
        repliesCount: 0
      };
    })
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b pb-4 mb-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mr-2"
        >
          <Link href={`/channels/${channelId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to channel
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Thread</h1>
          <p className="text-sm text-muted-foreground">
            {parentMessage.profile.name}&apos;s message in channel
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <ThreadContainer
          channelId={channelId}
          messageId={messageId}
          profileId={profile.id}
          parentMessage={parentMessage}
          initialMessages={threadMessages}
        />
      </div>
    </div>
  );
} 