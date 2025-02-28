"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { addReaction } from "@/app/actions/reactions";
import { toast } from "sonner";

// Define common emojis used in the app
export const COMMON_EMOJIS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🎉", label: "Party" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "🎊", label: "Tada" },
  { emoji: "⭐", label: "Star" },
];

interface ReactionPickerProps {
  messageId: string;
  onSelect?: (emoji: string) => void;
}

export function ReactionPicker({ messageId, onSelect }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectEmoji = async (emoji: string) => {
    setIsLoading(true);
    
    try {
      const response = await addReaction(messageId, emoji);
      
      if (response.success) {
        onSelect?.(emoji);
        setIsOpen(false);
      } else {
        toast.error(response.error || "Failed to add reaction");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ThumbsUp className="h-4 w-4" />
          <span className="sr-only">Add reaction</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex gap-1">
          {COMMON_EMOJIS.map(({ emoji, label }) => (
            <Button
              key={emoji}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleSelectEmoji(emoji)}
              disabled={isLoading}
            >
              <span className="text-lg">{emoji}</span>
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
} 