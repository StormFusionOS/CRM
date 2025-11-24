"use client";

import { useState } from "react";
import {
    BarChart04,
    CurrencyDollar,
    Users01,
    TrendUp02,
    LineChartUp01,
    Target04,
    Award01,
    FileCheck02,
    Download01,
    Calendar,
    ChevronDown,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format, subDays } from "date-fns";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";

// Mock data types
interface Report {
    id: string;
    name: string;
    category: "financial" | "operations" | "seo" | "accounting";
    icon: typeof BarChart04;
    description: string;
}

// Mock reports list
const reports: Report[] = [
    {
        id: "financial-dashboard",
        name: "Financial Dashboard",
        category: "financial",
        icon: BarChart04,
        description: "Overview of revenue, expenses, and profitability",
    },
    {
        id: "revenue-reports",
        name: "Revenue Reports",
        category: "financial",
        icon: CurrencyDollar,
        description: "Revenue by period, service type, and technician",
    },
    {
        id: "lead-conversion",
        name: "Lead Conversion Funnel",
        category: "operations",
        icon: Target04,
        description: "Track leads through pipeline stages to conversion",
    },
    {
        id: "tech-performance",
        name: "Technician Performance",
        category: "operations",
        icon: Award01,
        description: "Jobs completed, customer ratings, revenue per tech",
    },
    {
        id: "customer-analytics",
        name: "Customer Analytics",
        category: "operations",
        icon: Users01,
        description: "LTV, repeat customers, multi-service clients",
    },
    {
        id: "marketing-roi",
        name: "Marketing/SEO ROI",
        category: "seo",
        icon: TrendUp02,
        description: "Leads and revenue by source and landing page",
    },
    {
        id: "seo-ctr-uplift",
        name: "SEO CTR Uplift",
        category: "seo",
        icon: LineChartUp01,
        description: "Click-through rate improvements over time",
    },
    {
        id: "index-coverage",
        name: "Index Coverage Trend",
        category: "seo",
        icon: FileCheck02,
        description: "Pages indexed vs excluded by search engines",
    },
];

// Mock chart data
const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000 },
    { month: "Feb", revenue: 52000, expenses: 30000, profit: 22000 },
    { month: "Mar", revenue: 48000, expenses: 29000, profit: 19000 },
    { month: "Apr", revenue: 61000, expenses: 32000, profit: 29000 },
    { month: "May", revenue: 55000, expenses: 31000, profit: 24000 },
    { month: "Jun", revenue: 67000, expenses: 34000, profit: 33000 },
];

const conversionData = [
    { stage: "New Leads", count: 450, rate: 100 },
    { stage: "Contacted", count: 380, rate: 84 },
    { stage: "Qualified", count: 290, rate: 64 },
    { stage: "Quoted", count: 220, rate: 49 },
    { stage: "Won", count: 145, rate: 32 },
];

const techPerformanceData = [
    { name: "Mike Johnson", jobs: 87, rating: 4.9, revenue: 42500 },
    { name: "Sarah Williams", jobs: 92, rating: 4.8, revenue: 45200 },
    { name: "Tom Anderson", jobs: 78, rating: 4.7, revenue: 38900 },
    { name: "Lisa Brown", jobs: 85, rating: 4.9, revenue: 41800 },
    { name: "David Lee", jobs: 73, rating: 4.6, revenue: 36200 },
];

const seoMetricsData = [
    { month: "Jan", ctr: 3.2, impressions: 45000, clicks: 1440 },
    { month: "Feb", ctr: 3.5, impressions: 48000, clicks: 1680 },
    { month: "Mar", ctr: 3.8, impressions: 52000, clicks: 1976 },
    { month: "Apr", ctr: 4.1, impressions: 55000, clicks: 2255 },
    { month: "May", ctr: 4.4, impressions: 58000, clicks: 2552 },
    { month: "Jun", ctr: 4.7, impressions: 61000, clicks: 2867 },
];

