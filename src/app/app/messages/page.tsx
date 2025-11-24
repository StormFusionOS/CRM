"use client";

import { useState } from "react";
import {
    MessageChatSquare,
    Mail01,
    MessageTextSquare01,
    Send01,
    Paperclip,
    Stars01,
    FilterLines,
    SearchSm,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { format } from "date-fns";

// Mock data
interface Message {
    id: string;
    content: string;
    sender: "customer" | "agent" | "system";
    timestamp: Date;
    channel: "sms" | "email";
}

interface Conversation {
    id: string;
    contactName: string;
    contactPhone?: string;
    contactEmail?: string;
    lastMessage: string;
    timestamp: Date;
    channel: "sms" | "email" | "social";
    unread: boolean;
    linkedTo?: { type: "lead" | "job"; id: string };
    messages: Message[];
}

const mockConversations: Conversation[] = [
    {
        id: "1",
        contactName: "John Smith",
        contactPhone: "(555) 123-4567",
        lastMessage: "Yes, that works for me. See you tomorrow!",
        timestamp: new Date(2025, 10, 24, 14, 30),
        channel: "sms",
        unread: true,
        linkedTo: { type: "lead", id: "L-123" },
        messages: [
            {
                id: "m1",
                content: "Hi, I'm interested in pressure washing service",
                sender: "customer",
                timestamp: new Date(2025, 10, 24, 10, 0),
                channel: "sms",
            },
            {
                id: "m2",
                content: "Great! We'd be happy to help. Can we schedule you for tomorrow at 9 AM?",
                sender: "agent",
                timestamp: new Date(2025, 10, 24, 10, 5),
                channel: "sms",
            },
            {
                id: "m3",
                content: "Yes, that works for me. See you tomorrow!",
                sender: "customer",
                timestamp: new Date(2025, 10, 24, 14, 30),
                channel: "sms",
            },
        ],
    },
    {
        id: "2",
        contactName: "Sarah Johnson",
        contactEmail: "sarah.j@example.com",
        lastMessage: "Thank you for the quote. I'll review and get back to you.",
        timestamp: new Date(2025, 10, 24, 11, 15),
        channel: "email",
        unread: false,
        linkedTo: { type: "job", id: "J-456" },
        messages: [
            {
                id: "m4",
                content: "I received your quote for window cleaning. Could you explain the pricing breakdown?",
                sender: "customer",
                timestamp: new Date(2025, 10, 24, 9, 0),
                channel: "email",
            },
            {
                id: "m5",
                content: "Of course! The quote includes:\n- Window cleaning (exterior): $120\n- Screen cleaning: $40\n- Track cleaning: $30\n\nTotal: $190",
                sender: "agent",
                timestamp: new Date(2025, 10, 24, 10, 30),
                channel: "email",
            },
            {
                id: "m6",
                content: "Thank you for the quote. I'll review and get back to you.",
                sender: "customer",
                timestamp: new Date(2025, 10, 24, 11, 15),
                channel: "email",
            },
        ],
    },
    {
        id: "3",
        contactName: "Mike Davis",
        contactPhone: "(555) 987-6543",
        lastMessage: "Can you come earlier? I have another appointment at 3 PM",
        timestamp: new Date(2025, 10, 23, 16, 45),
        channel: "sms",
        unread: true,
        messages: [
            {
                id: "m7",
                content: "Can you come earlier? I have another appointment at 3 PM",
                sender: "customer",
                timestamp: new Date(2025, 10, 23, 16, 45),
                channel: "sms",
            },
        ],
    },
];

const channelIcons = {
    sms: MessageTextSquare01,
    email: Mail01,
    social: MessageChatSquare,
};

const channelColors = {
    sms: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    email: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    social: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
    const [messageText, setMessageText] = useState("");

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedConversation) return;

        console.log("Sending message:", messageText);
        // TODO: Send message via API
        setMessageText("");
    };

    return (
        <AppLayout>
            <div className="flex h-[calc(100vh-7rem)] gap-4">
                {/* Sidebar - Folders & Filters */}
                <div className="hidden w-64 flex-col gap-4 lg:flex">
                    <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                        <h2 className="mb-4 text-sm font-semibold text-white">Folders</h2>
                        <div className="space-y-1">
                            {[
                                { label: "All Messages", count: 3 },
                                { label: "Unread", count: 2 },
                                { label: "Needs Reply", count: 1 },
                            ].map((folder) => (
                                <button
                                    key={folder.label}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800/60"
                                >
                                    <span>{folder.label}</span>
                                    <span className="text-xs text-slate-500">{folder.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                        <h2 className="mb-4 text-sm font-semibold text-white">Channels</h2>
                        <div className="space-y-1">
                            {[
                                { label: "SMS", icon: MessageTextSquare01, count: 2 },
                                { label: "Email", icon: Mail01, count: 1 },
                            ].map((channel) => {
                                const Icon = channel.icon;
                                return (
                                    <button
                                        key={channel.label}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800/60"
                                    >
                                        <Icon className="size-4" />
                                        <span className="flex-1 text-left">{channel.label}</span>
                                        <span className="text-xs text-slate-500">{channel.count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex w-full flex-col lg:w-96">
                    <div className="mb-4">
                        <Input
                            type="search"
                            placeholder="Search conversations..."
                            icon={SearchSm}
                            size="sm"
                        />
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto rounded-xl border border-sky-500/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                        {mockConversations.map((conversation) => {
                            const ChannelIcon = channelIcons[conversation.channel];
                            const isSelected = selectedConversation?.id === conversation.id;

                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => setSelectedConversation(conversation)}
                                    className={cx(
                                        "flex w-full flex-col gap-2 rounded-lg border p-4 text-left transition-all",
                                        isSelected
                                            ? "border-sky-500/30 bg-sky-500/10"
                                            : "border-slate-700/50 bg-slate-800/40 hover:border-sky-500/20",
                                        conversation.unread && "font-semibold",
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-white">{conversation.contactName}</span>
                                            {conversation.unread && (
                                                <div className="size-2 rounded-full bg-sky-400" />
                                            )}
                                        </div>
                                        <div className={cx("rounded border px-1.5 py-0.5", channelColors[conversation.channel])}>
                                            <ChannelIcon className="size-3" />
                                        </div>
                                    </div>

                                    {conversation.linkedTo && (
                                        <div className="flex gap-2">
                                            <span className="rounded bg-sky-500/10 px-2 py-0.5 text-xs text-sky-400">
                                                {conversation.linkedTo.type.toUpperCase()} #{conversation.linkedTo.id}
                                            </span>
                                        </div>
                                    )}

                                    <p className="line-clamp-2 text-xs text-slate-400">{conversation.lastMessage}</p>

                                    <span className="text-xs text-slate-500">
                                        {format(conversation.timestamp, "MMM d, h:mm a")}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Thread View */}
                {selectedConversation && (
                    <div className="hidden flex-1 flex-col lg:flex">
                        {/* Thread Header */}
                        <div className="mb-4 flex items-center justify-between rounded-xl border border-sky-500/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                            <div>
                                <h2 className="text-lg font-semibold text-white">{selectedConversation.contactName}</h2>
                                <p className="text-sm text-slate-400">
                                    {selectedConversation.contactPhone || selectedConversation.contactEmail}
                                </p>
                            </div>
                            <Button color="tertiary" size="sm" iconLeading={FilterLines}>
                                Actions
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                            {selectedConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cx(
                                        "flex",
                                        message.sender === "agent" ? "justify-end" : "justify-start",
                                    )}
                                >
                                    <div
                                        className={cx(
                                            "max-w-[70%] rounded-lg p-4",
                                            message.sender === "agent"
                                                ? "bg-sky-500/20 text-white"
                                                : "bg-slate-800/60 text-slate-200",
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            {format(message.timestamp, "h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Composer */}
                        <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                            <div className="mb-3 flex gap-2">
                                <Button color="tertiary" size="sm">
                                    Templates
                                </Button>
                                <Button color="tertiary" size="sm" iconLeading={Stars01}>
                                    AI Draft
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    rows={3}
                                />
                                <div className="flex flex-col gap-2">
                                    <Button
                                        color="tertiary"
                                        size="sm"
                                        iconLeading={Paperclip}
                                        aria-label="Attach file"
                                    />
                                    <Button
                                        color="primary"
                                        size="sm"
                                        iconLeading={Send01}
                                        onClick={handleSendMessage}
                                        isDisabled={!messageText.trim()}
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
