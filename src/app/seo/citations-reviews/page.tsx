"use client";

import {
    CheckCircle,
    AlertCircle,
    XCircle,
    Star01,
    FileDownload02,
    LinkExternal02,
    Pin01,
    Building02,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";

interface Citation {
    id: number;
    siteName: string;
    tier: "A" | "B" | "C";
    status: "ok" | "inconsistent" | "missing";
    profileUrl?: string;
    issues: string[];
    lastAudited: Date;
    nap?: {
        name?: string;
        address?: string;
        phone?: string;
    };
}

interface Review {
    id: number;
    platform: string;
    author: string;
    rating: number;
    text: string;
    date: Date;
}

export default function CitationsReviewsPage() {
    // Mock summary data
    const citationsCoverage = 85; // % of Tier A sites with listings
    const averageRating = 4.7;
    const totalReviews = 342;
    const tierATotal = 20;
    const tierAListed = 17;

    // Mock citations data
    const citations: Citation[] = [
        {
            id: 1,
            siteName: "Google Business Profile",
            tier: "A",
            status: "ok",
            profileUrl: "https://business.google.com/...",
            issues: [],
            lastAudited: new Date("2025-11-20"),
            nap: {
                name: "ABC Pressure Washing",
                address: "123 Main St, City, ST 12345",
                phone: "(555) 123-4567",
            },
        },
        {
            id: 2,
            siteName: "Yelp",
            tier: "A",
            status: "inconsistent",
            profileUrl: "https://yelp.com/...",
            issues: ["Phone number mismatch", "Address formatting"],
            lastAudited: new Date("2025-11-18"),
            nap: {
                name: "ABC Pressure Washing",
                address: "123 Main Street, City, ST 12345",
                phone: "(555) 123-4568",
            },
        },
        {
            id: 3,
            siteName: "Facebook",
            tier: "A",
            status: "ok",
            profileUrl: "https://facebook.com/...",
            issues: [],
            lastAudited: new Date("2025-11-22"),
        },
        {
            id: 4,
            siteName: "Angie's List",
            tier: "A",
            status: "missing",
            issues: ["No listing found"],
            lastAudited: new Date("2025-11-19"),
        },
        {
            id: 5,
            siteName: "HomeAdvisor",
            tier: "B",
            status: "ok",
            profileUrl: "https://homeadvisor.com/...",
            issues: [],
            lastAudited: new Date("2025-11-21"),
        },
        {
            id: 6,
            siteName: "Thumbtack",
            tier: "B",
            status: "inconsistent",
            profileUrl: "https://thumbtack.com/...",
            issues: ["Name variation"],
            lastAudited: new Date("2025-11-17"),
        },
        {
            id: 7,
            siteName: "Yellow Pages",
            tier: "B",
            status: "ok",
            profileUrl: "https://yellowpages.com/...",
            issues: [],
            lastAudited: new Date("2025-11-16"),
        },
        {
            id: 8,
            siteName: "Nextdoor",
            tier: "C",
            status: "missing",
            issues: ["No listing found"],
            lastAudited: new Date("2025-11-15"),
        },
    ];

    // Mock reviews data
    const recentReviews: Review[] = [
        {
            id: 1,
            platform: "Google",
            author: "John Smith",
            rating: 5,
            text: "Excellent service! The team was professional and thorough. Highly recommend!",
            date: new Date("2025-11-23"),
        },
        {
            id: 2,
            platform: "Yelp",
            author: "Sarah Johnson",
            rating: 4,
            text: "Great work on my driveway. Would have been 5 stars if they arrived on time.",
            date: new Date("2025-11-22"),
        },
        {
            id: 3,
            platform: "Facebook",
            author: "Mike Davis",
            rating: 5,
            text: "Best pressure washing company in town. Very satisfied!",
            date: new Date("2025-11-21"),
        },
        {
            id: 4,
            platform: "Google",
            author: "Emily Brown",
            rating: 5,
            text: "They did an amazing job on our house. Looks brand new!",
            date: new Date("2025-11-20"),
        },
        {
            id: 5,
            platform: "Yelp",
            author: "Robert Wilson",
            rating: 3,
            text: "Service was okay, but a bit pricey for what we got.",
            date: new Date("2025-11-19"),
        },
    ];

    const getStatusBadge = (status: Citation["status"]) => {
        switch (status) {
            case "ok":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400 border border-green-500/20">
                        <CheckCircle className="h-3.5 w-3.5" />
                        OK
                    </span>
                );
            case "inconsistent":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Inconsistent
                    </span>
                );
            case "missing":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                        <XCircle className="h-3.5 w-3.5" />
                        Missing
                    </span>
                );
        }
    };

    const getTierBadge = (tier: Citation["tier"]) => {
        const colors = {
            A: "bg-sky-500/10 text-sky-400 border-sky-500/20",
            B: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            C: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        };

        return (
            <span
                className={cx(
                    "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border",
                    colors[tier]
                )}
            >
                Tier {tier}
            </span>
        );
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star01
                        key={star}
                        className={cx(
                            "h-4 w-4",
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-600"
                        )}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Local Citations & Reviews
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Track presence and consistency across citation directories
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2"
                    >
                        <FileDownload02 className="h-4 w-4" />
                        Export Citations
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Citations Coverage */}
                    <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl shadow-sky-900/40">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-sky-500/10 p-2.5">
                                <Building02 className="h-5 w-5 text-sky-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-400">Citations Coverage</p>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold text-white">
                                        {citationsCoverage}%
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {tierAListed}/{tierATotal} Tier A sites
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500"
                                style={{ width: `${citationsCoverage}%` }}
                            />
                        </div>
                    </div>

                    {/* Average Rating */}
                    <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl shadow-sky-900/40">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-500/10 p-2.5">
                                <Star01 className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-400">Average Rating</p>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold text-white">
                                        {averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-sm text-slate-500">out of 5.0</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            {renderStars(Math.round(averageRating))}
                        </div>
                    </div>

                    {/* Total Reviews */}
                    <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl shadow-sky-900/40">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-500/10 p-2.5">
                                <Pin01 className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-400">Total Reviews</p>
                                <div className="mt-1">
                                    <span className="text-3xl font-semibold text-white">
                                        {totalReviews}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-400">
                            Across all platforms
                        </div>
                    </div>
                </div>

                {/* Citations Table */}
                <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl shadow-xl shadow-sky-900/40 overflow-hidden">
                    <div className="border-b border-sky-500/10 bg-slate-900/60 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Citations Directory</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Local business listings across major directories
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-800 bg-slate-900/40 text-left text-xs font-medium text-slate-400">
                                <tr>
                                    <th className="px-6 py-3">Site Name</th>
                                    <th className="px-6 py-3">Tier</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Issues</th>
                                    <th className="px-6 py-3">Last Audited</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {citations.map((citation) => (
                                    <tr
                                        key={citation.id}
                                        className="hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white">
                                                    {citation.siteName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getTierBadge(citation.tier)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(citation.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {citation.issues.length > 0 ? (
                                                <div className="text-sm text-slate-300">
                                                    {citation.issues.slice(0, 2).join(", ")}
                                                    {citation.issues.length > 2 &&
                                                        ` +${citation.issues.length - 2} more`}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500">
                                                    No issues
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {format(citation.lastAudited, "MMM d, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {citation.profileUrl ? (
                                                <a
                                                    href={citation.profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
                                                >
                                                    View Profile
                                                    <LinkExternal02 className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-sm text-slate-500">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Reviews Stream */}
                <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 backdrop-blur-xl shadow-xl shadow-sky-900/40 overflow-hidden">
                    <div className="border-b border-sky-500/10 bg-slate-900/60 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Recent Reviews</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Latest customer feedback from all platforms
                        </p>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {recentReviews.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-white">
                                                {review.author}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                on {review.platform}
                                            </span>
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="mt-2 text-sm text-slate-300">
                                            {review.text}
                                        </p>
                                    </div>
                                    <span className="text-sm text-slate-400 whitespace-nowrap">
                                        {format(review.date, "MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