const categories = [
    { id: "financial", name: "Financial", icon: CurrencyDollar },
    { id: "operations", name: "Operations", icon: Target04 },
    { id: "seo", name: "SEO", icon: TrendUp02 },
    { id: "accounting", name: "Accounting", icon: FileCheck02 },
];

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<string>("financial-dashboard");
    const [dateRange, setDateRange] = useState("last-30-days");

    const selectedReportData = reports.find((r) => r.id === selectedReport);

    const renderChart = () => {
        switch (selectedReport) {
            case "financial-dashboard":
            case "revenue-reports":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0ea5e9"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                            <Area
                                type="monotone"
                                dataKey="profit"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorProfit)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case "lead-conversion":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={conversionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="stage" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="count" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "tech-performance":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={techPerformanceData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="jobs" fill="#0ea5e9" />
                            <Bar dataKey="revenue" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "marketing-roi":
            case "seo-ctr-uplift":
            case "index-coverage":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={seoMetricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="ctr" stroke="#0ea5e9" strokeWidth={2} />
                            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return (
                    <div className="flex h-[400px] items-center justify-center text-slate-400">
                        <p>Select a report to view analytics</p>
                    </div>
                );
        }
    };

    const renderTable = () => {
        switch (selectedReport) {
            case "financial-dashboard":
            case "revenue-reports":
                return (
                    <table className="w-full">
                        <thead className="border-b border-slate-700/50 bg-slate-800/40">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Month
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Revenue
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Expenses
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Profit
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Margin
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {revenueData.map((row) => (
                                <tr key={row.month} className="transition-colors hover:bg-slate-800/40">
                                    <td className="px-4 py-4 text-sm text-white">{row.month}</td>
                                    <td className="px-4 py-4 text-right text-sm text-white">
                                        ${row.revenue.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-white">
                                        ${row.expenses.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-green-400">
                                        ${row.profit.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                                        {((row.profit / row.revenue) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );

            case "tech-performance":
                return (
                    <table className="w-full">
                        <thead className="border-b border-slate-700/50 bg-slate-800/40">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Technician
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Jobs
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Rating
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Revenue
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Avg/Job
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {techPerformanceData.map((row) => (
                                <tr key={row.name} className="transition-colors hover:bg-slate-800/40">
                                    <td className="px-4 py-4 text-sm text-white">{row.name}</td>
                                    <td className="px-4 py-4 text-right text-sm text-white">{row.jobs}</td>
                                    <td className="px-4 py-4 text-right text-sm text-yellow-400">
                                        {row.rating.toFixed(1)} ⭐
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-white">
                                        ${row.revenue.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-slate-300">
                                        ${(row.revenue / row.jobs).toFixed(0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );

            default:
                return (
                    <div className="p-8 text-center text-slate-400">
                        <p>Data table for {selectedReportData?.name}</p>
                    </div>
                );
        }
    };

    return (
        <AppLayout>
            <div className="flex h-[calc(100vh-4rem)] gap-6">
                {/* Sidebar - Report Categories */}
                <div className="w-80 space-y-4 overflow-y-auto">
                    <div>
                        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">Reports</h2>
                        <p className="text-sm text-slate-400">Select a report to view analytics and export data</p>
                    </div>

                    {categories.map((category) => {
                        const categoryReports = reports.filter((r) => r.category === category.id);
                        if (categoryReports.length === 0) return null;

                        const Icon = category.icon;

                        return (
                            <div key={category.id} className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                                    <Icon className="size-4" />
                                    <span>{category.name}</span>
                                </div>

                                <div className="space-y-1">
                                    {categoryReports.map((report) => {
                                        const ReportIcon = report.icon;
                                        const isSelected = selectedReport === report.id;

                                        return (
                                            <button
                                                key={report.id}
                                                onClick={() => setSelectedReport(report.id)}
                                                className={cx(
                                                    "w-full rounded-lg p-3 text-left transition-colors",
                                                    isSelected
                                                        ? "bg-sky-500/20 text-sky-400"
                                                        : "text-slate-300 hover:bg-slate-800/60"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <ReportIcon className="mt-0.5 size-5 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium">{report.name}</div>
                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {report.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content - Report View */}
                <div className="flex-1 space-y-6 overflow-y-auto">
                    {/* Header with filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-white">
                                {selectedReportData?.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-400">{selectedReportData?.description}</p>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="appearance-none rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 pr-10 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="last-7-days">Last 7 days</option>
                                    <option value="last-30-days">Last 30 days</option>
                                    <option value="last-90-days">Last 90 days</option>
                                    <option value="last-year">Last year</option>
                                    <option value="custom">Custom range</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            </div>

                            <Button color="tertiary" size="sm" iconLeading={Download01}>
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedReport}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl"
                        >
                            <h3 className="mb-4 text-lg font-semibold text-white">Visualization</h3>
                            {renderChart()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Data Table Section */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedReport}-table`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="rounded-xl border border-sky-500/10 bg-slate-900/60 backdrop-blur-xl"
                        >
                            <div className="border-b border-slate-700/50 p-6">
                                <h3 className="text-lg font-semibold text-white">Data Table</h3>
                            </div>
                            <div className="overflow-x-auto">{renderTable()}</div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
