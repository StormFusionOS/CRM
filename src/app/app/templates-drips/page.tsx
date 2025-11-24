"use client";

import { useState } from "react";
import {
    MessageTextSquare01,
    Mail01,
    Plus,
    Copy01,
    Archive,
    Edit05,
    Zap,
    FolderClosed,
    Clock,
    PlayCircle,
    PauseCircle,
    Settings01,
    ChevronRight,
    BarChart03,
    Users01,
    Send01,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { formatDistanceToNow } from "date-fns";

type Tab = "templates" | "campaigns";
type TemplateChannel = "sms" | "email";
type TemplateCategory = "reminders" | "reviews" | "promotions" | "seo-wins";
type CampaignStatus = "active" | "paused" | "draft";

interface Template {
    id: number;
    name: string;
    channel: TemplateChannel;
    category: TemplateCategory;
    lastUpdated: Date;
    usedInCampaigns: number;
    content: string;
}

interface Campaign {
    id: number;
    name: string;
    status: CampaignStatus;
    trigger: string;
    steps: number;
    sent: number;
    opened: number;
    clicked: number;
    lastRun: Date;
}

// Mock data
const mockTemplates: Template[] = [
    {
        id: 1,
        name: "Appointment Reminder - 24hrs",
        channel: "sms",
        category: "reminders",
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        usedInCampaigns: 3,
        content: "Hi {{customer_name}}, this is a reminder about your {{service_type}} appointment tomorrow at {{appointment_time}}. Reply YES to confirm.",
    },
    {
        id: 2,
        name: "Review Request - Post Service",
        channel: "email",
        category: "reviews",
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        usedInCampaigns: 2,
        content: "Thank you for choosing us! We'd love to hear about your experience...",
    },
    {
        id: 3,
        name: "Spring Promotion - Discount",
        channel: "email",
        category: "promotions",
        lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        usedInCampaigns: 1,
        content: "Spring is here! Get 20% off your next service with code SPRING20...",
    },
    {
        id: 4,
        name: "SEO Win Announcement",
        channel: "email",
        category: "seo-wins",
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        usedInCampaigns: 0,
        content: "Great news! Your website rankings improved: {{seo_win_summary}}",
    },
];

const mockCampaigns: Campaign[] = [
    {
        id: 1,
        name: "Appointment Reminder Sequence",
        status: "active",
        trigger: "24 hours before appointment",
        steps: 3,
        sent: 1234,
        opened: 980,
        clicked: 450,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: 2,
        name: "New Lead Nurture",
        status: "active",
        trigger: "Lead created",
        steps: 5,
        sent: 456,
        opened: 320,
        clicked: 125,
        lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: 3,
        name: "Post-Service Follow Up",
        status: "paused",
        trigger: "Job completed",
        steps: 4,
        sent: 789,
        opened: 601,
        clicked: 203,
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
];

const categories: { id: TemplateCategory; label: string; count: number }[] = [
    { id: "reminders", label: "Reminders", count: 8 },
    { id: "reviews", label: "Reviews", count: 5 },
    { id: "promotions", label: "Promotions", count: 12 },
    { id: "seo-wins", label: "SEO Wins", count: 3 },
];

const variables = [
    "{{customer_name}}",
    "{{appointment_time}}",
    "{{service_type}}",
    "{{quote_total}}",
    "{{seo_win_summary}}",
    "{{company_name}}",
    "{{technician_name}}",
];

export default function TemplatesDripsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("templates");
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const filteredTemplates =
        selectedCategory === "all"
            ? mockTemplates
            : mockTemplates.filter((t) => t.category === selectedCategory);

    const getChannelIcon = (channel: TemplateChannel) => {
        return channel === "sms" ? MessageTextSquare01 : Mail01;
    };

    const getStatusColor = (status: CampaignStatus) => {
        switch (status) {
            case "active":
                return "text-green-400 bg-green-500/10 border-green-500/20";
            case "paused":
                return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "draft":
                return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    };

    const getStatusIcon = (status: CampaignStatus) => {
        switch (status) {
            case "active":
                return PlayCircle;
            case "paused":
                return PauseCircle;
            case "draft":
                return Edit05;
        }
    };

    return (
        <AppLayout
            title="Templates & Drip Campaigns"
            description="Manage message templates and automated campaign sequences"
            actions={
                <div className="flex items-center gap-3">
                    {activeTab === "templates" && (
                        <Button color="primary" size="sm" iconLeading={Plus}>
                            New Template
                        </Button>
                    )}
                    {activeTab === "campaigns" && (
                        <Button color="primary" size="sm" iconLeading={Plus}>
                            New Campaign
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab("templates")}
                        className={cx(
                            "relative px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === "templates"
                                ? "text-white"
                                : "text-slate-400 hover:text-slate-300"
                        )}
                    >
                        Templates
                        {activeTab === "templates" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("campaigns")}
                        className={cx(
                            "relative px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === "campaigns"
                                ? "text-white"
                                : "text-slate-400 hover:text-slate-300"
                        )}
                    >
                        Campaigns
                        {activeTab === "campaigns" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
                        )}
                    </button>
                </div>

                {/* Templates Tab */}
                {activeTab === "templates" && (
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Left Sidebar - Category Tree */}
                        <div className="lg:col-span-3">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-4 backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-white">Categories</h3>
                                    <FolderClosed className="size-4 text-slate-400" />
                                </div>
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory("all")}
                                        className={cx(
                                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                                            selectedCategory === "all"
                                                ? "bg-sky-500/10 text-sky-400"
                                                : "text-slate-300 hover:bg-slate-800/50"
                                        )}
                                    >
                                        <span>All Templates</span>
                                        <span className="text-xs text-slate-500">
                                            {mockTemplates.length}
                                        </span>
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={cx(
                                                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                                                selectedCategory === category.id
                                                    ? "bg-sky-500/10 text-sky-400"
                                                    : "text-slate-300 hover:bg-slate-800/50"
                                            )}
                                        >
                                            <span>{category.label}</span>
                                            <span className="text-xs text-slate-500">
                                                {category.count}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Right Content - Templates List & Editor */}
                        <div className="lg:col-span-9">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Templates List */}
                                <div className="space-y-3">
                                    {filteredTemplates.map((template) => {
                                        const ChannelIcon = getChannelIcon(template.channel);
                                        return (
                                            <div
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template)}
                                                className={cx(
                                                    "cursor-pointer rounded-lg border p-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-sky-900/20",
                                                    selectedTemplate?.id === template.id
                                                        ? "border-sky-500/50 bg-sky-500/10"
                                                        : "border-slate-800/50 bg-slate-900/40 hover:border-slate-700"
                                                )}
                                            >
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-800/50">
                                                            <ChannelIcon className="size-5 text-slate-300" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">
                                                                {template.name}
                                                            </h4>
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {template.channel.toUpperCase()} •{" "}
                                                                {template.category}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <span>
                                                        Updated{" "}
                                                        {formatDistanceToNow(template.lastUpdated, {
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                    <span>{template.usedInCampaigns} campaigns</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Template Editor/Preview */}
                                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                    {selectedTemplate ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {selectedTemplate.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-400">
                                                        {selectedTemplate.channel.toUpperCase()} Template
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        color="tertiary"
                                                        size="sm"
                                                        iconLeading={Edit05}
                                                        onClick={() => setIsEditing(!isEditing)}
                                                    >
                                                        {isEditing ? "Preview" : "Edit"}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Variables Picker */}
                                            <div>
                                                <label className="mb-2 block text-xs font-medium text-slate-300">
                                                    Variables
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {variables.map((variable) => (
                                                        <button
                                                            key={variable}
                                                            className="rounded bg-slate-800/50 px-2 py-1 font-mono text-xs text-sky-400 transition-colors hover:bg-slate-800"
                                                            title={`Insert ${variable}`}
                                                        >
                                                            {variable}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Content Editor/Preview */}
                                            <div>
                                                <label className="mb-2 block text-xs font-medium text-slate-300">
                                                    Content
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 font-mono text-sm text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                                        rows={8}
                                                        defaultValue={selectedTemplate.content}
                                                    />
                                                ) : (
                                                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                                        <p className="whitespace-pre-wrap font-mono text-sm text-slate-300">
                                                            {selectedTemplate.content}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* AI Generation Button */}
                                            <Button
                                                color="secondary"
                                                size="sm"
                                                iconLeading={Zap}
                                                className="w-full"
                                            >
                                                Generate with AI
                                            </Button>

                                            {/* Actions */}
                                            <div className="flex gap-2 border-t border-slate-800 pt-4">
                                                <Button color="tertiary" size="sm" iconLeading={Copy01}>
                                                    Clone
                                                </Button>
                                                <Button color="tertiary" size="sm" iconLeading={Archive}>
                                                    Archive
                                                </Button>
                                                {isEditing && (
                                                    <Button color="primary" size="sm" className="ml-auto">
                                                        Save Changes
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                                            <MessageTextSquare01 className="mb-4 size-12 text-slate-600" />
                                            <h3 className="mb-2 text-lg font-semibold text-white">
                                                No Template Selected
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                Select a template from the list to view and edit
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Campaigns Tab */}
                {activeTab === "campaigns" && (
                    <div className="space-y-4">
                        {mockCampaigns.map((campaign) => {
                            const StatusIcon = getStatusIcon(campaign.status);
                            return (
                                <div
                                    key={campaign.id}
                                    className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-sky-900/20"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex size-12 items-center justify-center rounded-lg bg-sky-500/10">
                                                <Send01 className="size-6 text-sky-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {campaign.name}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-3 text-sm">
                                                    <span className="flex items-center gap-1 text-slate-400">
                                                        <Clock className="size-3" />
                                                        {campaign.trigger}
                                                    </span>
                                                    <span className="text-slate-600">•</span>
                                                    <span className="text-slate-400">
                                                        {campaign.steps} steps
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cx(
                                                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                                                    getStatusColor(campaign.status)
                                                )}
                                            >
                                                <StatusIcon className="size-3" />
                                                {campaign.status.charAt(0).toUpperCase() +
                                                    campaign.status.slice(1)}
                                            </div>
                                            <Button color="tertiary" size="sm" iconLeading={Settings01}>
                                                Edit
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-4 gap-4 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Send01 className="size-3" />
                                                Sent
                                            </div>
                                            <div className="mt-1 text-xl font-semibold text-white">
                                                {campaign.sent.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Mail01 className="size-3" />
                                                Opened
                                            </div>
                                            <div className="mt-1 text-xl font-semibold text-white">
                                                {campaign.opened.toLocaleString()}
                                                <span className="ml-2 text-sm text-slate-400">
                                                    {Math.round((campaign.opened / campaign.sent) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <BarChart03 className="size-3" />
                                                Clicked
                                            </div>
                                            <div className="mt-1 text-xl font-semibold text-white">
                                                {campaign.clicked.toLocaleString()}
                                                <span className="ml-2 text-sm text-slate-400">
                                                    {Math.round((campaign.clicked / campaign.sent) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Clock className="size-3" />
                                                Last Run
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-slate-300">
                                                {formatDistanceToNow(campaign.lastRun, {
                                                    addSuffix: true,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
