"use client";

import { Bell02, SearchMd, Settings01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export function Topbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-sky-500/10 bg-slate-900/60 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
                {/* Logo / Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
                        <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="hidden text-xl font-bold text-white md:block">Home Service SaaS</span>
                </div>

                {/* Global Search */}
                <div className="mx-4 hidden flex-1 max-w-md lg:block">
                    <Input
                        type="search"
                        placeholder="Search..."
                        icon={SearchMd}
                        size="sm"
                        shortcut="⌘K"
                    />
                </div>

                {/* Spacer */}
                <div className="flex-1 lg:hidden" />

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    {/* Search button (mobile) */}
                    <Button
                        color="tertiary"
                        size="sm"
                        iconLeading={SearchMd}
                        className="lg:hidden"
                        aria-label="Search"
                    />

                    {/* Notifications */}
                    <Button
                        color="tertiary"
                        size="sm"
                        iconLeading={Bell02}
                        aria-label="Notifications"
                    />

                    {/* Settings */}
                    <Button
                        color="tertiary"
                        size="sm"
                        iconLeading={Settings01}
                        aria-label="Settings"
                    />

                    {/* User menu */}
                    <button
                        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/60"
                    >
                        <div className="size-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
                        <div className="hidden text-left md:block">
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-slate-400">admin@example.com</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
