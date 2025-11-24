"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
    Phone,
    Mail01,
    MessageTextSquare01,
    Calendar,
    File02,
    User01,
    MarkerPin06,
    Tag03,
    CurrencyDollar,
    Clock,
    TrendUp02,
    FileCheck02,
    Image01,
    SearchLg,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowRight,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

// Mock data types
interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    stage: "new" | "contacted" | "qualified" | "quoted" | "won" | "lost";
    tags: string[];
    source: string;
    campaign?: string;
    lifetimeValue: number;
    lastContact: Date;
    nextStep: string;
}

interface TimelineEvent {
    id: string;
    type: "message" | "call" | "status" | "note" | "task";
    timestamp: Date;
    title: string;
    description: string;
    user?: string;
}

interface Quote {
    id: string;
    title: string;
    amount: number;
    status: "draft" | "sent" | "viewed" | "accepted" | "declined";
    sentDate: Date;
}

interface Appointment {
    id: string;
    title: string;
    date: Date;
    status: "scheduled" | "completed" | "cancelled";
    technician?: string;
}

interface FileItem {
    id: string;
    name: string;
    type: "document" | "image";
    uploadDate: Date;
    url: string;
}

// Mock lead data
const mockLead: Lead = {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Austin, TX 78701",
    stage: "qualified",
    tags: ["Residential", "Pressure Washing", "High Value"],
    source: "Google Organic",
    campaign: "Spring Cleaning 2025",
    lifetimeValue: 2450,
    lastContact: new Date(2025, 10, 23, 14, 30),
    nextStep: "Send quote for deck pressure washing",
};

const mockTimeline: TimelineEvent[] = [
    {
        id: "1",
        type: "message",
        timestamp: new Date(2025, 10, 24, 10, 15),
        title: "SMS sent",
        description: "Follow-up message sent: 'Hi John, just following up on your pressure washing inquiry...'",
        user: "Sarah Johnson",
    },
    {
        id: "2",
        type: "call",
        timestamp: new Date(2025, 10, 23, 14, 30),
        title: "Phone call",
        description: "Spoke with John about deck and driveway cleaning. Interested in both services.",
        user: "Sarah Johnson",
    },
    {
        id: "3",
        type: "status",
        timestamp: new Date(2025, 10, 23, 14, 35),
        title: "Stage changed",
        description: "Moved from 'Contacted' to 'Qualified'",
        user: "Sarah Johnson",
    },
    {
        id: "4",
        type: "note",
        timestamp: new Date(2025, 10, 23, 14, 40),
        title: "Note added",
        description: "Customer mentioned they want service done before hosting a party on Dec 15th. Deck is approximately 400 sq ft.",
        user: "Sarah Johnson",
    },
];

const mockQuotes: Quote[] = [
    {
        id: "Q-001",
        title: "Deck Pressure Washing",
        amount: 380,
        status: "sent",
        sentDate: new Date(2025, 10, 23, 16, 0),
    },
    {
        id: "Q-002",
        title: "Driveway Pressure Washing",
        amount: 420,
        status: "draft",
        sentDate: new Date(2025, 10, 24, 9, 0),
    },
];

const mockAppointments: Appointment[] = [
    {
        id: "A-001",
        title: "Site visit for quote",
        date: new Date(2025, 10, 26, 10, 0),
        status: "scheduled",
        technician: "Mike Davis",
    },
];

const mockFiles: FileItem[] = [
    {
        id: "1",
        name: "deck-before.jpg",
        type: "image",
        uploadDate: new Date(2025, 10, 23, 15, 0),
        url: "#",
    },
    {
        id: "2",
        name: "property-photos.pdf",
        type: "document",
        uploadDate: new Date(2025, 10, 23, 15, 5),
        url: "#",
    },
];

const stageColors = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    qualified: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    quoted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    won: "bg-green-500/10 text-green-400 border-green-500/20",
    lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const quoteStatusColors = {
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    viewed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accepted: "bg-green-500/10 text-green-400 border-green-500/20",
    declined: "bg-red-500/10 text-red-400 border-red-500/20",
};

