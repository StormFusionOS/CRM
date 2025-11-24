"use client";

import { useState } from "react";
import {
    Server01,
    Database01,
    HardDrive,
    CloudBlank01,
    RefreshCcw01,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Clock,
    Activity,
    ArrowRight,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format, formatDistanceToNow } from "date-fns";

type HealthStatus = "healthy" | "warning" | "error";

interface HealthCard {
    id: string;
    category: string;
    name: string;
    status: HealthStatus;
    lastChecked: Date;
    message: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface CheckRun {
    id: number;
    time: Date;
    checkName: string;
    status: HealthStatus;
    duration: number;
    summary: string;
}

const mockHealthCards: HealthCard[] = [
    // Service Health
    {
        id: "wordpress",
        category: "Service Health",
        name: "WordPress",
        status: "healthy",
        lastChecked: new Date(Date.now() - 5 * 60 * 1000),
        message: "All endpoints responding normally",
        icon: Server01,
    },
    {
        id: "api",
        category: "Service Health",
        name: "API",
        status: "healthy",
        lastChecked: new Date(Date.now() - 2 * 60 * 1000),
        message: "Response time: 245ms avg",
        icon: Activity,
    },
    {
        id: "workers",
        category: "Service Health",
        name: "Background Workers",
        status: "warning",
        lastChecked: new Date(Date.now() - 10 * 60 * 1000),
        message: "2 jobs in retry queue",
        icon: RefreshCcw01,
    },
    // Storage
    {
        id: "database",
        category: "Storage",
        name: "Database Size",
        status: "healthy",
        lastChecked: new Date(Date.now() - 15 * 60 * 1000),
        message: "3.2 GB / 20 GB (16%)",
        icon: Database01,
    },
    {
        id: "file-storage",
        category: "Storage",
        name: "File Storage",
        status: "healthy",
        lastChecked: new Date(Date.now() - 20 * 60 * 1000),
        message: "12.8 GB / 100 GB (13%)",
        icon: HardDrive,
    },
    // Backup
    {
        id: "backup",
        category: "Backup",
        name: "Last Backup",
        status: "healthy",
        lastChecked: new Date(Date.now() - 3 * 60 * 60 * 1000),
        message: "Completed successfully",
        icon: CloudBlank01,
    },
];

const mockCheckRuns: CheckRun[] = [
    {
        id: 1,
        time: new Date(Date.now() - 5 * 60 * 1000),
        checkName: "WordPress Health",
        status: "healthy",
        duration: 1234,
        summary: "All systems operational",
    },
    {
        id: 2,
        time: new Date(Date.now() - 10 * 60 * 1000),
        checkName: "Background Workers",
        status: "warning",
        duration: 2341,
        summary: "2 jobs in retry queue",
    },
    {
        id: 3,
        time: new Date(Date.now() - 15 * 60 * 1000),
        checkName: "Database Health",
        status: "healthy",
        duration: 856,
        summary: "Connection pool healthy",
    },
    {
        id: 4,
        time: new Date(Date.now() - 30 * 60 * 1000),
        checkName: "Storage Check",
        status: "healthy",
        duration: 1567,
        summary: "Storage within limits",
    },
    {
        id: 5,
        time: new Date(Date.now() - 3 * 60 * 60 * 1000),
        checkName: "Backup Verification",
        status: "healthy",
        duration: 45234,
        summary: "Backup completed and verified",
    },
];

const statusConfig = {
    healthy: {
        icon: CheckCircle,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        label: "Healthy",
    },
    warning: {
        icon: AlertTriangle,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        label: "Warning",
    },
    error: {
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        label: "Error",
    },
};

export default function SystemHealthPage() {
    const [isRunningChecks, setIsRunningChecks] = useState(false);

    const handleRunAllChecks = () => {
        setIsRunningChecks(true);
        // Simulate running checks
        setTimeout(() => {
            setIsRunningChecks(false);
        }, 2000);
    };

    const groupedCards = mockHealthCards.reduce(
        (acc, card) => {
            if (!acc[card.category]) {
                acc[card.category] = [];
            }
            acc[card.category].push(card);
            return acc;
        },
        {} as Record<string, HealthCard[]>
    );

    return (
        <AppLayout
            title="System Health & Alerting"
            description="Monitor the health of core services and infrastructure"
            actions={
                <Button
                    color="primary"
                    iconLeading={RefreshCcw01}
                    onClick={handleRunAllChecks}
                    loading={isRunningChecks}
                >
                    Run All Checks
                </Button>
            }
        >
            <div className="space-y-8">
                {/* Health Status Cards */}
                {Object.entries(groupedCards).map(([category, cards]) => (
                    <div key={category}>
                        <h2 className="mb-4 text-lg font-semibold text-white">{category}</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {cards.map((card) => {
                                const Icon = card.icon;
                                const StatusIcon = statusConfig[card.status].icon;

                                return (
                                    <div
                                        key={card.id}
                                        className="group rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-900/20"
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cx(
                                                        "flex size-10 items-center justify-center rounded-lg",
                                                        statusConfig[card.status].bgColor
                                                    )}
                                                >
                                                    <Icon
                                                        className={cx("size-5", statusConfig[card.status].color)}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-white">{card.name}</h3>
                                                </div>
                                            </div>
                                            <span
                                                className={cx(
                                                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                                    statusConfig[card.status].bgColor,
                                                    statusConfig[card.status].borderColor,
                                                    statusConfig[card.status].color
                                                )}
                                            >
                                                <StatusIcon className="size-3" />
                                                {statusConfig[card.status].label}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm text-slate-300">{card.message}</p>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Clock className="size-3" />
                                                <span>
                                                    Last checked{" "}
                                                    {formatDistanceToNow(card.lastChecked, { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
                                            <button className="flex items-center gap-1 text-xs text-sky-400 transition-colors hover:text-sky-300">
                                                View details
                                                <ArrowRight className="size-3" />
                                            </button>
                                            <button className="text-xs text-slate-400 transition-colors hover:text-slate-200">
                                                Run check
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Recent Checks Timeline */}
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-white">Recent Check Runs</h2>

                    <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Check Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Duration
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Summary
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {mockCheckRuns.map((run) => {
                                        const StatusIcon = statusConfig[run.status].icon;

                                        return (
                                            <tr key={run.id} className="hover:bg-slate-800/30">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-white">
                                                            {format(run.time, "MMM d, h:mm a")}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {formatDistanceToNow(run.time, { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-white">
                                                    {run.checkName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={cx(
                                                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                                            statusConfig[run.status].bgColor,
                                                            statusConfig[run.status].borderColor,
                                                            statusConfig[run.status].color
                                                        )}
                                                    >
                                                        <StatusIcon className="size-3" />
                                                        {statusConfig[run.status].label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    {run.duration < 1000
                                                        ? `${run.duration}ms`
                                                        : `${(run.duration / 1000).toFixed(1)}s`}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300">{run.summary}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                                <CheckCircle className="size-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {mockHealthCards.filter((c) => c.status === "healthy").length}
                                </div>
                                <div className="text-sm text-slate-400">Healthy Services</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10">
                                <AlertTriangle className="size-5 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {mockHealthCards.filter((c) => c.status === "warning").length}
                                </div>
                                <div className="text-sm text-slate-400">Warnings</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                                <XCircle className="size-5 text-red-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {mockHealthCards.filter((c) => c.status === "error").length}
                                </div>
                                <div className="text-sm text-slate-400">Critical Errors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
