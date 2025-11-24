"use client";

import { Clock, MarkerPin01, User01, AlertCircle } from "@untitledui/icons";
import { motion } from "motion/react";
import { cx } from "@/utils/cx";

interface Appointment {
    id: string;
    time: string;
    client: string;
    service: string;
    zone: string;
    weatherHold?: boolean;
}

interface TodaysAppointmentsProps {
    appointments: Appointment[];
}

export function TodaysAppointments({ appointments }: TodaysAppointmentsProps) {
    return (
        <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Today's Appointments</h2>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-400">
                    {appointments.length} jobs
                </span>
            </div>

            <div className="space-y-3">
                {appointments.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No appointments scheduled for today</p>
                ) : (
                    appointments.map((appointment, index) => (
                        <motion.div
                            key={appointment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cx(
                                "group rounded-lg border p-4 transition-all hover:border-sky-500/30",
                                appointment.weatherHold
                                    ? "border-yellow-500/20 bg-yellow-500/5"
                                    : "border-slate-700/50 bg-slate-800/40",
                            )}
                        >
                            {/* Weather hold badge */}
                            {appointment.weatherHold && (
                                <div className="mb-2 flex items-center gap-2">
                                    <AlertCircle className="size-4 text-yellow-400" />
                                    <span className="text-xs font-medium text-yellow-400">Weather Hold</span>
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    {/* Time */}
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4 text-slate-400" />
                                        <span className="text-sm font-medium text-white">{appointment.time}</span>
                                    </div>

                                    {/* Client */}
                                    <div className="flex items-center gap-2">
                                        <User01 className="size-4 text-slate-400" />
                                        <span className="text-sm text-slate-300">{appointment.client}</span>
                                    </div>

                                    {/* Service */}
                                    <p className="text-xs text-slate-400">{appointment.service}</p>
                                </div>

                                {/* Zone badge */}
                                <div className="flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-1">
                                    <MarkerPin01 className="size-3 text-sky-400" />
                                    <span className="text-xs font-medium text-sky-400">{appointment.zone}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {appointments.length > 0 && (
                <button className="mt-4 w-full rounded-lg border border-sky-500/20 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-sky-500/10">
                    View Full Schedule →
                </button>
            )}
        </div>
    );
}
