"use client";

import {
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    CreditCard01,
    ArrowLeft,
    InfoCircle,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

interface LineItem {
    id: number;
    service: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Quote {
    id: number;
    quoteNumber: string;
    name: string;
    status: "pending" | "approved" | "declined" | "expired";
    createdDate: Date;
    expiresAt: Date;
    lineItems: LineItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    depositRequired: number;
    total: number;
    notes?: string;
    seoProgressPercentage?: number;
}

// Mock data - In production, this would be fetched based on quoteId
const getQuoteById = (id: string): Quote => {
    return {
        id: parseInt(id),
        quoteNumber: `QT-2024-${id.padStart(4, "0")}`,
        name: "Spring Gutter Cleaning & Pressure Washing Package",
        status: "pending",
        createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lineItems: [
            {
                id: 1,
                service: "Gutter Cleaning",
                description: "Full house gutter cleaning with debris removal",
                unit: "House",
                quantity: 1,
                unitPrice: 250.0,
                total: 250.0,
            },
            {
                id: 2,
                service: "Downspout Flushing",
                description: "Clean and flush all downspouts",
                unit: "Each",
                quantity: 4,
                unitPrice: 25.0,
                total: 100.0,
            },
            {
                id: 3,
                service: "Pressure Washing - Driveway",
                description: "Pressure wash driveway (approximately 800 sq ft)",
                unit: "Sq Ft",
                quantity: 800,
                unitPrice: 0.15,
                total: 120.0,
            },
            {
                id: 4,
                service: "Pressure Washing - House Exterior",
                description: "Pressure wash front and side house exterior",
                unit: "House",
                quantity: 1,
                unitPrice: 380.0,
                total: 380.0,
            },
        ],
        subtotal: 850.0,
        taxRate: 0.0825,
        taxAmount: 70.13,
        discount: 50.0,
        depositRequired: 250.0,
        total: 870.13,
        notes:
            "This quote includes a spring discount of $50. Service will be scheduled within 2 weeks of approval. Weather-dependent services may be rescheduled as needed.",
        seoProgressPercentage: 65,
    };
};

export default function QuoteViewPage({ params }: { params: { quoteId: string } }) {
    const quote = getQuoteById(params.quoteId);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState("");

    const getStatusColor = (status: Quote["status"]) => {
        switch (status) {
            case "pending":
                return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "approved":
                return "text-green-400 bg-green-500/10 border-green-500/20";
            case "declined":
                return "text-red-400 bg-red-500/10 border-red-500/20";
            case "expired":
                return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    };

    const getStatusIcon = (status: Quote["status"]) => {
        switch (status) {
            case "pending":
                return Clock;
            case "approved":
                return CheckCircle;
            case "declined":
                return XCircle;
            case "expired":
                return AlertCircle;
        }
    };

    const handleApprove = () => {
        // In production, this would trigger payment flow for deposit
        console.log("Approving quote:", quote.quoteNumber);
        alert(
            `Payment flow would launch for deposit: $${quote.depositRequired.toFixed(2)}\n\nAfter payment, quote would be approved and service scheduled.`
        );
    };

    const handleDecline = () => {
        setShowDeclineModal(true);
    };

    const submitDecline = () => {
        // In production, this would submit the decline reason
        console.log("Declining quote:", quote.quoteNumber, "Reason:", declineReason);
        alert(
            `Quote declined${declineReason ? `\n\nReason: ${declineReason}` : ""}\n\nWe'll reach out to discuss alternatives.`
        );
        setShowDeclineModal(false);
    };

    const StatusIcon = getStatusIcon(quote.status);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
                    <div className="space-y-4">
                        <Link
                            href="/portal"
                            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Portal
                        </Link>

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-white">
                                        {quote.name}
                                    </h1>
                                    <div
                                        className={cx(
                                            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
                                            getStatusColor(quote.status)
                                        )}
                                    >
                                        <StatusIcon className="size-4" />
                                        {quote.status.charAt(0).toUpperCase() +
                                            quote.status.slice(1)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span>Quote #{quote.quoteNumber}</span>
                                    <span>•</span>
                                    <span>
                                        Created {format(quote.createdDate, "MMM d, yyyy")}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        Expires {format(quote.expiresAt, "MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-4">
                                <p className="text-sm text-slate-400">Total Amount</p>
                                <p className="text-3xl font-bold text-white">
                                    ${quote.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                {/* Accessible summary for screen readers */}
                <div className="sr-only">
                    Quote summary: {quote.name}, quote number {quote.quoteNumber}, total
                    amount ${quote.total.toFixed(2)}, status {quote.status}, expires on{" "}
                    {format(quote.expiresAt, "MMMM d, yyyy")}. Deposit required: $
                    {quote.depositRequired.toFixed(2)}.
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main content - Line items */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Line Items */}
                        <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                            <div className="border-b border-slate-800/50 p-6">
                                <h2 className="text-lg font-semibold text-white">
                                    Services Included
                                </h2>
                            </div>

                            <div className="divide-y divide-slate-800/50">
                                {quote.lineItems.map((item) => (
                                    <div key={item.id} className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <h3 className="font-semibold text-white">
                                                    {item.service}
                                                </h3>
                                                <p className="text-sm text-slate-400">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>
                                                        {item.quantity} {item.unit}
                                                        {item.quantity !== 1 ? "s" : ""}
                                                    </span>
                                                    <span>×</span>
                                                    <span>${item.unitPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-white">
                                                    ${item.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {quote.notes && (
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <div className="flex items-start gap-3">
                                    <InfoCircle className="mt-0.5 size-5 shrink-0 text-sky-400" />
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Important Notes
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-300">
                                            {quote.notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEO Progress (if applicable) */}
                        {quote.seoProgressPercentage !== undefined && (
                            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-xl">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-white">
                                            SEO Content Updates
                                        </h3>
                                        <span className="text-sm text-purple-400">
                                            {quote.seoProgressPercentage}% Complete
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            style={{
                                                width: `${quote.seoProgressPercentage}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Associated SEO content updates are in progress and
                                        will be completed alongside your service.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Totals and Actions */}
                    <div className="space-y-6">
                        {/* Totals Panel */}
                        <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                            <div className="border-b border-slate-800/50 p-6">
                                <h2 className="text-lg font-semibold text-white">
                                    Quote Summary
                                </h2>
                            </div>

                            <div className="space-y-4 p-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-white">
                                        ${quote.subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {quote.discount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-green-400">Discount</span>
                                        <span className="text-green-400">
                                            -${quote.discount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">
                                        Tax ({(quote.taxRate * 100).toFixed(2)}%)
                                    </span>
                                    <span className="text-white">
                                        ${quote.taxAmount.toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t border-slate-800/50 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-white">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-white">
                                            ${quote.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {quote.depositRequired > 0 && (
                                    <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-sky-400">
                                                Deposit Required
                                            </span>
                                            <span className="text-lg font-bold text-sky-400">
                                                ${quote.depositRequired.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">
                                            Pay deposit to secure your booking. Remaining
                                            balance due upon completion.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {quote.status === "pending" && (
                            <div className="space-y-3 rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <Button
                                    color="primary"
                                    size="lg"
                                    className="w-full"
                                    iconLeading={CreditCard01}
                                    onClick={handleApprove}
                                    aria-label="Approve quote and pay deposit"
                                >
                                    Approve & Pay Deposit
                                </Button>
                                <Button
                                    color="secondary"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleDecline}
                                    aria-label="Decline quote"
                                >
                                    Decline Quote
                                </Button>
                            </div>
                        )}

                        {quote.status === "approved" && (
                            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-6 text-center backdrop-blur-xl">
                                <CheckCircle className="mx-auto mb-3 size-12 text-green-400" />
                                <p className="font-semibold text-white">Quote Approved</p>
                                <p className="mt-1 text-sm text-slate-400">
                                    We'll contact you soon to schedule your service.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Decline Modal */}
            {showDeclineModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg border border-slate-800/50 bg-slate-900 p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-white">
                            Decline Quote
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                            We'd love to understand why this quote doesn't work for you.
                            Your feedback helps us improve.
                        </p>

                        <div className="mt-4">
                            <label
                                htmlFor="decline-reason"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Reason (optional)
                            </label>
                            <textarea
                                id="decline-reason"
                                rows={4}
                                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                placeholder="Let us know what we can improve..."
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                            />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                color="secondary"
                                className="flex-1"
                                onClick={() => setShowDeclineModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                className="flex-1"
                                onClick={submitDecline}
                            >
                                Decline Quote
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
