"use client";

import { TrendUp01, Link03, Award01, CheckCircle } from "@untitledui/icons";
import { motion } from "motion/react";
import { cx } from "@/utils/cx";

interface SEOWin {
    id: string;
    type: "rank" | "backlink" | "citation" | "resolved";
    title: string;
    description: string;
    page?: string;
    timeAgo: string;
}

interface SEOWinsFeedProps {
    wins: SEOWin[];
}

const iconMap = {
    rank: TrendUp01,
    backlink: Link03,
    citation: Award01,
    resolved: CheckCircle,
};

const colorMap = {
    rank: "text-green-400 bg-green-500/10",
    backlink: "text-blue-400 bg-blue-500/10",
    citation: "text-purple-400 bg-purple-500/10",
    resolved: "text-sky-400 bg-sky-500/10",
};

export function SEOWinsFeed({ wins }: SEOWinsFeedProps) {
    return (
        <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">SEO Wins</h2>
                <span className="text-xs text-slate-400">Last 7 days</span>
            </div>

            <div className="space-y-4">
                {wins.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No recent SEO wins</p>
                ) : (
                    wins.map((win, index) => {
                        const Icon = iconMap[win.type];
                        const colorClass = colorMap[win.type];

                        return (
                            <motion.div
                                key={win.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group flex gap-4 rounded-lg border border-slate-700/50 bg-slate-800/40 p-4 transition-all hover:border-sky-500/30"
                            >
                                {/* Icon */}
                                <div className={cx("flex size-10 shrink-0 items-center justify-center rounded-lg", colorClass)}>
                                    <Icon className="size-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-white">{win.title}</h3>
                                    <p className="mt-1 text-xs text-slate-400">{win.description}</p>
                                    {win.page && (
                                        <p className="mt-2 truncate text-xs text-sky-400">
                                            {win.page}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <span className="shrink-0 text-xs text-slate-500">{win.timeAgo}</span>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {wins.length > 0 && (
                <button className="mt-4 w-full rounded-lg border border-sky-500/20 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-sky-500/10">
                    View All SEO Activity →
                </button>
            )}
        </div>
    );
}
