"use client";

import { useState } from "react";
import {
    File02,
    Edit02,
    Code02,
    CheckCircle,
    AlertTriangle,
    Calendar,
    Stars01,
    Save01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { format } from "date-fns";

interface Page {
    id: number;
    url: string;
    templateType: string;
    seoScore: number;
    issueCount: number;
    lastUpdated: Date;
}

interface PageContent {
    title: string;
    metaDescription: string;
    content: string;
    schemaOld: string;
    schemaNew: string;
}

export default function ContentSchemaWorkspacePage() {
    const [selectedPageId, setSelectedPageId] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<"content" | "meta" | "schema">("content");

    // Mock pages data
    const pages: Page[] = [
        {
            id: 1,
            url: "/services/pressure-washing",
            templateType: "Service Page",
            seoScore: 87,
            issueCount: 2,
            lastUpdated: new Date("2025-11-20"),
        },
        {
            id: 2,
            url: "/services/snow-removal",
            templateType: "Service Page",
            seoScore: 92,
            issueCount: 0,
            lastUpdated: new Date("2025-11-22"),
        },
        {
            id: 3,
            url: "/areas/boston",
            templateType: "Location Page",
            seoScore: 78,
            issueCount: 5,
            lastUpdated: new Date("2025-11-18"),
        },
        {
            id: 4,
            url: "/blog/pressure-washing-tips",
            templateType: "Blog Post",
            seoScore: 85,
            issueCount: 1,
            lastUpdated: new Date("2025-11-21"),
        },
    ];

    // Mock content data
    const pageContent: Record<number, PageContent> = {
        1: {
            title: "Professional Pressure Washing Services | Boston Area",
            metaDescription:
                "Expert pressure washing services for homes and businesses in Boston. Eco-friendly cleaning solutions, experienced team, and satisfaction guaranteed.",
            content: `# Professional Pressure Washing Services

Transform your property with our professional pressure washing services. We specialize in residential and commercial cleaning throughout the Boston area.

## Our Services
- House washing
- Driveway cleaning
- Deck and patio restoration
- Commercial building cleaning

## Why Choose Us
- 10+ years of experience
- Eco-friendly cleaning solutions
- Licensed and insured
- Satisfaction guaranteed`,
            schemaOld: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Pressure Washing",
  "provider": {
    "@type": "LocalBusiness",
    "name": "ABC Cleaning"
  }
}`,
            schemaNew: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Pressure Washing Services",
  "description": "Professional pressure washing for residential and commercial properties",
  "provider": {
    "@type": "LocalBusiness",
    "name": "ABC Cleaning Services",
    "areaServed": "Boston, MA"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock"
  }
}`,
        },
    };

    const selectedPage = pages.find((p) => p.id === selectedPageId);
    const content = pageContent[selectedPageId] || pageContent[1];

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-400 bg-green-500/10 border-green-500/20";
        if (score >= 70) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-400 bg-red-500/10 border-red-500/20";
    };

    return (
        <div className="flex h-screen bg-slate-950">
            {/* Left Sidebar - Page List */}
            <div className="w-96 border-r border-sky-500/10 bg-slate-900/40 backdrop-blur-xl overflow-y-auto">
                <div className="p-6 border-b border-sky-500/10">
                    <h2 className="text-lg font-semibold text-white">Pages</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Select a page to edit content and schema
                    </p>
                </div>

                <div className="divide-y divide-slate-800">
                    {pages.map((page) => (
                        <button
                            key={page.id}
                            onClick={() => setSelectedPageId(page.id)}
                            className={cx(
                                "w-full p-4 text-left hover:bg-slate-800/50 transition-colors",
                                selectedPageId === page.id && "bg-slate-800/70"
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {page.url}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {page.templateType}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span
                                        className={cx(
                                            "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border",
                                            getScoreColor(page.seoScore)
                                        )}
                                    >
                                        {page.seoScore}
                                    </span>
                                    {page.issueCount > 0 && (
                                        <span className="text-xs text-yellow-400">
                                            {page.issueCount} issues
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="h-3 w-3" />
                                {format(page.lastUpdated, "MMM d, yyyy")}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Panel - Editor Workspace */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-sky-500/10 bg-slate-900/40 backdrop-blur-xl px-6 py-4">
                    <div>
                        <h1 className="text-xl font-semibold text-white">
                            {selectedPage?.url}
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            {selectedPage?.templateType}
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Save01 className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border-b border-sky-500/10 bg-slate-900/60 px-6">
                    <button
                        onClick={() => setActiveTab("content")}
                        className={cx(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === "content"
                                ? "border-sky-500 text-sky-400"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                        )}
                    >
                        <Edit02 className="h-4 w-4" />
                        Content
                    </button>
                    <button
                        onClick={() => setActiveTab("meta")}
                        className={cx(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === "meta"
                                ? "border-sky-500 text-sky-400"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                        )}
                    >
                        <File02 className="h-4 w-4" />
                        Title & Meta
                    </button>
                    <button
                        onClick={() => setActiveTab("schema")}
                        className={cx(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === "schema"
                                ? "border-sky-500 text-sky-400"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                        )}
                    >
                        <Code02 className="h-4 w-4" />
                        Schema
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "content" && (
                        <div className="max-w-4xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-white">
                                    Page Content
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Stars01 className="h-4 w-4" />
                                    Generate with AI
                                </Button>
                            </div>
                            <textarea
                                className="w-full h-[600px] rounded-lg border border-sky-500/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono"
                                value={content.content}
                                readOnly
                            />
                        </div>
                    )}

                    {activeTab === "meta" && (
                        <div className="max-w-4xl space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-white">
                                        Page Title
                                    </label>
                                    <span
                                        className={cx(
                                            "text-xs",
                                            content.title.length <= 60
                                                ? "text-green-400"
                                                : "text-yellow-400"
                                        )}
                                    >
                                        {content.title.length} / 60 characters
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-sky-500/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    value={content.title}
                                    readOnly
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    Optimal length: 50-60 characters
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-white">
                                        Meta Description
                                    </label>
                                    <span
                                        className={cx(
                                            "text-xs",
                                            content.metaDescription.length <= 160
                                                ? "text-green-400"
                                                : "text-yellow-400"
                                        )}
                                    >
                                        {content.metaDescription.length} / 160 characters
                                    </span>
                                </div>
                                <textarea
                                    className="w-full h-24 rounded-lg border border-sky-500/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                    value={content.metaDescription}
                                    readOnly
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    Optimal length: 150-160 characters
                                </p>
                            </div>

                            <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 p-4">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>Title and description follow best practices</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "schema" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-white">
                                    Schema JSON-LD Diff
                                </h3>
                                <Button size="sm" className="gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Approve & Apply
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Old Schema */}
                                <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 overflow-hidden">
                                    <div className="border-b border-sky-500/10 bg-slate-900/60 px-4 py-2">
                                        <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                            Current Schema
                                        </h4>
                                    </div>
                                    <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto">
                                        {content.schemaOld}
                                    </pre>
                                </div>

                                {/* New Schema */}
                                <div className="rounded-lg border border-sky-500/10 bg-slate-900/40 overflow-hidden">
                                    <div className="border-b border-sky-500/10 bg-slate-900/60 px-4 py-2">
                                        <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            Proposed Schema
                                        </h4>
                                    </div>
                                    <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto">
                                        {content.schemaNew}
                                    </pre>
                                </div>
                            </div>

                            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Schema validation passed - Ready to apply</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
