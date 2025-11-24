"use client";

import { Database01, Server01, HardDrive, Cloud01 } from "@untitledui/icons";
import { motion } from "motion/react";
import { cx } from "@/utils/cx";

type HealthStatus = "healthy" | "warning" | "down";

interface HealthService {
    id: string;
    name: string;
    status: HealthStatus;
    lastChecked: string;
    icon: typeof Database01;
}

interface SystemHealthProps {
    services: HealthService[];
}

const statusStyles = {
    healthy: {
        badge: "bg-green-500/10 text-green-400",
        dot: "bg-green-400",
    },
    warning: {
        badge: "bg-yellow-500/10 text-yellow-400",
        dot: "bg-yellow-400",
    },
    down: {
        badge: "bg-red-500/10 text-red-400",
        dot: "bg-red-400",
    },
};

export function SystemHealth({ services }: SystemHealthProps) {
    return (
        <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">System Health</h2>

            <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service, index) => {
                    const Icon = service.icon;
                    const styles = statusStyles[service.status];

                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/40 p-4"
                        >
                            {/* Icon */}
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-700/50">
                                <Icon className="size-5 text-slate-400" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white">{service.name}</h3>
                                <p className="text-xs text-slate-500">
                                    {service.lastChecked}
                                </p>
                            </div>

                            {/* Status */}
                            <div className={cx("flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium", styles.badge)}>
                                <div className={cx("size-1.5 rounded-full", styles.dot)} />
                                {service.status === "healthy" && "Healthy"}
                                {service.status === "warning" && "Warning"}
                                {service.status === "down" && "Down"}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
