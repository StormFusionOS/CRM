'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Lead, LeadsByStatus, CreateLeadData, UpdateLeadData } from '@/types/lead';

// Query keys
export const leadKeys = {
    all: ['leads'] as const,
    lists: () => [...leadKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...leadKeys.lists(), filters] as const,
    byStatus: () => [...leadKeys.all, 'by-status'] as const,
    details: () => [...leadKeys.all, 'detail'] as const,
    detail: (id: string) => [...leadKeys.details(), id] as const,
};

// Queries
export function useLeads() {
    return useQuery({
        queryKey: leadKeys.lists(),
        queryFn: async () => {
            const response = await apiClient.getLeads();
            return response.data as Lead[];
        },
    });
}

export function useLeadsByStatus() {
    return useQuery({
        queryKey: leadKeys.byStatus(),
        queryFn: async () => {
            const response = await apiClient.getLeadsByStatus();
            return response.data as LeadsByStatus;
        },
        staleTime: 30000, // 30 seconds
    });
}

export function useLead(id: string) {
    return useQuery({
        queryKey: leadKeys.detail(id),
        queryFn: async () => {
            const response = await apiClient.getLead(id);
            return response.data as Lead;
        },
        enabled: !!id,
    });
}

// Mutations
export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateLeadData) => {
            const response = await apiClient.createLead(data);
            return response.data as Lead;
        },
        onSuccess: () => {
            // Invalidate both lists and by-status queries
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadKeys.byStatus() });
        },
    });
}

export function useUpdateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateLeadData }) => {
            const response = await apiClient.updateLead(id, data);
            return response.data as Lead;
        },
        onSuccess: (data) => {
            // Invalidate lists, by-status, and the specific lead detail
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadKeys.byStatus() });
            queryClient.invalidateQueries({ queryKey: leadKeys.detail(data.id) });
        },
    });
}

export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.deleteLead(id);
            return id;
        },
        onSuccess: () => {
            // Invalidate both lists and by-status queries
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadKeys.byStatus() });
        },
    });
}
