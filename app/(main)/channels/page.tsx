import { getChannels } from '@/app/actions/channels';
import { CreateChannelForm } from '@/components/forms/create-channel-form';
import { ChannelList } from '@/components/channel-list';
import { Input } from '@/components/ui/input';
import { Suspense } from 'react';
import { Search } from 'lucide-react';

interface ChannelsPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function ChannelsPage({ searchParams }: ChannelsPageProps) {
  const search = searchParams.search || '';
  const { data: channels = [], error } = await getChannels(search);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Channels</h1>
        <CreateChannelForm />
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <form action="/channels">
          <Input
            type="search"
            name="search"
            placeholder="Search channels..."
            defaultValue={search}
            className="w-full pl-10"
          />
        </form>
      </div>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading channels...</div>}>
          {error ? (
            <div className="text-red-500">Failed to load channels: {error}</div>
          ) : channels.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {search ? (
                <p>No channels found matching &quot;{search}&quot;</p>
              ) : (
                <div>
                  <p className="mb-2">No channels found</p>
                  <p className="text-sm">Create a new channel to get started</p>
                </div>
              )}
            </div>
          ) : (
            <ChannelList channels={channels.map(channel => ({
              id: channel.id,
              name: channel.name,
              description: channel.description || undefined,
              createdAt: channel.createdAt,
              updatedAt: channel.updatedAt
            }))} />
          )}
        </Suspense>
      </div>
    </div>
  );
} 