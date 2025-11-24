"use client";

import { useState } from "react";
import {
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    FilterLines,
    MessageTextSquare01,
    Code01,
    File02,
    Link03,
    MarkerPin06,
    HelpCircle,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";

// Mock data types
interface ReviewItem {
    id: string;
    date: Date;
    module: "messaging" | "seo-title-meta" | "schema" | "faq" | "internal-linking" | "citations";
    type: string;
    target: string;
    summary: string;
    status: "pending" | "approved" | "rejected";
    requestedBy: string;
    before?: string;
    after?: string;
    messageContent?: string;
    channel?: string;
}

// Mock review items
const mockReviewItems: ReviewItem[] = [
    {
        id: "1",
        date: new Date(2025, 10, 24, 14, 30),
        module: "messaging",
        type: "AI-Generated SMS",
        target: "Lead #1234 - John Smith",
        summary: "Follow-up message for pressure washing quote",
        status: "pending",
        requestedBy: "AI Assistant",
        messageContent:
            "Hi John! Thanks for your interest in our pressure washing services. I wanted to follow up on the quote we sent yesterday for your driveway and deck. Do you have any questions? We have availability next week if you'd like to move forward!",
        channel: "SMS",
    },
    {
        id: "2",
        date: new Date(2025, 10, 24, 12, 15),
        module: "seo-title-meta",
        type: "Title & Meta Update",
        target: "/services/pressure-washing",
        summary: "Optimized title tag for better CTR",
        status: "pending",
        requestedBy: "SEO AI",
        before: "Pressure Washing Services | ABC Company",
        after: "Professional Pressure Washing Services in Denver - Free Quotes | ABC Company",
    },
    {
        id: "3",
        date: new Date(2025, 10, 24, 10, 0),
        module: "schema",
        type: "FAQ Schema Addition",
        target: "/services/snow-removal",
        summary: "Added 5 FAQ items about snow removal services",
        status: "pending",
        requestedBy: "SEO AI",
        before: "No FAQ schema",
        after: "FAQ schema with 5 questions about pricing, availability, and service areas",
    },
    {
        id: "4",
        date: new Date(2025, 10, 24, 8, 45),
        module: "internal-linking",
        type: "Internal Link Update",
        target: "/blog/winter-preparation",
        summary: "Added contextual links to service pages",
        status: "approved",
        requestedBy: "SEO AI",
        before: "2 internal links",
        after: "5 internal links to relevant service pages",
    },
    {
        id: "5",
        date: new Date(2025, 10, 23, 16, 20),
        module: "messaging",
        type: "AI-Generated Email",
        target: "Lead #1189 - Sarah Johnson",
        summary: "Thank you email after quote approval",
        status: "approved",
        requestedBy: "AI Assistant",
        messageContent:
            "Dear Sarah,\n\nThank you for approving our quote! We're excited to help with your driveway sealing project. Your appointment is scheduled for next Tuesday at 9:00 AM.\n\nOur team will arrive promptly and complete the work in approximately 3-4 hours. If you have any questions before then, please don't hesitate to reach out.\n\nBest regards,\nABC Company",
        channel: "Email",
    },
    {
        id: "6",
        date: new Date(2025, 10, 23, 14, 10),
        module: "citations",
        type: "Citation Update",
        target: "Yelp Business Profile",
        summary: "Updated business hours for winter schedule",
        status: "rejected",
        requestedBy: "SEO AI",
        before: "Mon-Fri: 8am-6pm, Sat: 9am-4pm",
        after: "Mon-Fri: 7am-7pm, Sat-Sun: 8am-5pm",
    },
];

const moduleColors = {
    messaging: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "seo-title-meta": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    schema: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    faq: "bg-green-500/10 text-green-400 border-green-500/20",
    "internal-linking": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    citations: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const moduleIcons = {
    messaging: MessageTextSquare01,
    "seo-title-meta": File02,
    schema: Code01,
    faq: HelpCircle,
    "internal-linking": Link03,
    citations: MarkerPin06,
};

const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const columnHelper = createColumnHelper<ReviewItem>();

export default function ReviewQueuePage() {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [moduleFilter, setModuleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("pending");

    const filteredItems = mockReviewItems.filter((item) => {
        const moduleMatch = moduleFilter === "all" || item.module === moduleFilter;
        const statusMatch = statusFilter === "all" || item.status === statusFilter;
        return moduleMatch && statusMatch;
    });

    const columns = [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    className="size-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="size-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                />
            ),
        }),
        columnHelper.accessor("date", {
            header: "Date",
            cell: (info) => (
                <div className="flex flex-col">
                    <span className="text-sm text-white">{format(info.getValue(), "MMM d, h:mm a")}</span>
                </div>
            ),
        }),
        columnHelper.accessor("module", {
            header: "Module",
            cell: (info) => {
                const module = info.getValue();
                const Icon = moduleIcons[module];
                return (
                    <div className={cx("inline-flex items-center gap-2 rounded border px-2 py-1", moduleColors[module])}>
                        <Icon className="size-4" />
                        <span className="text-xs capitalize">
                            {module.replace("-", " ")}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor("type", {
            header: "Type",
            cell: (info) => <span className="text-sm text-slate-300">{info.getValue()}</span>,
        }),
        columnHelper.accessor("target", {
            header: "Target",
            cell: (info) => <span className="text-sm text-white">{info.getValue()}</span>,
        }),
        columnHelper.accessor("summary", {
            header: "Summary",
            cell: (info) => <span className="text-sm text-slate-300">{info.getValue()}</span>,
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => {
                const status = info.getValue();
                return (
                    <div className={cx("inline-flex items-center gap-2 rounded border px-2 py-1", statusColors[status])}>
                        {status === "approved" && <CheckCircle className="size-4" />}
                        {status === "rejected" && <XCircle className="size-4" />}
                        <span className="text-xs capitalize">{status}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor("requestedBy", {
            header: "Requested By",
            cell: (info) => <span className="text-sm text-slate-400">{info.getValue()}</span>,
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                if (item.status !== "pending") return null;

                return (
                    <div className="flex gap-2">
                        <Button color="primary" size="sm">
                            Approve
                        </Button>
                        <Button color="primary-destructive" size="sm">
                            Reject
                        </Button>
                    </div>
                );
            },
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

    const table = useReactTable({
        data: filteredItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    const selectedCount = selectedRows.size;

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">Review Queue</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Review and approve AI-generated communications and SEO changes
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">Module</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setModuleFilter("all")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    moduleFilter === "all"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                All Modules
                            </button>
                            <button
                                onClick={() => setModuleFilter("messaging")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    moduleFilter === "messaging"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                Messaging
                            </button>
                            <button
                                onClick={() => setModuleFilter("seo-title-meta")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    moduleFilter === "seo-title-meta"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                Title/Meta
                            </button>
                            <button
                                onClick={() => setModuleFilter("schema")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    moduleFilter === "schema"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                Schema
                            </button>
                            <button
                                onClick={() => setModuleFilter("faq")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    moduleFilter === "faq"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                FAQ
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">Status</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    statusFilter === "all"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setStatusFilter("pending")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    statusFilter === "pending"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setStatusFilter("approved")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    statusFilter === "approved"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setStatusFilter("rejected")}
                                className={cx(
                                    "rounded-lg px-3 py-2 text-sm transition-colors",
                                    statusFilter === "rejected"
                                        ? "bg-sky-500/20 text-sky-400"
                                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between rounded-lg border border-sky-500/20 bg-sky-500/10 p-4 backdrop-blur-xl"
                    >
                        <span className="text-sm text-white">
                            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                        </span>
                        <div className="flex gap-2">
                            <Button color="primary" size="sm" iconLeading={CheckCircle}>
                                Approve Selected
                            </Button>
                            <Button color="primary-destructive" size="sm" iconLeading={XCircle}>
                                Reject Selected
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Table */}
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
                                        <tr key={row.id} className="transition-colors hover:bg-slate-800/40">
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
                                                        <div className="space-y-4">
                                                            {row.original.messageContent && (
                                                                <div>
                                                                    <h4 className="mb-2 text-sm font-semibold text-white">
                                                                        Message Content ({row.original.channel})
                                                                    </h4>
                                                                    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
                                                                        <p className="whitespace-pre-wrap text-sm text-slate-300">
                                                                            {row.original.messageContent}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {row.original.before && row.original.after && (
                                                                <div>
                                                                    <h4 className="mb-2 text-sm font-semibold text-white">
                                                                        Changes
                                                                    </h4>
                                                                    <div className="grid gap-4 md:grid-cols-2">
                                                                        <div>
                                                                            <div className="mb-2 flex items-center gap-2">
                                                                                <span className="text-xs font-semibold uppercase text-red-400">
                                                                                    Before
                                                                                </span>
                                                                            </div>
                                                                            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                                                                                <p className="font-mono text-xs text-slate-300">
                                                                                    {row.original.before}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 flex items-center gap-2">
                                                                                <span className="text-xs font-semibold uppercase text-green-400">
                                                                                    After
                                                                                </span>
                                                                            </div>
                                                                            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                                                                                <p className="font-mono text-xs text-slate-300">
                                                                                    {row.original.after}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
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
