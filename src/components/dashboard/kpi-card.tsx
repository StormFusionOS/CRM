"use client";

import { motion } from "motion/react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { ComponentType } from "react";
import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface KPICardProps {
    title: string;
    value: string | number;
    delta?: {
        value: number;
        type: "increase" | "decrease";
    };
    sparklineData?: Array<{ value: number }>;
    icon?: ComponentType<{ className?: string }>;
    onClick?: () => void;
}

export function KPICard({ title, value, delta, sparklineData, icon: Icon, onClick }: KPICardProps) {
    const isPositive = delta?.type === "increase";
    const isNegative = delta?.type === "decrease";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={cx(
                "group relative overflow-hidden rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 shadow-xl shadow-sky-900/40 backdrop-blur-xl transition-all",
                onClick && "cursor-pointer hover:border-sky-500/30 hover:shadow-sky-900/60",
            )}
        >
            {/* Icon */}
            {Icon && (
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-sky-500/10">
                    <Icon className="size-6 text-sky-400" />
                </div>
            )}

            {/* Title */}
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>

            {/* Value */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-3xl font-bold text-white"
            >
                {value}
            </motion.p>

            {/* Delta badge */}
            {delta && (
                <div className="mt-3 flex items-center gap-2">
                    <div
                        className={cx(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            isPositive && "bg-green-500/10 text-green-400",
                            isNegative && "bg-red-500/10 text-red-400",
                        )}
                    >
                        {isPositive && <ArrowUp className="size-3" />}
                        {isNegative && <ArrowDown className="size-3" />}
                        {Math.abs(delta.value)}%
                    </div>
                    <span className="text-xs text-slate-500">vs last period</span>
                </div>
            )}

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 0 && (
                <div className="mt-4 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#38bdf8"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Hover effect overlay */}
            {onClick && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-500/0 opacity-0 transition-opacity group-hover:from-sky-500/5 group-hover:to-blue-500/5 group-hover:opacity-100" />
            )}
        </motion.div>
    );
}
