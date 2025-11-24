"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
import { cx } from "@/utils/cx";

type SEOStatus = "positive" | "negative" | "warning" | "neutral";

interface SEOMetricCardProps {
    title: string;
    value: string | number;
    status: SEOStatus;
    subtitle?: string;
    icon?: ComponentType<{ className?: string }>;
    onClick?: () => void;
}

const statusStyles = {
    positive: {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        text: "text-green-400",
        icon: "text-green-400",
    },
    negative: {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-400",
        icon: "text-red-400",
    },
    warning: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        text: "text-yellow-400",
        icon: "text-yellow-400",
    },
    neutral: {
        bg: "bg-slate-500/10",
        border: "border-slate-500/20",
        text: "text-slate-400",
        icon: "text-slate-400",
    },
};

export function SEOMetricCard({ title, value, status, subtitle, icon: Icon, onClick }: SEOMetricCardProps) {
    const styles = statusStyles[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={cx(
                "group relative overflow-hidden rounded-xl border bg-slate-900/60 p-6 shadow-xl shadow-sky-900/40 backdrop-blur-xl transition-all",
                styles.border,
                onClick && "cursor-pointer hover:shadow-sky-900/60",
            )}
        >
            {/* Status indicator */}
            <div className={cx("absolute right-4 top-4 size-3 rounded-full", styles.bg)} />

            {/* Icon */}
            {Icon && (
                <div className={cx("mb-4 flex size-12 items-center justify-center rounded-lg", styles.bg)}>
                    <Icon className={cx("size-6", styles.icon)} />
                </div>
            )}

            {/* Title */}
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>

            {/* Value */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cx("mt-2 text-3xl font-bold", styles.text)}
            >
                {value}
            </motion.p>

            {/* Subtitle */}
            {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}

            {/* Hover effect overlay */}
            {onClick && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-500/0 opacity-0 transition-opacity group-hover:from-sky-500/5 group-hover:to-blue-500/5 group-hover:opacity-100" />
            )}
        </motion.div>
    );
}
