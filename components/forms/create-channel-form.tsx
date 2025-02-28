'use client';

import { useState } from 'react';
import { createChannel } from '@/app/actions/channels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function CreateChannelForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Channel name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createChannel(name, description, type);
      
      if (result.success) {
        toast.success('Channel created!');
        // Reset form and close dialog
        setName('');
        setDescription('');
        setType('public');
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to create channel');
      }
    } catch (error) {
      toast.error('An error occurred creating the channel');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          New Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to start a conversation with your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Channel Name
            </label>
            <Input
              id="name"
              placeholder="e.g. marketing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <Textarea
              id="description"
              placeholder="What's this channel about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="resize-none"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Privacy
            </label>
            <Select 
              value={type} 
              onValueChange={(value: string) => setType(value as 'public' | 'private')}
              disabled={isSubmitting}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select channel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can join</SelectItem>
                <SelectItem value="private">Private - By invitation only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 