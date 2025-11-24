'use client';

import { useState } from 'react';
import { Plus, FilterLines, SearchSm, AlertCircle } from '@untitledui/icons';
import { AppLayout } from '@/components/layout/app-layout';
import { LeadsKanban } from '@/features/leads/components/leads-kanban';
import { useLeadsByStatus } from '@/features/leads/api/queries';
import type { Lead, LeadStatus } from '@/types/lead';

export default function LeadsPage() {
    const { data: leadsByStatus, isLoading, error } = useLeadsByStatus();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createDialogStatus, setCreateDialogStatus] = useState<LeadStatus>('new');

    function handleLeadClick(lead: Lead) {
        setSelectedLead(lead);
        // TODO: Open lead detail drawer/modal
        console.log('Open lead detail:', lead);
    }

    function handleCreateLead(status: LeadStatus) {
        setCreateDialogStatus(status);
        setCreateDialogOpen(true);
        // TODO: Open create lead dialog
        console.log('Create lead in status:', status);
    }

    return (
        <AppLayout>
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Leads Pipeline</h1>
                    <p className="mt-2 text-slate-400">
                        Manage and track your sales leads through the pipeline
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <SearchSm className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="
                                pl-10 pr-4 py-2 rounded-lg
                                bg-slate-800/50 border border-slate-700
                                text-white placeholder-slate-400
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                focus:border-blue-500/50
                                w-64
                            "
                        />
                    </div>

                    {/* Filter Button */}
                    <button className="
                        px-4 py-2 rounded-lg
                        bg-slate-800/50 border border-slate-700
                        text-slate-300 hover:text-white
                        hover:bg-slate-700 transition-colors
                        flex items-center gap-2
                    ">
                        <FilterLines className="w-4 h-4" />
                        <span>Filter</span>
                    </button>

                    {/* New Lead Button */}
                    <button
                        onClick={() => handleCreateLead('new')}
                        className="
                            px-4 py-2 rounded-lg
                            bg-blue-600 hover:bg-blue-700
                            text-white font-medium
                            transition-colors
                            flex items-center gap-2
                        "
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Lead</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {!isLoading && leadsByStatus && (
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-sm text-slate-400">Total Leads</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {Object.values(leadsByStatus).reduce(
                                (acc, leads) => acc + leads.length,
                                0
                            )}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-sm text-slate-400">New This Week</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {leadsByStatus.new?.length || 0}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-sm text-slate-400">In Negotiation</p>
                        <p className="mt-1 text-2xl font-bold text-white">
                            {leadsByStatus.quoted?.length || 0}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                        <p className="text-sm text-green-400">Won This Month</p>
                        <p className="mt-1 text-2xl font-bold text-green-300">
                            {leadsByStatus.won?.length || 0}
                        </p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-slate-400">Loading leads...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-lg bg-red-900/20 border border-red-500/30">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-300">Failed to load leads</h3>
                            <p className="mt-1 text-sm text-red-400">
                                {error instanceof Error ? error.message : 'An error occurred'}
                            </p>
                            <p className="mt-2 text-xs text-red-400/70">
                                Make sure the API server is running on port 5000 and PostgreSQL is configured.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            {!isLoading && !error && leadsByStatus && (
                <div className="mt-6">
                    <LeadsKanban
                        leadsByStatus={leadsByStatus}
                        onLeadClick={handleLeadClick}
                        onCreateLead={handleCreateLead}
                    />
                </div>
            )}

            {/* TODO: Add lead detail drawer/modal */}
            {/* TODO: Add create/edit lead dialog */}
        </AppLayout>
    );
}
