import React, { useEffect, useMemo, useState } from "react";
import { InboxThread } from "../components/InboxThread";
import { MessageBubble } from "../components/MessageBubble";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { useRealtime } from "../contexts/RealtimeContext";
import { getMessages, getThreads, sendMessage, type ConversationThread, type Message } from "../services/api";

export const InboxPage: React.FC = () => {
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { events } = useRealtime();

  useEffect(() => {
    getThreads().then((data) => {
      setThreads(data);
      if (data.length > 0) {
        setActiveThreadId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeThreadId) return;
    getMessages(activeThreadId).then((data) => setMessages(data));
  }, [activeThreadId]);

  useEffect(() => {
    const latest = events[events.length - 1];
    if (latest?.type === "message") {
      // Ideally refresh targeted thread from backend; simplified here
      getThreads().then(setThreads);
      if (activeThreadId) {
        getMessages(activeThreadId).then(setMessages);
      }
    }
  }, [events, activeThreadId]);

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeThreadId) ?? null, [threads, activeThreadId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeThreadId || !newMessage.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(activeThreadId, newMessage.trim());
      setNewMessage("");
      const updated = await getMessages(activeThreadId);
      setMessages(updated);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="flex h-[calc(100vh-160px)] flex-col rounded-lg border bg-card p-3">
        <h2 className="px-2 text-lg font-semibold">Conversations</h2>
        <ScrollArea className="mt-3 flex-1">
          <div className="space-y-2">
            {threads.map((thread) => (
              <InboxThread
                key={thread.id}
                thread={thread}
                isActive={thread.id === activeThreadId}
                onSelect={() => setActiveThreadId(thread.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex h-[calc(100vh-160px)] flex-col rounded-lg border bg-card">
        {activeThread ? (
          <>
            <header className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h3 className="text-lg font-semibold">{activeThread.contactName}</h3>
                <p className="text-sm text-muted-foreground">{activeThread.channel.toUpperCase()} Channel</p>
              </div>
            </header>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isOwn={message.authorType === "user"} />
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t p-4">
              <Input value={newMessage} onChange={(event) => setNewMessage(event.target.value)} placeholder="Type a reply..." />
              <Button type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">Select a conversation</div>
        )}
      </div>
    </div>
  );
};
