'use client';

import { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from '@untitledui/icons';
import type { Lead, LeadStatus } from '@/types/lead';
import { LeadCard } from './lead-card';
import { useUpdateLead } from '../api/queries';

interface LeadsKanbanProps {
    leadsByStatus: Record<LeadStatus, Lead[]>;
    onLeadClick?: (lead: Lead) => void;
    onCreateLead?: (status: LeadStatus) => void;
}

const statusConfig: Record<LeadStatus, { title: string; color: string }> = {
    new: { title: 'New Leads', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    contacted: { title: 'Contacted', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    qualified: { title: 'Qualified', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    quoted: { title: 'Quoted', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    won: { title: 'Won', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    lost: { title: 'Lost', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    nurture: { title: 'Nurture', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
};

export function LeadsKanban({ leadsByStatus, onLeadClick, onCreateLead }: LeadsKanbanProps) {
    const [activeLead, setActiveLead] = useState<Lead | null>(null);
    const updateLead = useUpdateLead();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const leadIds = useMemo(() => {
        return Object.values(leadsByStatus).flat().map((lead) => lead.id);
    }, [leadsByStatus]);

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const lead = Object.values(leadsByStatus)
            .flat()
            .find((l) => l.id === active.id);
        setActiveLead(lead || null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) {
            setActiveLead(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Check if over is a status column (not a lead)
        const isOverStatus = Object.keys(statusConfig).includes(overId);

        if (isOverStatus) {
            const newStatus = overId as LeadStatus;
            const lead = Object.values(leadsByStatus)
                .flat()
                .find((l) => l.id === activeId);

            if (lead && lead.status !== newStatus) {
                // Update lead status via API
                updateLead.mutate({
                    id: activeId,
                    data: { status: newStatus },
                });
            }
        }

        setActiveLead(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4">
                {(Object.keys(statusConfig) as LeadStatus[]).map((status) => {
                    const config = statusConfig[status];
                    const leads = leadsByStatus[status] || [];

                    return (
                        <div
                            key={status}
                            id={status}
                            className="flex-shrink-0 w-80 flex flex-col"
                        >
                            {/* Column Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-white">
                                        {config.title}
                                    </h3>
                                    <span className={`
                                        px-2 py-0.5 rounded text-xs font-medium border
                                        ${config.color}
                                    `}>
                                        {leads.length}
                                    </span>
                                </div>
                                {onCreateLead && (
                                    <button
                                        onClick={() => onCreateLead(status)}
                                        className="p-1.5 rounded-md hover:bg-slate-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 text-slate-400" />
                                    </button>
                                )}
                            </div>

                            {/* Drop Zone */}
                            <SortableContext
                                items={leads.map((l) => l.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div
                                    data-status={status}
                                    className="flex-1 min-h-[200px] space-y-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                                >
                                    {leads.length === 0 ? (
                                        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
                                            No leads in this stage
                                        </div>
                                    ) : (
                                        leads.map((lead) => (
                                            <LeadCard
                                                key={lead.id}
                                                lead={lead}
                                                onClick={() => onLeadClick?.(lead)}
                                            />
                                        ))
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    );
                })}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeLead ? (
                    <div className="rotate-3">
                        <LeadCard lead={activeLead} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