const timelineIcons = {
    message: MessageTextSquare01,
    call: Phone,
    status: TrendUp02,
    note: File02,
    task: CheckCircle,
};

type TabType = "overview" | "timeline" | "quotes" | "appointments" | "files" | "seo";

export default function LeadDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    const tabs: { id: TabType; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "timeline", label: "Timeline" },
        { id: "quotes", label: "Quotes" },
        { id: "appointments", label: "Appointments" },
        { id: "files", label: "Files" },
        { id: "seo", label: "SEO Insights" },
    ];

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-sky-500/10 p-3">
                                <User01 className="size-8 text-sky-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-white">{mockLead.name}</h1>
                                <p className="text-sm text-slate-400">Lead ID: {params.id}</p>
                            </div>
                            <span className={cx("rounded border px-3 py-1 text-sm capitalize", stageColors[mockLead.stage])}>
                                {mockLead.stage}
                            </span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                        <Button color="primary" size="sm" iconLeading={Phone}>
                            Call
                        </Button>
                        <Button color="tertiary" size="sm" iconLeading={MessageTextSquare01}>
                            Text
                        </Button>
                        <Button color="tertiary" size="sm" iconLeading={Mail01}>
                            Email
                        </Button>
                        <Button color="tertiary" size="sm" iconLeading={File02}>
                            Create Quote
                        </Button>
                        <Button color="tertiary" size="sm" iconLeading={Calendar}>
                            Schedule Job
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 backdrop-blur-xl">
                    <div className="border-b border-slate-700/50">
                        <div className="flex space-x-1 overflow-x-auto p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cx(
                                        "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                        activeTab === tab.id
                                            ? "bg-sky-500/20 text-sky-400"
                                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-300"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid gap-6 md:grid-cols-2"
                                >
                                    {/* Contact Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Mail01 className="size-5 text-slate-400" />
                                                <span className="text-sm text-slate-300">{mockLead.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="size-5 text-slate-400" />
                                                <span className="text-sm text-slate-300">{mockLead.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MarkerPin06 className="size-5 text-slate-400" />
                                                <span className="text-sm text-slate-300">{mockLead.address}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <h4 className="mb-2 text-sm font-semibold text-white">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {mockLead.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="flex items-center gap-1 rounded bg-sky-500/10 px-2 py-1 text-xs text-sky-400"
                                                    >
                                                        <Tag03 className="size-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <h4 className="mb-2 text-sm font-semibold text-white">Source</h4>
                                            <p className="text-sm text-slate-300">{mockLead.source}</p>
                                            {mockLead.campaign && (
                                                <p className="mt-1 text-xs text-slate-400">Campaign: {mockLead.campaign}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Key Stats */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Key Stats</h3>
                                        <div className="space-y-3">
                                            <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <CurrencyDollar className="size-5" />
                                                    <span className="text-sm">Lifetime Value</span>
                                                </div>
                                                <p className="mt-1 text-2xl font-semibold text-white">
                                                    ${mockLead.lifetimeValue.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Clock className="size-5" />
                                                    <span className="text-sm">Last Contact</span>
                                                </div>
                                                <p className="mt-1 text-sm text-white">
                                                    {format(mockLead.lastContact, "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <ArrowRight className="size-5" />
                                                    <span className="text-sm">Next Step</span>
                                                </div>
                                                <p className="mt-1 text-sm text-white">{mockLead.nextStep}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "timeline" && (
                                <motion.div
                                    key="timeline"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
                                    <div className="space-y-4">
                                        {mockTimeline.map((event, index) => {
                                            const Icon = timelineIcons[event.type];
                                            return (
                                                <div key={event.id} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="rounded-lg bg-sky-500/10 p-2">
                                                            <Icon className="size-5 text-sky-400" />
                                                        </div>
                                                        {index < mockTimeline.length - 1 && (
                                                            <div className="h-full w-px bg-slate-700/50" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-6">
                                                        <div className="mb-1 flex items-center justify-between">
                                                            <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                                                            <span className="text-xs text-slate-500">
                                                                {format(event.timestamp, "MMM d, h:mm a")}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-300">{event.description}</p>
                                                        {event.user && (
                                                            <p className="mt-1 text-xs text-slate-500">by {event.user}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "quotes" && (
                                <motion.div
                                    key="quotes"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Quotes</h3>
                                        <Button color="primary" size="sm" iconLeading={File02}>
                                            New Quote
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {mockQuotes.map((quote) => (
                                            <div
                                                key={quote.id}
                                                className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 p-4"
                                            >
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white">{quote.title}</h4>
                                                    <p className="text-xs text-slate-400">
                                                        {quote.id} • Sent {format(quote.sentDate, "MMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-semibold text-white">
                                                        ${quote.amount.toLocaleString()}
                                                    </span>
                                                    <span
                                                        className={cx(
                                                            "rounded border px-2 py-1 text-xs capitalize",
                                                            quoteStatusColors[quote.status]
                                                        )}
                                                    >
                                                        {quote.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "appointments" && (
                                <motion.div
                                    key="appointments"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Appointments</h3>
                                        <Button color="primary" size="sm" iconLeading={Calendar}>
                                            Schedule Appointment
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {mockAppointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 p-4"
                                            >
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white">{appointment.title}</h4>
                                                    <p className="text-xs text-slate-400">
                                                        {format(appointment.date, "MMM d, yyyy 'at' h:mm a")}
                                                    </p>
                                                    {appointment.technician && (
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Tech: {appointment.technician}
                                                        </p>
                                                    )}
                                                </div>
                                                <span
                                                    className={cx(
                                                        "rounded border px-2 py-1 text-xs capitalize",
                                                        appointment.status === "scheduled"
                                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                            : appointment.status === "completed"
                                                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                              : "bg-red-500/10 text-red-400 border-red-500/20"
                                                    )}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "files" && (
                                <motion.div
                                    key="files"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Files & Documents</h3>
                                        <Button color="primary" size="sm" iconLeading={FileCheck02}>
                                            Upload File
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {mockFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex flex-col gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 p-4"
                                            >
                                                <div className="rounded bg-sky-500/10 p-3">
                                                    {file.type === "image" ? (
                                                        <Image01 className="size-8 text-sky-400" />
                                                    ) : (
                                                        <File02 className="size-8 text-sky-400" />
                                                    )}
                                                </div>
                                                <h4 className="text-sm font-semibold text-white">{file.name}</h4>
                                                <p className="text-xs text-slate-400">
                                                    {format(file.uploadDate, "MMM d, yyyy")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "seo" && (
                                <motion.div
                                    key="seo"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-semibold text-white">SEO Insights</h3>

                                    {/* Audit Issues Summary */}
                                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
                                        <h4 className="mb-3 text-sm font-semibold text-white">Audit Issues</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="size-5 text-red-400" />
                                                <div>
                                                    <p className="text-2xl font-semibold text-white">2</p>
                                                    <p className="text-xs text-slate-400">Critical</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="size-5 text-yellow-400" />
                                                <div>
                                                    <p className="text-2xl font-semibold text-white">5</p>
                                                    <p className="text-xs text-slate-400">Warning</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="size-5 text-green-400" />
                                                <div>
                                                    <p className="text-2xl font-semibold text-white">23</p>
                                                    <p className="text-xs text-slate-400">Passed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
                                        <h4 className="mb-3 text-sm font-semibold text-white">Top Keywords</h4>
                                        <div className="space-y-2">
                                            {[
                                                { keyword: "pressure washing austin", rank: 3, change: "+2" },
                                                { keyword: "deck cleaning service", rank: 7, change: "+1" },
                                                { keyword: "driveway pressure washing", rank: 12, change: "0" },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-300">{item.keyword}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-white">#{item.rank}</span>
                                                        <span
                                                            className={cx(
                                                                "text-xs",
                                                                item.change.startsWith("+")
                                                                    ? "text-green-400"
                                                                    : item.change === "0"
                                                                      ? "text-slate-400"
                                                                      : "text-red-400"
                                                            )}
                                                        >
                                                            {item.change}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button color="primary" size="sm" iconLeading={SearchLg}>
                                            Run Competitor Analysis
                                        </Button>
                                        <Button color="tertiary" size="sm">
                                            View in SEO Health
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
