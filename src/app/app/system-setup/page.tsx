"use client";

import {
    Server01,
    Database01,
    Cube01,
    HardDrive,
    Code01,
    Settings01,
    Clock,
    Mail01,
    MessageTextSquare01,
    CloudBlank01,
    AlertCircle,
    ArrowRight,
    Package,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import Link from "next/link";

interface SystemCategory {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    items: {
        label: string;
        value: string;
        tooltip?: string;
    }[];
    settingsLink?: string;
}

const systemCategories: SystemCategory[] = [
    {
        id: "hardware",
        title: "Hardware Requirements",
        description: "Server resources allocated for this instance",
        icon: Cube01,
        items: [
            { label: "CPU Cores", value: "4 vCPUs", tooltip: "Recommended minimum for production" },
            { label: "RAM", value: "8 GB", tooltip: "Sufficient for medium-sized workload" },
            { label: "Storage", value: "100 GB SSD", tooltip: "Primary storage tier" },
            { label: "Backup Storage", value: "500 GB", tooltip: "S3-compatible object storage" },
        ],
    },
    {
        id: "software",
        title: "Software Stack",
        description: "Core technologies and services",
        icon: Package,
        items: [
            { label: "Operating System", value: "Ubuntu 22.04 LTS" },
            { label: "Database", value: "PostgreSQL 15" },
            { label: "Cache", value: "Redis 7.x" },
            { label: "WordPress", value: "6.4+ (headless)" },
            { label: "Node.js", value: "20.x LTS" },
            { label: "AI/LLM Service", value: "OpenAI API" },
        ],
        settingsLink: "/app/settings?section=integrations",
    },
    {
        id: "database",
        title: "Database Configuration",
        description: "Primary and replica connections",
        icon: Database01,
        items: [
            { label: "Primary Host", value: "prod-db-01.internal" },
            { label: "Port", value: "5432" },
            { label: "Database Name", value: "home_service_saas" },
            { label: "Read Replicas", value: "2 replicas enabled" },
            { label: "Connection Pool", value: "Max 50 connections" },
        ],
        settingsLink: "/app/settings?section=database",
    },
    {
        id: "integrations",
        title: "SEO & Marketing Integrations",
        description: "External service configurations",
        icon: Code01,
        items: [
            { label: "WordPress REST API", value: "Configured" },
            { label: "IndexNow", value: "Enabled" },
            { label: "Google Search Console", value: "Connected" },
            { label: "Facebook Lead Ads", value: "Enabled" },
            { label: "Google Ads", value: "Configured" },
        ],
        settingsLink: "/app/settings?section=integrations",
    },
    {
        id: "communications",
        title: "Email & SMS Services",
        description: "Communication channel settings",
        icon: MessageTextSquare01,
        items: [
            { label: "Twilio (SMS/Voice)", value: "Active" },
            { label: "Amazon SES (Email)", value: "Configured" },
            { label: "Outbound Rate Limit", value: "100 msg/min" },
            { label: "Webhook Endpoints", value: "3 configured" },
        ],
        settingsLink: "/app/settings?section=integrations",
    },
    {
        id: "backups",
        title: "Backup & Recovery",
        description: "Data protection policies",
        icon: CloudBlank01,
        items: [
            { label: "Backup Schedule", value: "Daily at 2:00 AM UTC" },
            { label: "Retention Policy", value: "30 days" },
            { label: "Storage Location", value: "S3 us-east-1" },
            { label: "Last Backup", value: "3 hours ago" },
            { label: "Backup Size", value: "4.2 GB compressed" },
        ],
    },
    {
        id: "schedules",
        title: "Cron Jobs & Scheduled Tasks",
        description: "Automated background processes",
        icon: Clock,
        items: [
            { label: "SEO Audit Crawler", value: "Every 6 hours" },
            { label: "Citation Monitor", value: "Daily at 3:00 AM" },
            { label: "Backlink Checker", value: "Weekly (Sundays)" },
            { label: "Database Cleanup", value: "Daily at 4:00 AM" },
            { label: "Analytics Sync", value: "Hourly" },
            { label: "Email Queue Processor", value: "Every 5 minutes" },
        ],
    },
];

export default function SystemSetupPage() {
    return (
        <AppLayout
            title="System Setup & Infrastructure"
            description="Overview of environment configuration and system requirements"
        >
            <div className="space-y-6">
                {/* Info Banner */}
                <div className="flex items-start gap-3 rounded-lg border border-sky-500/20 bg-sky-500/10 p-4 backdrop-blur-xl">
                    <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-sky-400" />
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-white">
                            Informational Overview
                        </h3>
                        <p className="text-sm text-slate-300">
                            This page provides a read-only summary of your system configuration. To modify
                            settings, use the <strong>"Manage in Settings"</strong> links below to navigate to
                            the appropriate configuration section.
                        </p>
                    </div>
                </div>

                {/* System Category Cards */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {systemCategories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <div
                                key={category.id}
                                className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl"
                            >
                                {/* Card Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10">
                                            <Icon className="size-5 text-sky-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                                            <p className="mt-1 text-sm text-slate-400">{category.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Items */}
                                <div className="space-y-3">
                                    {category.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-200">
                                                        {item.label}
                                                    </span>
                                                    {item.tooltip && (
                                                        <div
                                                            className="group relative"
                                                            title={item.tooltip}
                                                        >
                                                            <AlertCircle className="size-3 text-slate-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-mono text-sm text-slate-400">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Manage in Settings Link */}
                                {category.settingsLink && (
                                    <div className="mt-4 border-t border-slate-800 pt-4">
                                        <Link
                                            href={category.settingsLink}
                                            className="flex items-center gap-2 text-sm text-sky-400 transition-colors hover:text-sky-300"
                                        >
                                            <Settings01 className="size-4" />
                                            <span>Manage in Settings</span>
                                            <ArrowRight className="size-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Environment Variables Info Card */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Server01 className="size-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Environment Variables</h3>
                            <p className="mt-1 text-sm text-slate-400">
                                Sensitive configuration values are stored securely and not displayed here
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[
                            "DATABASE_URL (masked)",
                            "REDIS_URL (masked)",
                            "OPENAI_API_KEY (masked)",
                            "TWILIO_AUTH_TOKEN (masked)",
                            "AWS_ACCESS_KEY_ID (masked)",
                            "WORDPRESS_API_KEY (masked)",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2"
                            >
                                <span className="font-mono text-xs text-slate-400">{item}</span>
                                <span className="rounded bg-slate-700/50 px-2 py-1 font-mono text-xs text-slate-500">
                                    ••••••••
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t border-slate-800 pt-4">
                        <Link
                            href="/app/settings?section=integrations"
                            className="flex items-center gap-2 text-sm text-sky-400 transition-colors hover:text-sky-300"
                        >
                            <Settings01 className="size-4" />
                            <span>Manage API Keys in Settings</span>
                            <ArrowRight className="size-3" />
                        </Link>
                    </div>
                </div>

                {/* Documentation Link */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 text-center backdrop-blur-xl">
                    <h3 className="mb-2 text-lg font-semibold text-white">Need Help?</h3>
                    <p className="mb-4 text-sm text-slate-400">
                        For detailed setup instructions and troubleshooting, refer to the system documentation
                    </p>
                    <Button color="secondary" size="sm">
                        View Documentation
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
