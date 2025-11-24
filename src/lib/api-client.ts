/**
 * API Client for Home Service CRM
 * Handles all HTTP requests to the backend API with automatic token management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_PREFIX = '/api/v1';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        total: number;
        limit: number;
        offset: number;
    };
}

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL + API_PREFIX;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    }

    private setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('auth_token', token);
    }

    private removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('auth_token');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const token = this.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized - clear token
                if (response.status === 401) {
                    this.removeToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                }

                throw new ApiError(
                    data.error || data.message || 'Request failed',
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Network error or other issues
            throw new ApiError(
                error instanceof Error ? error.message : 'Network error',
                0
            );
        }
    }

    // Auth endpoints
    async register(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        companyName: string;
        subdomain: string;
    }): Promise<ApiResponse> {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.data?.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    async login(data: {
        email: string;
        password: string;
    }): Promise<ApiResponse> {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.data?.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    async getCurrentUser(): Promise<ApiResponse> {
        return this.request('/auth/me');
    }

    logout(): void {
        this.removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
    }

    // Customers endpoints
    async getCustomers(params?: {
        status?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<ApiResponse> {
        const queryString = params
            ? '?' + new URLSearchParams(params as any).toString()
            : '';
        return this.request(`/customers${queryString}`);
    }

    async getCustomer(id: string): Promise<ApiResponse> {
        return this.request(`/customers/${id}`);
    }

    async createCustomer(data: any): Promise<ApiResponse> {
        return this.request('/customers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCustomer(id: string, data: any): Promise<ApiResponse> {
        return this.request(`/customers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteCustomer(id: string): Promise<ApiResponse> {
        return this.request(`/customers/${id}`, {
            method: 'DELETE',
        });
    }

    // Leads endpoints
    async getLeads(params?: {
        status?: string;
        priority?: string;
        assignedTo?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<ApiResponse> {
        const queryString = params
            ? '?' + new URLSearchParams(params as any).toString()
            : '';
        return this.request(`/leads${queryString}`);
    }

    async getLeadsByStatus(): Promise<ApiResponse> {
        return this.request('/leads/by-status');
    }

    async getLead(id: string): Promise<ApiResponse> {
        return this.request(`/leads/${id}`);
    }

    async createLead(data: any): Promise<ApiResponse> {
        return this.request('/leads', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLead(id: string, data: any): Promise<ApiResponse> {
        return this.request(`/leads/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteLead(id: string): Promise<ApiResponse> {
        return this.request(`/leads/${id}`, {
            method: 'DELETE',
        });
    }

    // Health check
    async healthCheck(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.json();
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
