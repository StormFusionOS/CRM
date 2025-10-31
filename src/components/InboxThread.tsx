import React from "react";
import { formatDistanceToNow } from "date-fns";
import type { ConversationThread } from "../services/api";
import { cn } from "../lib/utils";

interface InboxThreadProps {
  thread: ConversationThread;
  isActive: boolean;
  onSelect: () => void;
}

export const InboxThread: React.FC<InboxThreadProps> = ({ thread, isActive, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col rounded-lg border p-3 text-left transition hover:border-primary",
        isActive ? "border-primary bg-primary/10" : "border-transparent bg-card"
      )}
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>{thread.contactName}</span>
        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{thread.lastMessage}</p>
    </button>
  );
};
