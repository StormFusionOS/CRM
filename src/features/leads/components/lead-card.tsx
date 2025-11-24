'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mail01, Phone, CurrencyDollar, Calendar, User01 } from '@untitledui/icons';
import type { Lead } from '@/types/lead';

interface LeadCardProps {
    lead: Lead;
    onClick?: () => void;
}

const priorityColors = {
    low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    urgent: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function LeadCard({ lead, onClick }: LeadCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`
                group relative rounded-lg border border-slate-700 bg-slate-900/60
                backdrop-blur-xl p-4 cursor-pointer transition-all
                hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10
                ${isDragging ? 'opacity-50 shadow-2xl shadow-blue-500/20' : ''}
            `}
        >
            {/* Priority Badge */}
            <div className="absolute top-2 right-2">
                <span className={`
                    px-2 py-0.5 rounded text-xs font-medium border
                    ${priorityColors[lead.priority]}
                `}>
                    {lead.priority}
                </span>
            </div>

            {/* Name */}
            <h3 className="text-sm font-semibold text-white mb-2 pr-16">
                {lead.first_name} {lead.last_name}
            </h3>

            {/* Service Type */}
            {lead.service_type && (
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                    {lead.service_type}
                </p>
            )}

            {/* Contact Info */}
            <div className="space-y-1.5 mb-3">
                {lead.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Mail01 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                )}
                {lead.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lead.phone}</span>
                    </div>
                )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                {/* Estimated Value */}
                {lead.estimated_value && (
                    <div className="flex items-center gap-1 text-xs text-green-400">
                        <CurrencyDollar className="w-3.5 h-3.5" />
                        <span className="font-medium">
                            {lead.estimated_value.toLocaleString()}
                        </span>
                    </div>
                )}

                {/* Follow-up Date or Source */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    {lead.follow_up_date ? (
                        <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                                {new Date(lead.follow_up_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </>
                    ) : (
                        <span className="capitalize">{lead.source}</span>
                    )}
                </div>
            </div>

            {/* Assigned User */}
            {lead.assigned_to && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-700/50">
                    <User01 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-400">Assigned</span>
                </div>
            )}

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {lead.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded text-xs bg-slate-800 text-slate-400"
                        >
                            {tag}
                        </span>
                    ))}
                    {lead.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-slate-800 text-slate-400">
                            +{lead.tags.length - 2}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
