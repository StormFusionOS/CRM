"use client";

import {
    TrendUp01,
    TrendDown01,
    Eye,
    CursorClick01,
    BarChart12,
    SearchLg,
    FilterLines,
    FileDownload02,
    CheckCircle,
    AlertCircle,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Keyword {
    id: number;
    keyword: string;
    currentRank: number;
    previousRank: number;
    delta: number;
    ctr: number;
    clicks: number;
    impressions: number;
    pageUrl: string;
    snippetOwner: "us" | "competitor";
    competitorName?: string;
}

export default function SERPRankingsPage() {
    // Mock rank distribution data
    const rankDistribution = [
        { bucket: "Top 3", count: 12 },
        { bucket: "4-10", count: 24 },
        { bucket: "11-20", count: 18 },
        { bucket: "21-50", count: 15 },
        { bucket: "50+", count: 8 },
    ];

    // Mock time-series data
    const timeSeriesData = [
        { date: "Jan 1", impressions: 12000, clicks: 840, ctr: 7.0 },
        { date: "Jan 8", impressions: 13500, clicks: 945, ctr: 7.0 },
        { date: "Jan 15", impressions: 14200, clicks: 1136, ctr: 8.0 },
        { date: "Jan 22", impressions: 15800, clicks: 1422, ctr: 9.0 },
        { date: "Jan 29", impressions: 16500, clicks: 1650, ctr: 10.0 },
    ];

    // Mock keyword data
    const keywords: Keyword[] = [
        {
            id: 1,
            keyword: "pressure washing services near me",
            currentRank: 2,
            previousRank: 4,
            delta: 2,
            ctr: 12.5,
            clicks: 340,
            impressions: 2720,
            pageUrl: "/services/pressure-washing",
            snippetOwner: "us",
        },
        {
            id: 2,
            keyword: "roof cleaning contractors",
            currentRank: 5,
            previousRank: 3,
            delta: -2,
            ctr: 8.3,
            clicks: 180,
            impressions: 2168,
            pageUrl: "/services/roof-cleaning",
            snippetOwner: "competitor",
            competitorName: "CleanRoof Pro",
        },
        {
            id: 3,
            keyword: "house washing estimate",
            currentRank: 1,
            previousRank: 1,
            delta: 0,
            ctr: 18.2,
            clicks: 520,
            impressions: 2857,
            pageUrl: "/get-quote",
            snippetOwner: "us",
        },
        {
            id: 4,
            keyword: "exterior cleaning company",
            currentRank: 8,
            previousRank: 12,
            delta: 4,
            ctr: 5.1,
            clicks: 95,
            impressions: 1863,
            pageUrl: "/services",
            snippetOwner: "competitor",
            competitorName: "ExteriorPro LLC",
        },
        {
            id: 5,
            keyword: "driveway pressure washing cost",
            currentRank: 3,
            previousRank: 5,
            delta: 2,
            ctr: 10.8,
            clicks: 275,
            impressions: 2546,
            pageUrl: "/pricing/driveway",
            snippetOwner: "us",
        },
    ];

    const getRankBadgeColor = (rank: number) => {
        if (rank <= 3) return "bg-green-500/10 text-green-400 border-green-500/20";
        if (rank <= 10) return "bg-sky-500/10 text-sky-400 border-sky-500/20";
        if (rank <= 20) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="border-b border-sky-500/10 bg-slate-900/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-white">
                                SERP & Rankings
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">
                                Track keyword rankings, CTR, and featured snippet opportunities
                            </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <FileDownload02 className="h-4 w-4" />
                            Export Report
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 flex items-center gap-3">
                        <div className="relative flex-1 max-w-md">
                            <SearchLg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search keywords..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-sky-500/10 bg-slate-900/40 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <FilterLines className="h-4 w-4" />
                            Filter by Tag
                        </Button>
                        <select className="rounded-lg border border-sky-500/10 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 focus:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20">
                            <option>Google US</option>
                            <option>Google Canada</option>
                            <option>Bing US</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rank Distribution Chart */}
                    <div className="rounded-xl border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl p-6">
                        <h3 className="text-sm font-medium text-white mb-4">
                            Rank Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={rankDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis
                                    dataKey="bucket"
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid rgba(14, 165, 233, 0.1)",
                                        borderRadius: "8px",
                                        color: "#e2e8f0",
                                    }}
                                />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Time Series Chart */}
                    <div className="rounded-xl border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl p-6">
                        <h3 className="text-sm font-medium text-white mb-4">
                            Impressions, Clicks & CTR Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid rgba(14, 165, 233, 0.1)",
                                        borderRadius: "8px",
                                        color: "#e2e8f0",
                                    }}
                                />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="impressions"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    dot={{ fill: "#0ea5e9" }}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: "#10b981" }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="ctr"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={{ fill: "#f59e0b" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Keywords Table */}
                <div className="rounded-xl border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
                    <div className="p-6 border-b border-sky-500/10">
                        <h3 className="text-sm font-medium text-white">
                            Tracked Keywords ({keywords.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/60">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Keyword
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Change
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        CTR
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Clicks
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Impressions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Page URL
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Snippet Owner
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-500/10">
                                {keywords.map((kw) => (
                                    <tr
                                        key={kw.id}
                                        className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-white font-medium">
                                                {kw.keyword}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cx(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
                                                    getRankBadgeColor(kw.currentRank)
                                                )}
                                            >
                                                #{kw.currentRank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {kw.delta !== 0 && (
                                                <div className="flex items-center gap-1">
                                                    {kw.delta > 0 ? (
                                                        <>
                                                            <TrendUp01 className="h-3.5 w-3.5 text-green-400" />
                                                            <span className="text-sm text-green-400">
                                                                +{kw.delta}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendDown01 className="h-3.5 w-3.5 text-red-400" />
                                                            <span className="text-sm text-red-400">
                                                                {kw.delta}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {kw.delta === 0 && (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-200">
                                                {kw.ctr.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <CursorClick01 className="h-3.5 w-3.5 text-sky-400" />
                                                <span className="text-sm text-slate-200">
                                                    {kw.clicks.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                                <span className="text-sm text-slate-200">
                                                    {kw.impressions.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-slate-400 font-mono truncate max-w-[200px] block">
                                                {kw.pageUrl}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {kw.snippetOwner === "us" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Us
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {kw.competitorName}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
