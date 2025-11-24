export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost' | 'nurture';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export type LeadSource = 'website' | 'referral' | 'google' | 'facebook' | 'phone' | 'email' | 'other';

export interface Lead {
    id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    status: LeadStatus;
    priority: LeadPriority;
    source: LeadSource;
    service_type: string | null;
    service_description: string | null;
    estimated_value: number | null;
    follow_up_date: string | null;
    notes: string | null;
    tags: string[] | null;
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: string | null;
}

export interface LeadsByStatus {
    new: Lead[];
    contacted: Lead[];
    qualified: Lead[];
    quoted: Lead[];
    won: Lead[];
    lost: Lead[];
    nurture: Lead[];
}

export interface CreateLeadData {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    priority?: LeadPriority;
    source?: LeadSource;
    serviceType?: string;
    serviceDescription?: string;
    estimatedValue?: number;
    followUpDate?: string;
    notes?: string;
    tags?: string[];
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
    status?: LeadStatus;
    assignedTo?: string;
}
