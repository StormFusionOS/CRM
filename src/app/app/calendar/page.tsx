"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "@untitledui/icons";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/base/buttons/button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { format } from "date-fns";

// Mock job events
const mockEvents = [
    {
        id: "1",
        title: "John Smith - Pressure Washing",
        start: new Date(2025, 10, 24, 9, 0),
        end: new Date(2025, 10, 24, 12, 0),
        backgroundColor: "#0ea5e9",
        borderColor: "#0284c7",
        extendedProps: {
            customer: "John Smith",
            service: "Pressure Washing",
            zone: "Zone A",
            status: "scheduled",
        },
    },
    {
        id: "2",
        title: "Sarah Johnson - Window Cleaning",
        start: new Date(2025, 10, 24, 13, 0),
        end: new Date(2025, 10, 24, 15, 0),
        backgroundColor: "#f59e0b",
        borderColor: "#d97706",
        extendedProps: {
            customer: "Sarah Johnson",
            service: "Window Cleaning",
            zone: "Zone B",
            status: "in-progress",
            weatherHold: true,
        },
    },
    {
        id: "3",
        title: "Mike Davis - Gutter Cleaning",
        start: new Date(2025, 10, 25, 10, 0),
        end: new Date(2025, 10, 25, 12, 30),
        backgroundColor: "#10b981",
        borderColor: "#059669",
        extendedProps: {
            customer: "Mike Davis",
            service: "Gutter Cleaning",
            zone: "Zone A",
            status: "completed",
        },
    },
];

type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

export default function CalendarPage() {
    const [currentView, setCurrentView] = useState<CalendarView>("timeGridWeek");
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleDateClick = (arg: any) => {
        console.log("Date clicked:", arg.dateStr);
        // Open create job modal
    };

    const handleEventClick = (clickInfo: any) => {
        console.log("Event clicked:", clickInfo.event);
        // Open edit job modal
    };

    const handleEventDrop = (dropInfo: any) => {
        console.log("Event dropped:", dropInfo);
        // Update job schedule via API
    };

    return (
        <AppLayout>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Calendar</h1>
                    <p className="mt-2 text-slate-400">
                        Manage jobs and schedule appointments
                    </p>
                </div>

                <Button
                    color="primary"
                    size="md"
                    iconLeading={Plus}
                >
                    New Job
                </Button>
            </div>

            {/* Calendar Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-500/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                {/* Date Navigation */}
                <div className="flex items-center gap-3">
                    <Button
                        color="tertiary"
                        size="sm"
                        iconLeading={ChevronLeft}
                        onClick={() => {
                            const newDate = new Date(currentDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setCurrentDate(newDate);
                        }}
                    />

                    <div className="flex items-center gap-2">
                        <CalendarIcon className="size-5 text-slate-400" />
                        <span className="text-lg font-semibold text-white">
                            {format(currentDate, "MMMM yyyy")}
                        </span>
                    </div>

                    <Button
                        color="tertiary"
                        size="sm"
                        iconLeading={ChevronRight}
                        onClick={() => {
                            const newDate = new Date(currentDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentDate(newDate);
                        }}
                    />

                    <Button
                        color="secondary"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Today
                    </Button>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <Button
                        color={currentView === "timeGridDay" ? "primary" : "tertiary"}
                        size="sm"
                        onClick={() => setCurrentView("timeGridDay")}
                    >
                        Day
                    </Button>
                    <Button
                        color={currentView === "timeGridWeek" ? "primary" : "tertiary"}
                        size="sm"
                        onClick={() => setCurrentView("timeGridWeek")}
                    >
                        Week
                    </Button>
                    <Button
                        color={currentView === "dayGridMonth" ? "primary" : "tertiary"}
                        size="sm"
                        onClick={() => setCurrentView("dayGridMonth")}
                    >
                        Month
                    </Button>
                </div>
            </div>

            {/* Calendar */}
            <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        resourceTimelinePlugin,
                    ]}
                    initialView={currentView}
                    initialDate={currentDate}
                    headerToolbar={false}
                    events={mockEvents}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    height="auto"
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    nowIndicator={true}
                    eventContent={(eventInfo) => {
                        return (
                            <div className="p-1">
                                <div className="text-xs font-medium">
                                    {eventInfo.timeText}
                                </div>
                                <div className="text-xs">
                                    {eventInfo.event.extendedProps.customer}
                                </div>
                                <div className="text-xs opacity-75">
                                    {eventInfo.event.extendedProps.service}
                                </div>
                            </div>
                        );
                    }}
                />
            </div>

            <style jsx global>{`
                .fc {
                    --fc-border-color: rgb(71 85 105 / 0.3);
                    --fc-button-bg-color: rgb(14 165 233);
                    --fc-button-border-color: rgb(2 132 199);
                    --fc-button-hover-bg-color: rgb(2 132 199);
                    --fc-button-hover-border-color: rgb(3 105 161);
                    --fc-button-active-bg-color: rgb(3 105 161);
                    --fc-button-active-border-color: rgb(7 89 133);
                    --fc-today-bg-color: rgb(14 165 233 / 0.1);
                }

                .fc .fc-button {
                    text-transform: capitalize;
                    font-weight: 600;
                    font-size: 0.875rem;
                    padding: 0.5rem 1rem;
                }

                .fc .fc-toolbar-title {
                    color: rgb(255 255 255);
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .fc-theme-standard td,
                .fc-theme-standard th {
                    border-color: rgb(71 85 105 / 0.3);
                }

                .fc-theme-standard .fc-scrollgrid {
                    border-color: rgb(71 85 105 / 0.3);
                }

                .fc .fc-daygrid-day-number,
                .fc .fc-col-header-cell-cushion {
                    color: rgb(226 232 240);
                    text-decoration: none;
                }

                .fc .fc-timegrid-slot-label {
                    color: rgb(148 163 184);
                }

                .fc .fc-event {
                    border-radius: 0.375rem;
                    padding: 0.25rem;
                    font-size: 0.875rem;
                }

                .fc .fc-event-main {
                    color: white;
                }

                .fc-day-today {
                    background-color: rgb(14 165 233 / 0.05) !important;
                }
            `}</style>
        </AppLayout>
    );
}
