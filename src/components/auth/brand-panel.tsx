"use client";

import { motion } from "motion/react";
import { cx } from "@/utils/cx";

interface BrandPanelProps {
    className?: string;
}

export function BrandPanel({ className }: BrandPanelProps) {
    return (
        <div
            className={cx(
                "relative hidden overflow-hidden rounded-2xl lg:flex lg:flex-col lg:justify-between",
                "bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950",
                "p-12",
                className,
            )}
        >
            {/* Hexagonal grid background */}
            <div className="pointer-events-none absolute inset-0 opacity-10">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="hex-grid" width="50" height="43.3" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
                            <path
                                d="M15 0 L35 0 L45 17.32 L35 34.64 L15 34.64 L5 17.32 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.8"
                                className="text-sky-400"
                            />
                            <path
                                d="M-10 0 L10 0 L20 17.32 L10 34.64 L-10 34.64 L-20 17.32 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.8"
                                className="text-sky-400"
                            />
                            <path
                                d="M40 0 L60 0 L70 17.32 L60 34.64 L40 34.64 L30 17.32 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.8"
                                className="text-sky-400"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hex-grid)" />
                </svg>
            </div>

            {/* Gradient overlay orbs */}
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    className="absolute -left-20 top-20 size-96 rounded-full bg-sky-500/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -right-20 bottom-20 size-96 rounded-full bg-blue-500/20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Logo placeholder - replace with actual logo */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
                        <svg className="size-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white">Home Service SaaS</span>
                </div>
            </div>

            {/* Value propositions */}
            <div className="relative z-10 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white">
                        Manage your home service business with ease
                    </h2>
                    <p className="text-lg text-slate-300">
                        All-in-one platform for scheduling, CRM, quotes, invoicing, and more. Built for field service professionals.
                    </p>
                </motion.div>

                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {[
                        { icon: "📅", text: "Smart scheduling & dispatch" },
                        { icon: "💰", text: "Quotes & invoicing in minutes" },
                        { icon: "📱", text: "Mobile-first for field teams" },
                        { icon: "🤖", text: "AI-powered assistance" },
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.text}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                        >
                            <div className="flex size-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                <span className="text-xl">{feature.icon}</span>
                            </div>
                            <span className="text-slate-200">{feature.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Testimonial or social proof */}
            <motion.div
                className="relative z-10 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <p className="mb-4 text-slate-200">
                    "This platform transformed how we run our pressure washing business. Scheduling is a breeze and our customers love the online
                    portal."
                </p>
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
                    <div>
                        <p className="font-semibold text-white">Sarah Johnson</p>
                        <p className="text-sm text-slate-400">CleanPro Services</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
