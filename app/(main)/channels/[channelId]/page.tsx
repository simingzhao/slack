import { getChannelById } from '@/app/actions/channels';
import { getChannelMessages } from '@/app/actions/messages';
import { MessageContainer } from '@/components/message-container';
import { getActiveProfile, getProfileById } from '@/lib/server-profile';
import { notFound } from 'next/navigation';
import { Message } from '@/components/message-item';

interface ChannelPageProps {
  params: {
    channelId: string;
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = params;
  
  // Get the active profile
  const profile = await getActiveProfile();
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Profile Selected</h2>
          <p className="text-muted-foreground">
            Please select a profile to view this channel
          </p>
        </div>
      </div>
    );
  }

  // Get the channel
  const { data: channel, error: channelError } = await getChannelById(channelId);
  
  if (channelError || !channel) {
    notFound();
  }

  // Get the messages for this channel
  const { data: dbMessages = [], error: messagesError } = await getChannelMessages(channelId);
  
  // Transform database messages to UI component format
  const messages: Message[] = await Promise.all(
    dbMessages.map(async (msg) => {
      // For each message, ensure we have the profile data
      // The type system may not recognize that profile is included in the query
      const msgProfile = await getProfileById(msg.profileId);
      
      return {
        id: msg.id,
        content: msg.content,
        channelId: msg.channelId,
        profileId: msg.profileId,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isEdited: msg.isEdited,
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
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            #{channel.name}
          </h1>
          {channel.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      {messagesError ? (
        <div className="text-red-500 p-4">
          Error loading messages: {messagesError}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <MessageContainer
            channelId={channelId}
            profileId={profile.id}
            initialMessages={messages}
          />
        </div>
      )}
    </div>
  );
} 