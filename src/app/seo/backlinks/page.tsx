"use client";

import {
    Link05,
    Globe04,
    TrendUp01,
    Download01,
    FilterLines,
    Star01,
    CheckCircle,
    XCircle,
    FileSearch01,
    LinkExternal02,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";
import { useState } from "react";

interface ReferringDomain {
    id: number;
    domain: string;
    linksCount: number;
    inBodyLinksCount: number;
    authorityScore: number;
    lastSeen: Date;
    isPriority: boolean;
}

interface Backlink {
    id: number;
    sourceUrl: string;
    targetUrl: string;
    anchorText: string;
    type: "follow" | "nofollow";
    isAlive: boolean;
    firstSeen: Date;
    lastChecked: Date;
    domain: string;
}

type ActiveTab = "domains" | "backlinks";
type LinkTypeFilter = "all" | "follow" | "nofollow";
type AliveFilter = "all" | "alive" | "dead";

// Mock data
const referringDomains: ReferringDomain[] = [
    {
        id: 1,
        domain: "homeadvisor.com",
        linksCount: 5,
        inBodyLinksCount: 3,
        authorityScore: 92,
        lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isPriority: true,
    },
    {
        id: 2,
        domain: "yelp.com",
        linksCount: 3,
        inBodyLinksCount: 2,
        authorityScore: 88,
        lastSeen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isPriority: true,
    },
    {
        id: 3,
        domain: "angieslist.com",
        linksCount: 4,
        inBodyLinksCount: 4,
        authorityScore: 85,
        lastSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPriority: false,
    },
    {
        id: 4,
        domain: "bbb.org",
        linksCount: 2,
        inBodyLinksCount: 1,
        authorityScore: 90,
        lastSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isPriority: false,
    },
    {
        id: 5,
        domain: "local-business-directory.com",
        linksCount: 1,
        inBodyLinksCount: 1,
        authorityScore: 45,
        lastSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isPriority: false,
    },
];

const backlinks: Backlink[] = [
    {
        id: 1,
        sourceUrl: "https://homeadvisor.com/pressure-washing-services",
        targetUrl: "https://yourcompany.com",
        anchorText: "Best Pressure Washing in Springfield",
        type: "follow",
        isAlive: true,
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastChecked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        domain: "homeadvisor.com",
    },
    {
        id: 2,
        sourceUrl: "https://yelp.com/biz/your-company",
        targetUrl: "https://yourcompany.com/services",
        anchorText: "Visit Website",
        type: "nofollow",
        isAlive: true,
        firstSeen: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        lastChecked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        domain: "yelp.com",
    },
    {
        id: 3,
        sourceUrl: "https://homeadvisor.com/directory/services",
        targetUrl: "https://yourcompany.com/about",
        anchorText: "Professional Gutter Cleaning",
        type: "follow",
        isAlive: true,
        firstSeen: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        lastChecked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        domain: "homeadvisor.com",
    },
    {
        id: 4,
        sourceUrl: "https://angieslist.com/profile/your-company",
        targetUrl: "https://yourcompany.com",
        anchorText: "YourCompany.com",
        type: "follow",
        isAlive: false,
        firstSeen: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        domain: "angieslist.com",
    },
];

export default function SEOBacklinksPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("domains");
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [linkTypeFilter, setLinkTypeFilter] = useState<LinkTypeFilter>("all");
    const [aliveFilter, setAliveFilter] = useState<AliveFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const totalBacklinks = backlinks.filter((b) => b.isAlive).length;
    const totalDomains = referringDomains.length;
    const localAuthorityScore = 72;

    const filteredBacklinks = backlinks.filter((backlink) => {
        if (selectedDomain && backlink.domain !== selectedDomain) return false;
        if (linkTypeFilter !== "all" && backlink.type !== linkTypeFilter) return false;
        if (aliveFilter === "alive" && !backlink.isAlive) return false;
        if (aliveFilter === "dead" && backlink.isAlive) return false;
        if (
            searchQuery &&
            !backlink.sourceUrl.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !backlink.anchorText.toLowerCase().includes(searchQuery.toLowerCase())
        )
            return false;
        return true;
    });

    const filteredDomains = referringDomains.filter((domain) => {
        if (
            searchQuery &&
            !domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
        )
            return false;
        return true;
    });

    const togglePriority = (domainId: number) => {
        // In production, this would update the backend
        console.log("Toggle priority for domain:", domainId);
    };

    const handleDomainClick = (domain: string) => {
        setSelectedDomain(domain);
        setActiveTab("backlinks");
    };

    const clearFilters = () => {
        setSelectedDomain(null);
        setLinkTypeFilter("all");
        setAliveFilter("all");
        setSearchQuery("");
    };

    const handleExport = () => {
        // In production, this would trigger CSV/Excel export
        alert("Export functionality would download a CSV/Excel file with the current data");
    };

    const getAuthorityColor = (score: number) => {
        if (score >= 80) return "text-green-400 bg-green-500/10";
        if (score >= 60) return "text-sky-400 bg-sky-500/10";
        if (score >= 40) return "text-yellow-400 bg-yellow-500/10";
        return "text-red-400 bg-red-500/10";
    };

    const truncateUrl = (url: string, maxLength: number = 50) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + "...";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Backlinks & Referring Domains
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    Track your backlink profile and link-building opportunities
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Backlinks</p>
                            <p className="mt-2 text-3xl font-bold text-white">
                                {totalBacklinks}
                            </p>
                            <p className="mt-1 text-xs text-green-400">Live links only</p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-lg bg-sky-500/10">
                            <Link05 className="size-6 text-sky-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Referring Domains</p>
                            <p className="mt-2 text-3xl font-bold text-white">
                                {totalDomains}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">Unique sources</p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
                            <Globe04 className="size-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Local Authority Score</p>
                            <p className="mt-2 text-3xl font-bold text-white">
                                {localAuthorityScore}
                            </p>
                            <p className="mt-1 text-xs text-green-400">
                                +8 this month
                            </p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                            <TrendUp01 className="size-6 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs and Filters */}
            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
                {/* Tab Navigation */}
                <div className="border-b border-slate-800/50">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("domains")}
                                className={cx(
                                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                    activeTab === "domains"
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                Referring Domains ({totalDomains})
                            </button>
                            <button
                                onClick={() => setActiveTab("backlinks")}
                                className={cx(
                                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                    activeTab === "backlinks"
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                Backlinks ({filteredBacklinks.length})
                            </button>
                        </div>
                        <Button
                            color="secondary"
                            size="sm"
                            iconLeading={Download01}
                            onClick={handleExport}
                        >
                            Export
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="border-b border-slate-800/50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-2">
                            <div className="relative flex-1 max-w-md">
                                <FileSearch01 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={
                                        activeTab === "domains"
                                            ? "Search domains..."
                                            : "Search backlinks or anchor text..."
                                    }
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                />
                            </div>
                        </div>

                        {activeTab === "backlinks" && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={linkTypeFilter}
                                    onChange={(e) =>
                                        setLinkTypeFilter(e.target.value as LinkTypeFilter)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                >
                                    <option value="all">All Types</option>
                                    <option value="follow">Follow</option>
                                    <option value="nofollow">NoFollow</option>
                                </select>

                                <select
                                    value={aliveFilter}
                                    onChange={(e) =>
                                        setAliveFilter(e.target.value as AliveFilter)
                                    }
                                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                >
                                    <option value="all">All Status</option>
                                    <option value="alive">Live Only</option>
                                    <option value="dead">Dead Only</option>
                                </select>

                                {(selectedDomain ||
                                    linkTypeFilter !== "all" ||
                                    aliveFilter !== "all" ||
                                    searchQuery) && (
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedDomain && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3">
                            <FilterLines className="size-4 text-sky-400" />
                            <p className="text-sm text-sky-400">
                                Filtered by domain: <strong>{selectedDomain}</strong>
                            </p>
                            <button
                                onClick={() => setSelectedDomain(null)}
                                className="ml-auto text-xs text-sky-400 hover:text-sky-300"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Referring Domains Table */}
                {activeTab === "domains" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-800/50 bg-slate-900/60">
                                <tr>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Domain
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Links
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        In-Body Links
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Authority
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Last Seen
                                    </th>
                                    <th className="p-4 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredDomains.map((domain) => (
                                    <tr
                                        key={domain.id}
                                        className="transition-colors hover:bg-slate-800/30"
                                    >
                                        <td className="p-4">
                                            <button
                                                onClick={() =>
                                                    handleDomainClick(domain.domain)
                                                }
                                                className="flex items-center gap-2 text-sm font-medium text-sky-400 hover:text-sky-300"
                                            >
                                                {domain.isPriority && (
                                                    <Star01 className="size-4 fill-yellow-400 text-yellow-400" />
                                                )}
                                                {domain.domain}
                                                <LinkExternal02 className="size-3" />
                                            </button>
                                        </td>
                                        <td className="p-4 text-sm text-white">
                                            {domain.linksCount}
                                        </td>
                                        <td className="p-4 text-sm text-white">
                                            {domain.inBodyLinksCount}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={cx(
                                                    "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                                                    getAuthorityColor(
                                                        domain.authorityScore
                                                    )
                                                )}
                                            >
                                                {domain.authorityScore}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">
                                            {format(domain.lastSeen, "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                color="secondary"
                                                size="sm"
                                                iconLeading={Star01}
                                                onClick={() => togglePriority(domain.id)}
                                            >
                                                {domain.isPriority
                                                    ? "Remove"
                                                    : "Priority"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredDomains.length === 0 && (
                            <div className="p-12 text-center">
                                <Globe04 className="mx-auto mb-3 size-12 text-slate-600" />
                                <p className="text-slate-400">No domains found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Backlinks Table */}
                {activeTab === "backlinks" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-800/50 bg-slate-900/60">
                                <tr>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Source URL
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Anchor Text
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Type
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Status
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Last Checked
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredBacklinks.map((backlink) => (
                                    <tr
                                        key={backlink.id}
                                        className="transition-colors hover:bg-slate-800/30"
                                    >
                                        <td className="p-4">
                                            <a
                                                href={backlink.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300"
                                                title={backlink.sourceUrl}
                                            >
                                                {truncateUrl(backlink.sourceUrl)}
                                                <LinkExternal02 className="size-3" />
                                            </a>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {backlink.domain}
                                            </p>
                                        </td>
                                        <td className="p-4 text-sm text-white">
                                            {backlink.anchorText}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={cx(
                                                    "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                                                    backlink.type === "follow"
                                                        ? "bg-green-500/10 text-green-400"
                                                        : "bg-slate-500/10 text-slate-400"
                                                )}
                                            >
                                                {backlink.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {backlink.isAlive ? (
                                                    <>
                                                        <CheckCircle className="size-4 text-green-400" />
                                                        <span className="text-sm text-green-400">
                                                            Live
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="size-4 text-red-400" />
                                                        <span className="text-sm text-red-400">
                                                            Dead
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">
                                            {format(backlink.lastChecked, "MMM d, yyyy")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredBacklinks.length === 0 && (
                            <div className="p-12 text-center">
                                <Link05 className="mx-auto mb-3 size-12 text-slate-600" />
                                <p className="text-slate-400">No backlinks found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
