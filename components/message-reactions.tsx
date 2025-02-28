"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMessageReactions, removeReaction } from "@/app/actions/reactions";
import { toast } from "sonner";

interface MessageReactionsProps {
  messageId: string;
  currentProfileId: string;
  onReactionUpdated?: () => void;
}

type ReactionGroup = {
  emoji: string;
  count: number;
  reactedByCurrentUser: boolean;
  profileIds: string[];
};

export function MessageReactions({
  messageId,
  currentProfileId,
  onReactionUpdated,
}: MessageReactionsProps) {
  const [reactionGroups, setReactionGroups] = useState<ReactionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reactions when the component mounts
  useEffect(() => {
    const loadReactions = async () => {
      setIsLoading(true);
      try {
        const response = await getMessageReactions(messageId);
        
        if (response.success && response.data) {
          // Group reactions by emoji
          const groups: Record<string, ReactionGroup> = {};
          
          response.data.forEach(reaction => {
            const emoji = reaction.emoji;
            if (!groups[emoji]) {
              groups[emoji] = {
                emoji,
                count: 0,
                reactedByCurrentUser: false,
                profileIds: [],
              };
            }
            
            groups[emoji].count += 1;
            groups[emoji].profileIds.push(reaction.profileId);
            
            if (reaction.profileId === currentProfileId) {
              groups[emoji].reactedByCurrentUser = true;
            }
          });
          
          setReactionGroups(Object.values(groups));
        }
      } catch (error) {
        console.error('Error loading reactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReactions();
  }, [messageId, currentProfileId]);

  const handleToggleReaction = async (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      try {
        const response = await removeReaction(messageId, emoji);
        
        if (response.success) {
          // Update local state
          setReactionGroups(prev => 
            prev.map(group => {
              if (group.emoji === emoji) {
                return {
                  ...group,
                  count: group.count - 1,
                  reactedByCurrentUser: false,
                  profileIds: group.profileIds.filter(id => id !== currentProfileId),
                };
              }
              return group;
            }).filter(group => group.count > 0) // Remove groups with 0 count
          );
          
          onReactionUpdated?.();
        } else {
          toast.error(response.error || "Failed to remove reaction");
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return <div className="h-6"></div>; // Empty placeholder while loading
  }

  if (reactionGroups.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactionGroups.map(({ emoji, count, reactedByCurrentUser }) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-2 text-xs rounded-full",
            reactedByCurrentUser && "bg-primary/10"
          )}
          onClick={() => handleToggleReaction(emoji, reactedByCurrentUser)}
        >
          <span className="mr-1">{emoji}</span>
          <span>{count}</span>
        </Button>
      ))}
    </div>
  );
} 