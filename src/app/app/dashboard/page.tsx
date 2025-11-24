"use client";

import {
    Users01,
    CurrencyDollar,
    CheckCircle,
    TrendUp01,
    Shield01,
    Database01,
    Server01,
    HardDrive,
    Cloud01,
    TrendUp01 as ChartIcon,
    Globe01,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SEOMetricCard } from "@/components/dashboard/seo-metric-card";
import { TodaysAppointments } from "@/components/dashboard/todays-appointments";
import { SEOWinsFeed } from "@/components/dashboard/seo-wins-feed";
import { SystemHealth } from "@/components/dashboard/system-health";

// Mock data
const mockSparklineData = [
    { value: 20 },
    { value: 35 },
    { value: 28 },
    { value: 45 },
    { value: 38 },
    { value: 52 },
    { value: 48 },
];

const mockAppointments = [
    {
        id: "1",
        time: "9:00 AM",
        client: "John Smith",
        service: "Pressure Washing - Driveway",
        zone: "Zone A",
    },
    {
        id: "2",
        time: "11:30 AM",
        client: "Sarah Johnson",
        service: "Window Cleaning - Residential",
        zone: "Zone B",
        weatherHold: true,
    },
    {
        id: "3",
        time: "2:00 PM",
        client: "Mike Davis",
        service: "Gutter Cleaning",
        zone: "Zone A",
    },
];

const mockSEOWins = [
    {
        id: "1",
        type: "rank" as const,
        title: "Keyword Ranking Improved",
        description: '"pressure washing near me" jumped from #8 to #3',
        page: "/services/pressure-washing",
        timeAgo: "2h ago",
    },
    {
        id: "2",
        type: "backlink" as const,
        title: "New High-Quality Backlink",
        description: "Featured on HomeServicesPro.com (DA: 65)",
        page: "/blog/winter-maintenance-tips",
        timeAgo: "5h ago",
    },
    {
        id: "3",
        type: "resolved" as const,
        title: "Core Web Vitals Improved",
        description: "LCP reduced from 3.2s to 1.8s across 12 pages",
        timeAgo: "1d ago",
    },
];

const mockSystemHealth = [
    {
        id: "1",
        name: "Database",
        status: "healthy" as const,
        lastChecked: "2 min ago",
        icon: Database01,
    },
    {
        id: "2",
        name: "API Server",
        status: "healthy" as const,
        lastChecked: "2 min ago",
        icon: Server01,
    },
    {
        id: "3",
        name: "Storage",
        status: "warning" as const,
        lastChecked: "5 min ago",
        icon: HardDrive,
    },
    {
        id: "4",
        name: "Backups",
        status: "healthy" as const,
        lastChecked: "1h ago",
        icon: Cloud01,
    },
];

export default function DashboardPage() {
    return (
        <AppLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="mt-2 text-slate-400">
                    Welcome back! Here's what's happening with your business today.
                </p>
            </div>

            {/* CRM KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <KPICard
                    title="New Leads"
                    value="24"
                    delta={{ value: 12.5, type: "increase" }}
                    sparklineData={mockSparklineData}
                    icon={Users01}
                    onClick={() => console.log("Navigate to leads")}
                />

                <KPICard
                    title="Revenue (30d)"
                    value="$45,231"
                    delta={{ value: 8.3, type: "increase" }}
                    sparklineData={mockSparklineData}
                    icon={CurrencyDollar}
                    onClick={() => console.log("Navigate to revenue")}
                />

                <KPICard
                    title="Jobs Completed"
                    value="156"
                    delta={{ value: 5.2, type: "increase" }}
                    sparklineData={mockSparklineData}
                    icon={CheckCircle}
                />

                <KPICard
                    title="Conversion Rate"
                    value="68%"
                    delta={{ value: 3.1, type: "decrease" }}
                    sparklineData={mockSparklineData}
                    icon={TrendUp01}
                />
            </div>

            {/* SEO Metrics Row */}
            <div className="mt-6">
                <h2 className="mb-4 text-xl font-semibold text-white">SEO Health</h2>
                <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">
                    <SEOMetricCard
                        title="Site Health"
                        value="98%"
                        status="positive"
                        icon={Shield01}
                        onClick={() => console.log("Navigate to SEO health")}
                    />

                    <SEOMetricCard
                        title="Index Coverage"
                        value="247"
                        status="positive"
                        subtitle="pages indexed"
                        icon={Database01}
                    />

                    <SEOMetricCard
                        title="CWV Pass"
                        value="89%"
                        status="warning"
                        subtitle="core web vitals"
                        icon={ChartIcon}
                    />

                    <SEOMetricCard
                        title="Citations"
                        value="42"
                        status="positive"
                        subtitle="local listings"
                        icon={Globe01}
                    />

                    <SEOMetricCard
                        title="Backlinks"
                        value="+8"
                        status="positive"
                        subtitle="this month"
                        icon={Globe01}
                    />

                    <SEOMetricCard
                        title="Rank Movement"
                        value="+12"
                        status="positive"
                        subtitle="avg positions"
                        icon={TrendUp01}
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <TodaysAppointments appointments={mockAppointments} />
                <SEOWinsFeed wins={mockSEOWins} />
            </div>

            {/* System Health */}
            <div className="mt-6">
                <SystemHealth services={mockSystemHealth} />
            </div>
        </AppLayout>
    );
}
