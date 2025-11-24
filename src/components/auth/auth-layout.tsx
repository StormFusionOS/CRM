"use client";

import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { BrandPanel } from "./brand-panel";

interface AuthLayoutProps {
    children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-slate-950/80">
            {/* Brand Panel - Desktop only */}
            <BrandPanel className="w-1/2" />

            {/* Auth Card Container */}
            <main className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
                {/* Mobile Logo - Hidden on desktop */}
                <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
                        <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white">Home Service SaaS</span>
                </div>

                {/* Auth Card */}
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-sky-500/10 bg-slate-900/60 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
                        <AnimatePresence mode="wait">{children}</AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{" "}
                            <a href="/auth/signup" className="font-medium text-sky-400 hover:text-sky-300 transition-colors">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
