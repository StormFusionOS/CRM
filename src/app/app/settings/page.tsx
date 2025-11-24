"use client";

import { useState } from "react";
import {
    Building05,
    Users01,
    Link03,
    Database01,
    Edit05,
    ShoppingBag01,
    MessageChatCircle,
    ShieldTick,
    CloudSnowing01,
    CreditCard01,
    Settings01,
    Upload01,
    Eye,
    EyeOff,
    RefreshCcw01,
    CheckCircle,
    Save01,
} from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type SettingsSection =
    | "company"
    | "users"
    | "integrations"
    | "database"
    | "internal-linking"
    | "upsell"
    | "citations"
    | "compliance"
    | "zones"
    | "deposits"
    | "review-mode";

const sections = [
    { id: "company" as const, label: "Company Info", icon: Building05 },
    { id: "users" as const, label: "Users & Roles", icon: Users01 },
    { id: "integrations" as const, label: "Integrations", icon: Link03 },
    { id: "database" as const, label: "Database & Sync", icon: Database01 },
    { id: "internal-linking" as const, label: "Internal Linking", icon: Edit05 },
    { id: "upsell" as const, label: "Cross-Sell & Upsell", icon: ShoppingBag01 },
    { id: "citations" as const, label: "Citations & Reviews", icon: MessageChatCircle },
    { id: "compliance" as const, label: "Compliance & Security", icon: ShieldTick },
    { id: "zones" as const, label: "Zones & Weather", icon: CloudSnowing01 },
    { id: "deposits" as const, label: "Deposits", icon: CreditCard01 },
    { id: "review-mode" as const, label: "Review vs Auto Mode", icon: Settings01 },
];

