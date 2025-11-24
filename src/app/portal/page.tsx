"use client";

import {
    Calendar,
    Clock,
    MarkerPin06,
    CloudSun03,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    CreditCard01,
    File06,
    TrendUp01,
    Phone02,
    Star01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";
import Link from "next/link";

interface Appointment {
    id: number;
    date: Date;
    time: string;
    service: string;
    technician: string;
    address: string;
    weather: "sunny" | "cloudy" | "rain";
    specialInstructions?: string;
}

interface Quote {
    id: number;
    name: string;
    amount: number;
    expiresAt: Date;
    status: "pending" | "approved" | "expired";
}

interface Invoice {
    id: number;
    invoiceNumber: string;
    amount: number;
    dueDate: Date;
    status: "outstanding" | "overdue" | "paid";
}

interface SeoSummary {
    newReviews: number;
    callsIncrease: number;
    rankingImprovements: number;
}

// Mock data
const customerName = "John Smith";
const nextAppointment: Appointment = {
    id: 1,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "10:00 AM - 12:00 PM",
    service: "Pressure Washing - House & Driveway",
    technician: "Mike Johnson",
    address: "123 Main Street, Springfield, IL",
    weather: "sunny",
    specialInstructions: "Please use the side gate to access backyard",
};

const quotes: Quote[] = [
    {
        id: 1,
        name: "Spring Gutter Cleaning Package",
        amount: 450.0,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "pending",
    },
    {
        id: 2,
        name: "Deck Power Washing & Staining",
        amount: 1250.0,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "pending",
    },
];

const invoices: Invoice[] = [
    {
        id: 1,
        invoiceNumber: "INV-2024-001234",
        amount: 350.0,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: "outstanding",
    },
    {
        id: 2,
        invoiceNumber: "INV-2024-001189",
        amount: 580.0,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "overdue",
    },
];

const seoSummary: SeoSummary | null = {
    newReviews: 8,
    callsIncrease: 24,
    rankingImprovements: 12,
};

export default function PortalHomePage() {
    const getWeatherIcon = (weather: Appointment["weather"]) => {
        return CloudSun03; // Simplified - would switch based on weather
    };

    const getInvoiceStatusColor = (status: Invoice["status"]) => {
        switch (status) {
            case "outstanding":
                return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "overdue":
                return "text-red-400 bg-red-500/10 border-red-500/20";
            case "paid":
                return "text-green-400 bg-green-500/10 border-green-500/20";
        }
    };

    const WeatherIcon = getWeatherIcon(nextAppointment.weather);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
                    <h1 className="text-2xl font-bold text-white">Customer Portal</h1>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                Welcome back, {customerName}!
                            </h2>
                            <p className="mt-2 text-slate-400">
                                Here's an overview of your upcoming services and pending items
                            </p>
                        </div>

                        {/* Next Appointment Card */}
                        <div className="rounded-lg border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-purple-500/10 p-6 backdrop-blur-xl">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Your Next Appointment
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-300">
                                        {format(nextAppointment.date, "EEEE, MMMM d, yyyy")}
                                    </p>
                                </div>
                                <div className="flex size-12 items-center justify-center rounded-lg bg-sky-500/20">
                                    <WeatherIcon className="size-6 text-sky-400" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 size-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-white">
                                            {nextAppointment.time}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {nextAppointment.service}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MarkerPin06 className="mt-0.5 size-5 text-slate-400" />
                                    <p className="text-sm text-slate-300">
                                        {nextAppointment.address}
                                    </p>
                                </div>

                                {nextAppointment.specialInstructions && (
                                    <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                                        <AlertCircle className="mt-0.5 size-5 text-yellow-400" />
                                        <div>
                                            <p className="text-xs font-medium text-yellow-400">
                                                Special Instructions
                                            </p>
                                            <p className="mt-1 text-sm text-slate-300">
                                                {nextAppointment.specialInstructions}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button color="primary" size="sm" iconTrailing={ArrowRight}>
                                    View Details
                                </Button>
                                <Button color="secondary" size="sm">
                                    Reschedule
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Two-Column Layout */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Quotes Requiring Approval */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">
                                    Quotes Requiring Approval
                                </h3>
                                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-400">
                                    {quotes.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {quotes.map((quote) => (
                                    <div
                                        key={quote.id}
                                        className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-sky-900/20"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-white">
                                                    {quote.name}
                                                </h4>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Expires{" "}
                                                    {format(quote.expiresAt, "MMM d, yyyy")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white">
                                                    ${quote.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/portal/quotes/${quote.id}`}>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                className="w-full"
                                                iconTrailing={ArrowRight}
                                            >
                                                View & Approve
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Outstanding Invoices */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">
                                    Outstanding Invoices
                                </h3>
                                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-400">
                                    {invoices.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {invoices.map((invoice) => (
                                    <div
                                        key={invoice.id}
                                        className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-sky-900/20"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <File06 className="size-4 text-slate-400" />
                                                    <h4 className="font-medium text-white">
                                                        {invoice.invoiceNumber}
                                                    </h4>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div
                                                        className={cx(
                                                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                                                            getInvoiceStatusColor(
                                                                invoice.status
                                                            )
                                                        )}
                                                    >
                                                        {invoice.status === "overdue"
                                                            ? "Overdue"
                                                            : "Due"}{" "}
                                                        {format(invoice.dueDate, "MMM d")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white">
                                                    ${invoice.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            color="primary"
                                            size="sm"
                                            className="w-full"
                                            iconLeading={CreditCard01}
                                            aria-label={`Pay invoice ${invoice.invoiceNumber}`}
                                        >
                                            Pay Now
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SEO Summary Card (if subscriber) */}
                    {seoSummary && (
                        <div className="rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur-xl">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        SEO Performance Summary
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Recent improvements to your online presence
                                    </p>
                                </div>
                                <Link href="/portal/seo-report">
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        iconTrailing={ArrowRight}
                                    >
                                        View Full Report
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                                        <Star01 className="size-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            +{seoSummary.newReviews}
                                        </p>
                                        <p className="text-xs text-slate-400">New Reviews</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10">
                                        <Phone02 className="size-5 text-sky-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            +{seoSummary.callsIncrease}%
                                        </p>
                                        <p className="text-xs text-slate-400">More Calls</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                                        <TrendUp01 className="size-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            +{seoSummary.rankingImprovements}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Ranking Improvements
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
