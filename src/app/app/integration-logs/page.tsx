"use client";

import { useState } from "react";
import {
    Server01,
    SearchLg,
    Link03,
    Globe01,
    Activity,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    FilterLines,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { format, formatDistanceToNow } from "date-fns";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";

// Mock data types
interface ModuleStatus {
    id: string;
    name: string;
    icon: typeof Server01;
    status: "success" | "warning" | "error" | "idle";
    lastRun: Date;
    lastStatus: string;
    itemsProcessed?: number;
}

interface LogEntry {
    id: string;
    timestamp: Date;
    module: string;
    taskName: string;
    status: "success" | "warning" | "error";
    duration: number; // seconds
    itemsProcessed: number;
    message: string;
    details?: string;
}

// Mock module statuses
const mockModules: ModuleStatus[] = [
    {
        id: "serp-scraper",
        name: "SERP Scraper",
        icon: SearchLg,
        status: "success",
        lastRun: new Date(2025, 10, 24, 14, 30),
        lastStatus: "Completed successfully",
        itemsProcessed: 1247,
    },
    {
        id: "competitor-crawler",
        name: "Competitor Crawler",
        icon: Globe01,
        status: "success",
        lastRun: new Date(2025, 10, 24, 12, 15),
        lastStatus: "All competitors analyzed",
        itemsProcessed: 45,
    },
    {
        id: "citation-auditor",
        name: "Citation Auditor",
        icon: Link03,
        status: "warning",
        lastRun: new Date(2025, 10, 24, 10, 0),
        lastStatus: "3 citations need attention",
        itemsProcessed: 127,
    },
    {
        id: "backlink-monitor",
        name: "Backlink Monitor",
        icon: Activity,
        status: "error",
        lastRun: new Date(2025, 10, 24, 8, 45),
        lastStatus: "Connection timeout",
        itemsProcessed: 0,
    },
];

// Mock log entries
const mockLogs: LogEntry[] = [
    {
        id: "1",
        timestamp: new Date(2025, 10, 24, 14, 30),
        module: "SERP Scraper",
        taskName: "Daily keyword ranking update",
        status: "success",
        duration: 127,
        itemsProcessed: 1247,
        message: "Successfully scraped and indexed all target keywords",
        details:
            "Processed 1247 keywords across 15 locations. Found 34 rank improvements, 12 declines. Average position: 8.3 (+0.4 from last week).",
    },
    {
        id: "2",
        timestamp: new Date(2025, 10, 24, 12, 15),
        module: "Competitor Crawler",
        taskName: "Competitor analysis sweep",
        status: "success",
        duration: 89,
        itemsProcessed: 45,
        message: "Analyzed 45 competitor websites",
        details:
            "Discovered 8 new backlinks from competitors, 3 new content topics, 12 on-page optimization opportunities.",
    },
    {
        id: "3",
        timestamp: new Date(2025, 10, 24, 10, 0),
        module: "Citation Auditor",
        taskName: "Citation consistency check",
        status: "warning",
        duration: 245,
        itemsProcessed: 127,
        message: "Found 3 citations with inconsistent NAP data",
        details:
            "127 citations checked. Issues found: YellowPages (phone mismatch), Yelp (address format), Bing Places (business hours outdated).",
    },
    {
        id: "4",
        timestamp: new Date(2025, 10, 24, 8, 45),
        module: "Backlink Monitor",
        taskName: "Backlink profile scan",
        status: "error",
        duration: 15,
        itemsProcessed: 0,
        message: "Connection timeout to external API",
        details:
            "Failed to connect to Ahrefs API after 3 retry attempts. Error: ETIMEDOUT. Last successful scan: Nov 23, 14:30.",
    },
    {
        id: "5",
        timestamp: new Date(2025, 10, 23, 22, 0),
        module: "SERP Scraper",
        taskName: "Evening keyword check",
        status: "success",
        duration: 134,
        itemsProcessed: 1247,
        message: "Evening update completed",
        details: "All keywords updated successfully. No significant changes detected since morning scan.",
    },
];

const statusColors = {
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    idle: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const statusIcons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
};

const columnHelper = createColumnHelper<LogEntry>();

export default function IntegrationLogsPage() {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [selectedModule, setSelectedModule] = useState<string>("all");

    const columns = [
        columnHelper.accessor("timestamp", {
            header: "Time",
            cell: (info) => (
                <div className="flex flex-col">
                    <span className="text-sm text-white">{format(info.getValue(), "MMM d, h:mm a")}</span>
                    <span className="text-xs text-slate-500">
                        {formatDistanceToNow(info.getValue(), { addSuffix: true })}
                    </span>
                </div>
            ),
        }),
        columnHelper.accessor("module", {
            header: "Module",
            cell: (info) => <span className="text-sm text-white">{info.getValue()}</span>,
        }),
        columnHelper.accessor("taskName", {
            header: "Task",
            cell: (info) => <span className="text-sm text-slate-300">{info.getValue()}</span>,
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => {
                const status = info.getValue();
                const StatusIcon = statusIcons[status];
                return (
                    <div className={cx("inline-flex items-center gap-2 rounded border px-2 py-1", statusColors[status])}>
                        <StatusIcon className="size-4" />
                        <span className="text-xs capitalize">{status}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor("duration", {
            header: "Duration",
            cell: (info) => (
                <div className="flex items-center gap-1 text-sm text-slate-300">
                    <Clock className="size-4" />
                    <span>{info.getValue()}s</span>
                </div>
            ),
        }),
        columnHelper.accessor("itemsProcessed", {
            header: "Items",
            cell: (info) => <span className="text-sm text-slate-300">{info.getValue().toLocaleString()}</span>,
        }),
        columnHelper.accessor("message", {
            header: "Message",
            cell: (info) => <span className="text-sm text-slate-300">{info.getValue()}</span>,
        }),
        columnHelper.display({
            id: "expand",
            cell: ({ row }) => (
                <button
                    onClick={() => row.toggleExpanded()}
                    className="text-sky-400 transition-colors hover:text-sky-300"
                >
                    {row.getIsExpanded() ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                </button>
            ),
        }),
    ];

    const filteredLogs = selectedModule === "all" ? mockLogs : mockLogs.filter((log) => log.module === selectedModule);

    const table = useReactTable({
        data: filteredLogs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">Integration Logs & Status</h1>
                        <p className="mt-1 text-sm text-slate-400">Monitor scraper, audit, and integration job histories</p>
                    </div>
                    <div className="flex gap-2">
                        <Button color="tertiary" size="sm" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Module Status Cards */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {mockModules.map((module) => {
                        const Icon = module.icon;
                        const StatusIcon = statusIcons[module.status as keyof typeof statusIcons];

                        return (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="rounded-lg bg-sky-500/10 p-2">
                                        <Icon className="size-6 text-sky-400" />
                                    </div>
                                    <div
                                        className={cx(
                                            "rounded border px-2 py-1",
                                            statusColors[module.status as keyof typeof statusColors]
                                        )}
                                    >
                                        {StatusIcon && <StatusIcon className="size-4" />}
                                    </div>
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-white">{module.name}</h3>

                                <div className="mb-4 space-y-1">
                                    <p className="text-xs text-slate-400">
                                        Last run: {formatDistanceToNow(module.lastRun, { addSuffix: true })}
                                    </p>
                                    <p className="text-sm text-slate-300">{module.lastStatus}</p>
                                    {module.itemsProcessed !== undefined && (
                                        <p className="text-xs text-slate-500">
                                            {module.itemsProcessed.toLocaleString()} items processed
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedModule(module.name)}
                                    className="text-sm text-sky-400 transition-colors hover:text-sky-300"
                                >
                                    View logs →
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedModule("all")}
                        className={cx(
                            "rounded-lg px-3 py-2 text-sm transition-colors",
                            selectedModule === "all"
                                ? "bg-sky-500/20 text-sky-400"
                                : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                        )}
                    >
                        All Modules
                    </button>
                    {mockModules.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => setSelectedModule(module.name)}
                            className={cx(
                                "rounded-lg px-3 py-2 text-sm transition-colors",
                                selectedModule === module.name
                                    ? "bg-sky-500/20 text-sky-400"
                                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            {module.name}
                        </button>
                    ))}
                </div>

                {/* Logs Table */}
                <div className="overflow-hidden rounded-xl border border-sky-500/10 bg-slate-900/60 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-700/50 bg-slate-800/40">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {table.getRowModel().rows.map((row) => (
                                    <>
                                        <tr
                                            key={row.id}
                                            className="transition-colors hover:bg-slate-800/40"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-4 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                        <AnimatePresence>
                                            {row.getIsExpanded() && (
                                                <motion.tr
                                                    key={`${row.id}-expanded`}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <td colSpan={columns.length} className="bg-slate-800/60 px-4 py-4">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <h4 className="mb-2 text-sm font-semibold text-white">
                                                                    Log Details
                                                                </h4>
                                                                <p className="font-mono text-xs text-slate-300">
                                                                    {row.original.details}
                                                                </p>
                                                            </div>
                                                            <Button color="tertiary" size="sm">
                                                                Open in Log Viewer
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
