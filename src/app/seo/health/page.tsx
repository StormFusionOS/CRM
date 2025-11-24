"use client";

import {
    Activity,
    AlertCircle,
    BarChart12,
    CheckCircle,
    TrendUp01,
    TrendDown01,
    Globe04,
    Link05,
    Share07,
    Eye,
    Shield03,
    Calendar,
    Zap,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";

interface Module {
    id: string;
    name: string;
    icon: React.ElementType;
    status: "ok" | "warning" | "error";
    metric: string;
    metricLabel: string;
    href: string;
}

interface AuditIssue {
    id: number;
    severity: "critical" | "warning" | "info";
    type: string;
    affectedPage: string;
    module: string;
    status: "open" | "in_progress" | "resolved";
}

interface SEOWin {
    id: number;
    type: "rank_jump" | "issue_resolved" | "new_backlink" | "new_citation";
    description: string;
    date: Date;
    impact: string;
}

export default function SEOHealthDashboardPage() {
    // Mock data - Top KPIs
    const healthScore = 87;
    const indexCoverage = 94;
    const cwvPassRate = 89;
    const a11yPassRate = 92;
    const localAuthorityScore = 78;

    // Mock data - Modules
    const modules: Module[] = [
        {
            id: "render",
            name: "Render & Performance",
            icon: Activity,
            status: "ok",
            metric: "89%",
            metricLabel: "CWV Pass Rate",
            href: "/seo/render",
        },
        {
            id: "citations",
            name: "Citations & Reviews",
            icon: BarChart12,
            status: "warning",
            metric: "127",
            metricLabel: "Active Citations",
            href: "/seo/citations-reviews",
        },
        {
            id: "backlinks",
            name: "Backlinks",
            icon: Link05,
            status: "ok",
            metric: "2,847",
            metricLabel: "Total Backlinks",
            href: "/seo/backlinks",
        },
        {
            id: "social",
            name: "Social Signals",
            icon: Share07,
            status: "ok",
            metric: "1.2K",
            metricLabel: "Monthly Shares",
            href: "/seo/social",
        },
        {
            id: "analytics",
            name: "Analytics",
            icon: Eye,
            status: "ok",
            metric: "12.4K",
            metricLabel: "Monthly Visits",
            href: "/seo/serp-rankings",
        },
        {
            id: "quality",
            name: "Accessibility & Quality",
            icon: CheckCircle,
            status: "ok",
            metric: "92%",
            metricLabel: "Pass Rate",
            href: "/seo/quality",
        },
        {
            id: "security",
            name: "Security",
            icon: Shield03,
            status: "ok",
            metric: "A+",
            metricLabel: "Security Score",
            href: "/seo/security",
        },
        {
            id: "serp",
            name: "SERP Rankings",
            icon: TrendUp01,
            status: "ok",
            metric: "47",
            metricLabel: "Top 10 Keywords",
            href: "/seo/serp-rankings",
        },
        {
            id: "scheduler",
            name: "Content Scheduler",
            icon: Calendar,
            status: "ok",
            metric: "5",
            metricLabel: "Pending Posts",
            href: "/seo/scheduler",
        },
    ];

    // Mock data - Audit Issues
    const auditIssues: AuditIssue[] = [
        {
            id: 1,
            severity: "critical",
            type: "Broken internal link",
            affectedPage: "/services/pressure-washing",
            module: "Render",
            status: "open",
        },
        {
            id: 2,
            severity: "warning",
            type: "Missing alt text",
            affectedPage: "/gallery",
            module: "Accessibility",
            status: "in_progress",
        },
        {
            id: 3,
            severity: "warning",
            type: "Slow page load",
            affectedPage: "/blog/spring-cleaning-tips",
            module: "Performance",
            status: "open",
        },
        {
            id: 4,
            severity: "info",
            type: "Missing meta description",
            affectedPage: "/contact",
            module: "SEO",
            status: "open",
        },
        {
            id: 5,
            severity: "critical",
            type: "Duplicate title tag",
            affectedPage: "/services/snow-removal",
            module: "SEO",
            status: "in_progress",
        },
    ];

    // Mock data - SEO Wins
    const seoWins: SEOWin[] = [
        {
            id: 1,
            type: "rank_jump",
            description: '"pressure washing service" jumped from #12 to #4',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            impact: "+237 impressions",
        },
        {
            id: 2,
            type: "new_backlink",
            description: "New backlink from homeadvisor.com (DA 91)",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            impact: "Authority +2",
        },
        {
            id: 3,
            type: "issue_resolved",
            description: "Fixed 15 broken internal links",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            impact: "Crawl efficiency +12%",
        },
        {
            id: 4,
            type: "new_citation",
            description: "Added to Yelp business directory",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            impact: "Local visibility +3%",
        },
    ];

    const getHealthScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400 bg-green-500/10 border-green-500/20";
        if (score >= 60) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-400 bg-red-500/10 border-red-500/20";
    };

    const getModuleStatusIcon = (status: Module["status"]) => {
        switch (status) {
            case "ok":
                return <CheckCircle className="size-5 text-green-400" />;
            case "warning":
                return <AlertCircle className="size-5 text-yellow-400" />;
            case "error":
                return <AlertCircle className="size-5 text-red-400" />;
        }
    };

    const getSeverityBadge = (severity: AuditIssue["severity"]) => {
        const styles = {
            critical: "bg-red-500/10 text-red-400 border-red-500/20",
            warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        };
        return (
            <span
                className={cx(
                    "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
                    styles[severity]
                )}
            >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
        );
    };

    const getStatusBadge = (status: AuditIssue["status"]) => {
        const styles = {
            open: "bg-slate-700 text-slate-300",
            in_progress: "bg-sky-500/10 text-sky-400 border-sky-500/20",
            resolved: "bg-green-500/10 text-green-400 border-green-500/20",
        };
        const labels = {
            open: "Open",
            in_progress: "In Progress",
            resolved: "Resolved",
        };
        return (
            <span
                className={cx(
                    "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
                    styles[status]
                )}
            >
                {labels[status]}
            </span>
        );
    };

    const getWinIcon = (type: SEOWin["type"]) => {
        switch (type) {
            case "rank_jump":
                return <TrendUp01 className="size-5 text-green-400" />;
            case "new_backlink":
                return <Link05 className="size-5 text-sky-400" />;
            case "issue_resolved":
                return <CheckCircle className="size-5 text-green-400" />;
            case "new_citation":
                return <BarChart12 className="size-5 text-purple-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">SEO Health Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Monitor your site's SEO performance and health metrics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Last 90 days</option>
                    </select>
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Top KPI Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Overall Health Score */}
                <div
                    className={cx(
                        "rounded-lg border p-6 backdrop-blur-xl",
                        getHealthScoreColor(healthScore)
                    )}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium opacity-80">Overall Health</p>
                        <Zap className="size-5 opacity-60" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-bold">{healthScore}</p>
                        <p className="text-lg mb-1 opacity-80">/100</p>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <TrendUp01 className="size-3" />
                        <span>+5 from last week</span>
                    </div>
                </div>

                {/* Index Coverage */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-400">Index Coverage</p>
                        <Globe04 className="size-5 text-slate-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-bold text-white">{indexCoverage}</p>
                        <p className="text-lg mb-1 text-slate-400">%</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">247 / 263 pages indexed</div>
                </div>

                {/* CWV Pass Rate */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-400">CWV Pass Rate</p>
                        <Activity className="size-5 text-slate-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-bold text-white">{cwvPassRate}</p>
                        <p className="text-lg mb-1 text-slate-400">%</p>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                        <TrendUp01 className="size-3" />
                        <span>+3% this month</span>
                    </div>
                </div>

                {/* Accessibility */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-400">Accessibility</p>
                        <CheckCircle className="size-5 text-slate-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-bold text-white">{a11yPassRate}</p>
                        <p className="text-lg mb-1 text-slate-400">%</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">WCAG 2.1 AA</div>
                </div>

                {/* Local Authority */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-400">Local Authority</p>
                        <BarChart12 className="size-5 text-slate-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-bold text-white">{localAuthorityScore}</p>
                        <p className="text-lg mb-1 text-slate-400">/100</p>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                        <TrendUp01 className="size-3" />
                        <span>+2 this week</span>
                    </div>
                </div>
            </div>

            {/* Module Cards Grid */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-white">Module Health</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <a
                                key={module.id}
                                href={module.href}
                                className="group rounded-lg border border-slate-800/50 bg-slate-900/40 p-5 backdrop-blur-xl transition-all hover:border-sky-500/30 hover:bg-slate-900/60"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="rounded-lg bg-sky-500/10 p-2.5 border border-sky-500/20">
                                        <Icon className="size-5 text-sky-400" />
                                    </div>
                                    {getModuleStatusIcon(module.status)}
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1">
                                    {module.name}
                                </h3>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-white">{module.metric}</p>
                                    <p className="text-sm text-slate-400 mb-0.5">{module.metricLabel}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Section - Audit Issues & SEO Wins */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Audit Issues Preview */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Recent Audit Issues</h2>
                        <a
                            href="/seo/audit-issues"
                            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                        >
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {auditIssues.map((issue) => (
                            <div
                                key={issue.id}
                                className="rounded-lg border border-slate-800/50 bg-slate-950/40 p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    {getSeverityBadge(issue.severity)}
                                    {getStatusBadge(issue.status)}
                                </div>
                                <p className="text-sm font-medium text-white mb-1">{issue.type}</p>
                                <p className="text-xs text-slate-400 mb-2">{issue.affectedPage}</p>
                                <p className="text-xs text-slate-500">Module: {issue.module}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SEO Wins Feed */}
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Recent SEO Wins</h2>
                        <Zap className="size-5 text-yellow-400" />
                    </div>
                    <div className="space-y-3">
                        {seoWins.map((win) => (
                            <div
                                key={win.id}
                                className="rounded-lg border border-slate-800/50 bg-slate-950/40 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">{getWinIcon(win.type)}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white mb-1">{win.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span>{format(win.date, "MMM d, yyyy")}</span>
                                            <span>•</span>
                                            <span className="text-green-400">{win.impact}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
