"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, SmilePlus, Paperclip } from "lucide-react";

interface MessageInputProps {
  channelId?: string;
  profileId: string;
  threadId?: string;
  onSend: (content: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  initialContent?: string;
  autoFocus?: boolean;
}

export function MessageInput({
  // We're keeping these props for future implementation even though they're not used yet
  // channelId,
  // profileId,
  // threadId,
  onSend,
  isDisabled,
  placeholder = "Type a message...",
  isLoading,
  initialContent = "",
  autoFocus = false,
}: MessageInputProps) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on the textarea when the component mounts
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!content.trim() || isDisabled || isLoading) return;
    
    onSend(content);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter key (without Shift key)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!content.trim() || isDisabled || isLoading) return;
      
      onSend(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="relative flex items-center">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled || isLoading}
          className="min-h-10 max-h-40 py-3 pr-12 resize-none overflow-y-auto"
          rows={1}
        />
        <div className="absolute right-2 flex items-center gap-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDisabled || isLoading}
            className="h-8 w-8 opacity-75 hover:opacity-100 transition"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDisabled || isLoading}
            className="h-8 w-8 opacity-75 hover:opacity-100 transition"
          >
            <SmilePlus className="h-5 w-5" />
            <span className="sr-only">Add emoji</span>
          </Button>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!content.trim() || isDisabled || isLoading}
            className="h-8 w-8 opacity-75 hover:opacity-100 transition"
          >
            <SendHorizontal className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
} 