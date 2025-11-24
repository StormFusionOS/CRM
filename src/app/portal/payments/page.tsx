"use client";

import {
    CreditCard01,
    File06,
    CheckCircle,
    AlertCircle,
    Download01,
    ArrowRight,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";

interface Invoice {
    id: number;
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    amount: number;
    status: "outstanding" | "overdue" | "paid" | "pending";
    receiptUrl?: string;
}

// Mock data - Outstanding invoices at top
const invoices: Invoice[] = [
    {
        id: 1,
        invoiceNumber: "INV-2024-001234",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        amount: 350.0,
        status: "outstanding",
    },
    {
        id: 2,
        invoiceNumber: "INV-2024-001189",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        amount: 580.0,
        status: "overdue",
    },
    {
        id: 3,
        invoiceNumber: "INV-2024-001156",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        amount: 450.0,
        status: "paid",
        receiptUrl: "/receipts/INV-2024-001156.pdf",
    },
    {
        id: 4,
        invoiceNumber: "INV-2024-001098",
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
        amount: 275.0,
        status: "paid",
        receiptUrl: "/receipts/INV-2024-001098.pdf",
    },
    {
        id: 5,
        invoiceNumber: "INV-2024-001045",
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
        amount: 620.0,
        status: "paid",
        receiptUrl: "/receipts/INV-2024-001045.pdf",
    },
    {
        id: 6,
        invoiceNumber: "INV-2024-000998",
        date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000),
        amount: 380.0,
        status: "paid",
        receiptUrl: "/receipts/INV-2024-000998.pdf",
    },
];

export default function PortalPaymentsPage() {
    const getStatusColor = (status: Invoice["status"]) => {
        switch (status) {
            case "outstanding":
                return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "overdue":
                return "text-red-400 bg-red-500/10 border-red-500/20";
            case "paid":
                return "text-green-400 bg-green-500/10 border-green-500/20";
            case "pending":
                return "text-blue-400 bg-blue-500/10 border-blue-500/20";
        }
    };

    const getStatusIcon = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return CheckCircle;
            case "overdue":
                return AlertCircle;
            default:
                return File06;
        }
    };

    const handlePayInvoice = (invoice: Invoice) => {
        // In production, this would launch hosted payment form (Stripe, Square, etc.)
        console.log("Launching payment for invoice:", invoice.invoiceNumber);
        alert(
            `Payment form would open for ${invoice.invoiceNumber} - $${invoice.amount.toFixed(2)}`
        );
    };

    const handleViewReceipt = (invoice: Invoice) => {
        // In production, this would open PDF or in-app receipt view
        console.log("Opening receipt for invoice:", invoice.invoiceNumber);
        if (invoice.receiptUrl) {
            // window.open(invoice.receiptUrl, '_blank');
            alert(
                `Receipt would open for ${invoice.invoiceNumber}\nURL: ${invoice.receiptUrl}`
            );
        }
    };

    // Sort invoices: outstanding/overdue first, then paid by date descending
    const sortedInvoices = [...invoices].sort((a, b) => {
        const statusOrder = { overdue: 0, outstanding: 1, pending: 2, paid: 3 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;
        return b.date.getTime() - a.date.getTime();
    });

    const outstandingCount = invoices.filter(
        (inv) => inv.status === "outstanding" || inv.status === "overdue"
    ).length;

    const totalOutstanding = invoices
        .filter((inv) => inv.status === "outstanding" || inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Payments & Receipts
                            </h1>
                            <p className="mt-1 text-sm text-slate-400">
                                Manage your invoices and view payment history
                            </p>
                        </div>
                        {outstandingCount > 0 && (
                            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-2">
                                <p className="text-sm font-medium text-yellow-400">
                                    {outstandingCount} outstanding invoice
                                    {outstandingCount !== 1 ? "s" : ""}
                                </p>
                                <p className="text-xs text-slate-300">
                                    Total: ${totalOutstanding.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="space-y-6">
                    {/* Outstanding Invoices Section */}
                    {outstandingCount > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="size-5 text-yellow-400" />
                                <h2 className="text-lg font-semibold text-white">
                                    Action Required
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {sortedInvoices
                                    .filter(
                                        (invoice) =>
                                            invoice.status === "outstanding" ||
                                            invoice.status === "overdue"
                                    )
                                    .map((invoice) => {
                                        const StatusIcon = getStatusIcon(invoice.status);
                                        return (
                                            <div
                                                key={invoice.id}
                                                className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-sky-900/20 md:p-6"
                                            >
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <StatusIcon className="size-4 text-slate-400" />
                                                            <h3 className="font-semibold text-white">
                                                                {invoice.invoiceNumber}
                                                            </h3>
                                                            <div
                                                                className={cx(
                                                                    "rounded-full border px-2 py-0.5 text-xs font-medium",
                                                                    getStatusColor(invoice.status)
                                                                )}
                                                            >
                                                                {invoice.status === "overdue"
                                                                    ? "Overdue"
                                                                    : "Due"}{" "}
                                                                {format(invoice.dueDate, "MMM d")}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                                            <span>
                                                                Issued{" "}
                                                                {format(invoice.date, "MMM d, yyyy")}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                Due{" "}
                                                                {format(
                                                                    invoice.dueDate,
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-start gap-3 md:items-end">
                                                        <p className="text-2xl font-bold text-white">
                                                            ${invoice.amount.toFixed(2)}
                                                        </p>
                                                        <Button
                                                            color="primary"
                                                            size="sm"
                                                            iconLeading={CreditCard01}
                                                            onClick={() =>
                                                                handlePayInvoice(invoice)
                                                            }
                                                            className="w-full md:w-auto"
                                                            aria-label={`Pay invoice ${invoice.invoiceNumber}`}
                                                        >
                                                            Pay Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Past Invoices Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="size-5 text-green-400" />
                            <h2 className="text-lg font-semibold text-white">
                                Payment History
                            </h2>
                        </div>

                        {sortedInvoices.filter((inv) => inv.status === "paid").length ===
                        0 ? (
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-8 text-center backdrop-blur-xl">
                                <CheckCircle className="mx-auto mb-3 size-12 text-slate-600" />
                                <p className="text-slate-400">No payment history yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedInvoices
                                    .filter((invoice) => invoice.status === "paid")
                                    .map((invoice) => (
                                        <div
                                            key={invoice.id}
                                            className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-sky-900/20 md:p-6"
                                        >
                                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="size-4 text-green-400" />
                                                        <h3 className="font-semibold text-white">
                                                            {invoice.invoiceNumber}
                                                        </h3>
                                                        <div
                                                            className={cx(
                                                                "rounded-full border px-2 py-0.5 text-xs font-medium",
                                                                getStatusColor(invoice.status)
                                                            )}
                                                        >
                                                            Paid
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                                        <span>
                                                            Issued{" "}
                                                            {format(invoice.date, "MMM d, yyyy")}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            Paid{" "}
                                                            {format(invoice.dueDate, "MMM d, yyyy")}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start gap-3 md:items-end">
                                                    <p className="text-xl font-bold text-white">
                                                        ${invoice.amount.toFixed(2)}
                                                    </p>
                                                    <Button
                                                        color="secondary"
                                                        size="sm"
                                                        iconLeading={Download01}
                                                        onClick={() => handleViewReceipt(invoice)}
                                                        className="w-full md:w-auto"
                                                        aria-label={`View receipt for invoice ${invoice.invoiceNumber}`}
                                                    >
                                                        View Receipt
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
