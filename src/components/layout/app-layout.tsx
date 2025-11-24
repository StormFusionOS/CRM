"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950/80">
            {/* Hexagonal grid background */}
            <div className="pointer-events-none fixed inset-0 opacity-5">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="hex-grid-dashboard" width="50" height="43.3" patternUnits="userSpaceOnUse">
                            <path
                                d="M15 0 L35 0 L45 17.32 L35 34.64 L15 34.64 L5 17.32 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.8"
                                className="text-sky-400"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hex-grid-dashboard)" />
                </svg>
            </div>

            <Topbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-4 lg:p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