const mockUsers = [
    { id: 1, name: "John Doe", email: "john@company.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@company.com", role: "Dispatcher", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Technician", status: "Invited" },
];

const seoModules = [
    { id: "render-check", label: "Render Check" },
    { id: "citations-auditor", label: "Citations Auditor" },
    { id: "backlink-monitor", label: "Backlink Monitor" },
    { id: "social-amplification", label: "Social Amplification" },
    { id: "analytics-anomaly", label: "Analytics Anomaly Explainer" },
    { id: "accessibility-gate", label: "Accessibility/Quality Gate" },
    { id: "security-hygiene", label: "Security Hygiene" },
    { id: "serp-sampler", label: "SERP Sampler" },
    { id: "cron-scheduler", label: "Cron Scheduler" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSection>("company");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AppLayout
            title="Settings"
            description="Configure company settings, integrations, and operational rules"
        >
            <div className="flex gap-6">
                {/* Left Sidebar Navigation */}
                <div className="w-64 flex-shrink-0">
                    <nav className="space-y-1 rounded-lg border border-slate-800/50 bg-slate-900/40 p-2 backdrop-blur-xl">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cx(
                                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-sky-500/10 text-sky-400"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                    )}
                                >
                                    <Icon className="size-5" />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Company Info Section */}
                    {activeSection === "company" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Company Information</h2>

                                <div className="space-y-4">
                                    {/* Logo Upload */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Company Logo
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-20 items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/50">
                                                <Building05 className="size-8 text-slate-500" />
                                            </div>
                                            <Button color="secondary" size="sm" iconLeading={Upload01}>
                                                Upload Logo
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Business Name */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Acme Pressure Washing"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Timezone */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Timezone
                                        </label>
                                        <select className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
                                            <option>Eastern Time (ET)</option>
                                            <option>Central Time (CT)</option>
                                            <option>Mountain Time (MT)</option>
                                            <option>Pacific Time (PT)</option>
                                        </select>
                                    </div>

                                    {/* Contact Email */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue="info@acme.com"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            defaultValue="(555) 123-4567"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users & Roles Section */}
                    {activeSection === "users" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">Users & Roles</h2>
                                    <Button color="primary" size="sm">
                                        Invite User
                                    </Button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-800">
                                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Name
                                                </th>
                                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Email
                                                </th>
                                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Role
                                                </th>
                                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Status
                                                </th>
                                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {mockUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="py-3 text-sm text-white">{user.name}</td>
                                                    <td className="py-3 text-sm text-slate-400">{user.email}</td>
                                                    <td className="py-3 text-sm text-slate-300">{user.role}</td>
                                                    <td className="py-3">
                                                        <span
                                                            className={cx(
                                                                "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
                                                                user.status === "Active"
                                                                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                                                                    : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                                            )}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Button color="tertiary" size="sm">
                                                            Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations Section */}
                    {activeSection === "integrations" && (
                        <div className="space-y-6">
                            {/* Third-Party Integrations */}
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Third-Party Integrations</h2>

                                <div className="space-y-4">
                                    {[
                                        { name: "WordPress REST API", key: "wordpress_api_key" },
                                        { name: "IndexNow", key: "indexnow_key" },
                                        { name: "Facebook Lead Ads", key: "fb_lead_ads_token" },
                                        { name: "Google Ads", key: "google_ads_key" },
                                        { name: "Twilio", key: "twilio_auth_token" },
                                        { name: "Amazon SES", key: "aws_ses_key" },
                                        { name: "Square", key: "square_token" },
                                        { name: "QuickBooks Online", key: "qbo_token" },
                                    ].map((integration) => (
                                        <div key={integration.key} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="mb-1 block text-sm font-medium text-slate-200">
                                                    {integration.name}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter API key or token"
                                                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                    />
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="size-4" />
                                                        ) : (
                                                            <Eye className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center pt-6">
                                                <label className="relative inline-flex cursor-pointer items-center">
                                                    <input type="checkbox" className="peer sr-only" />
                                                    <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900"></div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SEO Modules */}
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">SEO Modules</h2>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {seoModules.map((module) => (
                                        <div
                                            key={module.id}
                                            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3"
                                        >
                                            <span className="text-sm font-medium text-slate-200">{module.label}</span>
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input type="checkbox" defaultChecked className="peer sr-only" />
                                                <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Database & Sync Section */}
                    {activeSection === "database" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">
                                    Database & Synchronisation
                                </h2>

                                <div className="space-y-4">
                                    {/* Connection String */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Primary Connection String
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                defaultValue="postgresql://user:****@host:5432/db"
                                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pr-10 font-mono text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                            >
                                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Replication Status */}
                                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-200">
                                                Replication Status
                                            </span>
                                            <span className="flex items-center gap-2 text-sm text-green-400">
                                                <CheckCircle className="size-4" />
                                                Healthy
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-xs text-slate-400">
                                            <div className="flex justify-between">
                                                <span>Last Sync:</span>
                                                <span>2 minutes ago</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Records Synced:</span>
                                                <span>15,234</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manual Sync Button */}
                                    <div className="flex justify-end">
                                        <Button color="secondary" iconLeading={RefreshCcw01}>
                                            Trigger Manual Sync
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Internal Linking Section */}
                    {activeSection === "internal-linking" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">
                                    Internal Linking & Content Refresh
                                </h2>

                                <div className="space-y-4">
                                    {/* Threshold Sliders */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Link Density Threshold (%)
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            defaultValue="30"
                                            className="w-full accent-sky-500"
                                        />
                                        <div className="mt-1 flex justify-between text-xs text-slate-400">
                                            <span>0%</span>
                                            <span>30%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Content Age for Refresh (days)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="90"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Auto-task Creation Toggle */}
                                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                                        <span className="text-sm font-medium text-slate-200">
                                            Auto-create refresh tasks
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" defaultChecked className="peer sr-only" />
                                            <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cross-Sell & Upsell Section */}
                    {activeSection === "upsell" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Cross-Sell & Upsell Rules</h2>

                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">
                                        Configure which add-ons are recommended for each service and set default
                                        discounts.
                                    </p>

                                    {/* Example Service + Add-ons */}
                                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                        <div className="mb-3 text-sm font-semibold text-white">
                                            Pressure Washing → Recommended Add-ons
                                        </div>
                                        <div className="space-y-2">
                                            {["Gutter Cleaning", "Window Cleaning", "Deck Staining"].map((addon) => (
                                                <div key={addon} className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-sm text-slate-300">
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked
                                                            className="size-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                        />
                                                        {addon}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        defaultValue="10"
                                                        placeholder="Discount %"
                                                        className="w-20 rounded-lg border border-slate-700 bg-slate-800/50 px-2 py-1 text-xs text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Citations & Reviews Section */}
                    {activeSection === "citations" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">
                                    Citation & Review Profile URLs
                                </h2>

                                <div className="space-y-4">
                                    {["Google Business Profile", "Yelp", "Bing Places"].map((platform) => (
                                        <div key={platform}>
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                {platform} URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder={`https://${platform.toLowerCase().replace(/\s+/g, "")}.com/...`}
                                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            />
                                        </div>
                                    ))}

                                    {/* Embed in Lead Details Toggle */}
                                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                                        <span className="text-sm font-medium text-slate-200">
                                            Show in lead detail sidebar
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" defaultChecked className="peer sr-only" />
                                            <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Compliance & Security Section */}
                    {activeSection === "compliance" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Compliance & Security Checks</h2>

                                <div className="space-y-4">
                                    {/* Accessibility Checks */}
                                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                        <h3 className="mb-3 text-sm font-semibold text-white">Accessibility Checks</h3>
                                        <div className="space-y-2">
                                            {[
                                                "WCAG 2.1 Level A",
                                                "WCAG 2.1 Level AA",
                                                "Color Contrast Ratio",
                                                "Keyboard Navigation",
                                            ].map((check) => (
                                                <label key={check} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="size-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                    />
                                                    {check}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security Checks */}
                                    <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                                        <h3 className="mb-3 text-sm font-semibold text-white">Security Checks</h3>
                                        <div className="space-y-2">
                                            {["HTTPS Enforcement", "Content Security Policy", "XSS Protection", "SQL Injection Scan"].map(
                                                (check) => (
                                                    <label
                                                        key={check}
                                                        className="flex items-center gap-2 text-sm text-slate-300"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked
                                                            className="size-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                        />
                                                        {check}
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Severity Threshold */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Minimum Severity to Block Publish
                                        </label>
                                        <select className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
                                            <option>Critical</option>
                                            <option>High</option>
                                            <option>Medium</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Zones & Weather Section */}
                    {activeSection === "zones" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Zones & Weather Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Freeze Day Temperature Threshold (°F)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="32"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Rain Delay Hours
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="24"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Auto-reschedule Toggle */}
                                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                                        <span className="text-sm font-medium text-slate-200">
                                            Auto-reschedule on weather holds
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" defaultChecked className="peer sr-only" />
                                            <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Deposits Section */}
                    {activeSection === "deposits" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Deposit Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Minimum Deposit Percentage (%)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="25"
                                            min="0"
                                            max="100"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Minimum Job Amount to Require Deposit ($)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="500"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Auto-require Deposit Toggle */}
                                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3">
                                        <span className="text-sm font-medium text-slate-200">
                                            Auto-require deposit on large jobs
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" defaultChecked className="peer sr-only" />
                                            <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review vs Auto Mode Section */}
                    {activeSection === "review-mode" && (
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Review vs Auto Mode</h2>

                                <p className="mb-4 text-sm text-slate-400">
                                    Configure which modules require human review before publishing changes.
                                </p>

                                <div className="space-y-3">
                                    {[
                                        { label: "Messaging (SMS/Email)", key: "messaging" },
                                        { label: "SEO Title/Meta Changes", key: "seo-meta" },
                                        { label: "Schema Markup", key: "schema" },
                                        { label: "FAQ Generation", key: "faq" },
                                        { label: "Internal Linking", key: "internal-linking" },
                                        { label: "Citation Updates", key: "citations" },
                                    ].map((module) => (
                                        <div
                                            key={module.key}
                                            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-3"
                                        >
                                            <span className="text-sm font-medium text-slate-200">{module.label}</span>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={module.key}
                                                        defaultChecked
                                                        className="size-4 border-slate-600 bg-slate-700 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                    />
                                                    <span className="text-sm text-slate-300">Review</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={module.key}
                                                        className="size-4 border-slate-600 bg-slate-700 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                    />
                                                    <span className="text-sm text-slate-300">Auto</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button color="primary" iconLeading={Save01}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
