import React from "react";
import { format } from "date-fns";
import type { Message } from "../services/api";
import { cn } from "../lib/utils";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}> 
      <div className={cn("max-w-xl rounded-lg px-4 py-2 text-sm", isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}> 
        <p className="font-semibold">{message.authorName}</p>
        <p className="mt-1 whitespace-pre-line">{message.body}</p>
      </div>
      <span className="mt-1 text-xs text-muted-foreground">{format(new Date(message.createdAt), "MMM d, p")}</span>
    </div>
  );
};
